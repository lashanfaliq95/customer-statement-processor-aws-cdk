import * as path from 'path';

function validateEndBalance({
  endBalance,
  startBalance,
  mutation,
}: {
  mutation: string;
  startBalance: string;
  endBalance: string;
}): boolean {
  const calculatedBalance = parseFloat(
    (parseFloat(startBalance) + parseFloat(mutation)).toFixed(2)
  );

  return calculatedBalance === parseFloat(endBalance);
}

function rowValidator(
  record: any,
  recordMap: any,
  failedRecords: any,
  isXml?: boolean
) {
  const xmlReference = isXml ? record?.$.reference : null;
  const reference = isXml ? xmlReference : record[0];
  const description = isXml ? record?.description[0] : record[2];

  if (
    !validateEndBalance({
      endBalance: isXml ? record?.endBalance[0] : record[5],
      startBalance: isXml ? record?.startBalance[0] : record[3],
      mutation: isXml ? record?.mutation[0] : record[4],
    }) ||
    recordMap[reference]
  ) {
    if (recordMap[reference]?.isFirst) {
      failedRecords.push([reference, description]);
      recordMap[reference].isFirst = false;
    }
    failedRecords.push([reference, description]);
  }

  if (!recordMap[record[0]]) {
    recordMap[record[0]] = {isFirst: true, data: [reference, description]};
  }
}

function fileValidator(records: any, isXml?: boolean) {
  const recordMap = {};
  const failedRecords: any = [];
  records.forEach((record: any) => {
    rowValidator(record, recordMap, failedRecords, isXml);
  });

  return failedRecords;
}

function getFileNameAndExtension(filePath: string) {
  return {name: path.parse(filePath).name, extension: path.extname(filePath)};
}

function isCsv(extension: string) {
  return extension === '.csv';
}

export {
  validateEndBalance,
  rowValidator,
  fileValidator,
  getFileNameAndExtension,
  isCsv,
};
