import {parse} from 'csv-parse/sync';
import {fileValidator} from '../utils';

export default async function parseCsvData(content: any) {
  return new Promise(async (resolve, reject) => {
    const records = await parse(content, {delimiter: ',', from_line: 2});
    const failedRecords = fileValidator(records, false);

    resolve(failedRecords);
  });
}
