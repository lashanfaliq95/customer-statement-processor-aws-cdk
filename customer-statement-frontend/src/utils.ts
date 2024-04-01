const filePattern = /\.[0-9a-z]+$/i;
const csvFormat = "text/csv;charset=utf-8;";
const xmlFormat = "text/xml;charset=utf-8;";
const pdfFormat = "application/pdf";

const getFormat = (file: string) => {
    const ext = file.match(filePattern)?.[0];
    let format;
    if (ext === ".csv") {
      format = csvFormat;
    } else if (ext === ".xml") {
      format = xmlFormat;
    } else {
      format = pdfFormat;
    }
    console.log(file, format);
    return format;
  };

  export {getFormat}