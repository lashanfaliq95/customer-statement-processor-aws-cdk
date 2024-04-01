import {readFromS3} from '../helpers/readFromS3';
import {getListFromS3} from '../helpers/getFileListFromS3';
import parseCsvData from '../helpers/parserCsvData';
import parseXmlData from '../helpers/parseXmlData';
import {writeToS3} from '../helpers/writeToS3';
import createPdfStream from '../helpers/createPdfStream'
import {getFileNameAndExtension, isCsv} from '../utils';

export default async function runOnCloud() {
  const fileList = await getListFromS3();
  if (!fileList || fileList.length === 0) {
    console.log('No files in s3');
    return;
  }
console.log(fileList)
  for (let i = 0; i < fileList.length; i++) {
    const response = await readFromS3(fileList[i].Key);
    const {name, extension} = getFileNameAndExtension(fileList[i].Key);
    let failedRecords;
    const content = await response?.Body?.transformToString();

    if (isCsv(extension)) {
      failedRecords = await parseCsvData(content);
    } else {
      failedRecords = await parseXmlData(content);
    }
    const doc= createPdfStream(failedRecords, name, extension);
    await writeToS3(name, extension,doc);
  }
}
