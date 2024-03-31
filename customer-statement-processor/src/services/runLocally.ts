import {promises as fs} from 'fs';

import readFiles from '../helpers/readFiles';
import parseCsvData from '../helpers/parserCsvData';
import parseXmlData from '../helpers/parseXmlData';
import createPdf from '../helpers/createPdf';
import { getFileNameAndExtension } from '../utils';

export default async function runLocally() {
  const READ_DIRECTORY = process.env.INPUT_DIRECTORY_NAME!;
  const filenames = await readFiles(READ_DIRECTORY);

  if (!filenames || filenames.length === 0) {
    console.log('No files found in directory: ', READ_DIRECTORY);
    return;
  }
  for (let i = 0; i < filenames?.length; i++) {
    const {name,extension}=getFileNameAndExtension(filenames[i])
    const data = await fs.readFile(READ_DIRECTORY + '/' + filenames[i]);

    if (extension === '.csv') {
      const content = await parseCsvData(data.toString());
      await createPdf(content, name, '.csv');
    } else {
      const content = await parseXmlData(data.toString());
      await createPdf(content, name, '.xml');
    }
  }
}
