import * as path from 'path';

// Validate that endBalace=statBalance + mutation
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

const END_BALANCE_VALIDATION = 'End balance validation failed';
const UNIQUE_REFERENCE_VALIDATION = 'Duplicate reference';

function rowValidator(
  record: any,
  recordMap: any,
  failedRecords: any,
  isXml?: boolean
) {
  const reference = isXml ? record?.$.reference : record[0];
  const description = isXml ? record?.description[0] : record[2];
  const endBalance = isXml ? record?.endBalance[0] : record[5];
  const startBalance = isXml ? record?.startBalance[0] : record[3];
  const mutation = isXml ? record?.mutation[0] : record[4];

  // Check if a record fails either validate balace or if it's not unique
  if (
    !validateEndBalance({
      endBalance,
      startBalance,
      mutation,
    })
  ) {
    failedRecords.push([reference, description,END_BALANCE_VALIDATION]);
  } else if (recordMap[reference]) {
    // If there is another record with the same referenceId already, fail validation

    if (recordMap[reference]?.isFirst) {
      // Put the previous record that matched the current referenceId to failed records
      failedRecords.push(recordMap[reference].data);
      // Make isFirst false since the current record is pushed below line #47
      recordMap[reference].isFirst = false;
    }
    failedRecords.push([reference, description,UNIQUE_REFERENCE_VALIDATION]);
  }

  // If the referenceId is unique, insert it into the map
  if (!recordMap[reference]) {
    recordMap[reference] = {isFirst: true, data: [reference, description,UNIQUE_REFERENCE_VALIDATION]};
  }
}

// The core logic of the validation
function fileValidator(records: any, isXml?: boolean) {
  if(!records || records.length==0){
    return []
  }
  // Keep a map of each reference number : { 'refId': true }
  const recordMap = {};
  const failedRecords: any = [];
  records.forEach((record: any) => {
    rowValidator(record, recordMap, failedRecords, isXml);
  });

  return failedRecords;
}

// Return name and extension of a given file ex: ('records.csv')=>{name:'records', extension:'.csv'}
function getFileNameAndExtension(filePath: string) {
  return {name: path.parse(filePath).name, extension: path.extname(filePath)};
}

// Returns true is extension is csv
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
