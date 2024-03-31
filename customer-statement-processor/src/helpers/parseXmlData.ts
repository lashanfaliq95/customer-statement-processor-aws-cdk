import {fileValidator} from '../utils';
import parser from '../parsers/xmlParser';

export default async function parseXmlData(content: any) {
  return new Promise((resolve, reject) => {
    parser.parseString(content, async (err: any, result: any) => {
      if (err) {
        return reject(err);
      }
      const failedRecords = fileValidator(result?.records?.record, true);
      return resolve(failedRecords);
    });
  });
}
