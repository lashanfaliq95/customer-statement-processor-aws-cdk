const PDFDocument = require('pdfkit-table');

export default function createPdfStream(
  records: any,
): any{
  let doc = new PDFDocument({margin: 30, size: 'A4'});
  const table = {
    title: 'Failed Customer Statements',
    headers: ['Transaction Reference', 'Description',"Failure reason"],
    rows: records,
  };
    doc = new PDFDocument();
    doc.table(table, {
      width: 300,
      columnsSize: [100, 100,100],
    });
    doc.end();
    return doc;

}
