const fs = require('fs');
const PDFDocument = require('pdfkit-table');

export default function createPdfStream(
  records: any,
  fileName: string,
  ext: string
): any{
  let doc = new PDFDocument({margin: 30, size: 'A4'});
  const table = {
    title: 'Failed Customer Statements',
    headers: ['Transaction Reference', 'Description'],
    rows: records,
  };
    doc = new PDFDocument();
    doc.table(table, {
      width: 200,
      columnsSize: [100, 100],
    });
    doc.end();
    return doc;

}
