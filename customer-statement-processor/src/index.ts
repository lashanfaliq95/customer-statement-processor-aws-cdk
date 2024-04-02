import {Express} from 'express';
import * as multiparty from 'multiparty';

import runOnCloud from './services/runOnCloud';
import runLocally from './services/runLocally';
import {getListFromS3} from './helpers/getFileListFromS3';
import {writeToS3Service} from './services/writeToS3Service';
import {readFromS3} from './helpers/readFromS3Stream';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app: Express = express();
const PORT = '8000';

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser());
app.use(cors(corsOptions));

// To run the job on cloud using s3's
app.post('/run-job-cloud', (_req, res) => {
  console.log('Starting job...');
  if (process.env.AWS_ACCESS_KEY_ID) {
    // Only run if there are aws credentials
    runOnCloud();
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }
});

// To run the job on locally using files in directories
app.post('/run-job-local', async (_req, res) => {
  runLocally();
  res.sendStatus(200);
});

app.post('/upload-file/bucket/:bucketId', async (req, res) => {
  var form = new multiparty.Form();
  form.parse(req, async function (err: any, _fields: any, files: any) {
    if (err) {
      res.sendStatus(500);
    }

    await writeToS3Service(files.file[0]);

    res.sendStatus(200);
  });
});

app.get('/bucket/:bucketId/:file', async (req, res) => {
  const bucket = req.params.bucketId;
  const file = req.params.file;

  const result: any = await readFromS3(file, bucket);
  result.Body.pipe(res);
});
// Standard health check
app.get('/', async (_req, res) => {
  res.sendStatus(200);
});

// Standard health check
app.get('/file-list/bucket/:bucketId', async (req, res) => {
  const bucket = req.params.bucketId;
  console.log('Reading file list for bucket:', bucket);
  const data = await getListFromS3(bucket, true);

  res.status(200).json(data);
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
