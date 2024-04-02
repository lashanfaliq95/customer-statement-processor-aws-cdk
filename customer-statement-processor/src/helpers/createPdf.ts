const fs = require('fs');
const PDFDocument = require('pdfkit-table');

export default function createPdf(
  records: any,
  fileName: string,
  ext: string
): Promise<any> {
  let doc = new PDFDocument({margin: 30, size: 'A4'});
  const table = {
    title: 'Failed Customer Statements',
    headers: ['Transaction Reference', 'Description', "Failure reason"],
    rows: records,
  };
  return new Promise((resolve, reject) => {
    doc = new PDFDocument();

    const writeStream = fs.createWriteStream(
      `./${process.env.OUTPUT_DIRECTORY_NAME!}/${fileName}-${ext}-output.pdf`
    );
    doc.pipe(writeStream);
    doc.table(table, {
      width: 300,
      columnsSize: [100, 100,100],
    });
    doc.end();
    writeStream
      .on('finish', () => {
        console.log(
          'Completed writing file:',
          `./${process.env
            .OUTPUT_DIRECTORY_NAME!}/${fileName}-${ext}-output.pdf`
        );
        resolve(true);
      })
      .on('error', () => {
        console.log('Failed to write file:', fileName);
        reject();
      });
  });
}
