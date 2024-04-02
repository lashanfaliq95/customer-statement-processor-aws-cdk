import {fileValidator} from '../src/utils';
import {
  mockParsedCsvRecords,
  mockFailedCsvRecrods,
  mockParsedXmlRecords,
  mockFailedXmlRecrods,
  mockParsedInvalidXmlRecords,
  mockFailedInvalidXmlRecords,
  mockParsedInvalidCsvRecords,
  mockFailedInvalidCsvRecords,
} from './mocks';
describe('Test utils', () => {
  test('Check if output is correct for a csv', () => {
    expect(fileValidator(mockParsedCsvRecords)).toEqual(mockFailedCsvRecrods);
  });

  test('Check if output is correct for a xml', () => {
    expect(fileValidator(mockParsedXmlRecords, true)).toEqual(
      mockFailedXmlRecrods
    );
  });

  test('Check if it return empty array if input is empty', () => {
    expect(fileValidator(null)).toEqual([]);
  });

  test('Check if output is correct for a xml with all invalid records', () => {
    expect(fileValidator(mockParsedInvalidXmlRecords, true)).toEqual(
      mockFailedInvalidXmlRecords
    );
  });

  test('Check if output is correct for a csv with all invalid records', () => {
    expect(fileValidator(mockParsedInvalidCsvRecords)).toEqual(
      mockFailedInvalidCsvRecords
    );
  });
});
