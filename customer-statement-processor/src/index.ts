import * as express from 'express';
import runOnCloud from './services/runOnCloud';
import runLocally from './services/runLocally';

const app = express();
const PORT = '8000';

// To run the job on cloud using s3's
app.get('/run-job-cloud', (req, res) => {
  runOnCloud();
  res.sendStatus(200);
});

// To run the job on locally using files in directories
app.get('/run-job-local', async (req, res) => {
  runLocally();
});

// Standard health check
app.get('/', async (req, res) => {
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
