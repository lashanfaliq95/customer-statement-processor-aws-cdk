import { S3 } from "@aws-sdk/client-s3";

const s3Connector = new S3({
  region: "eu-west-1",
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY!,
  },
});

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
  return format;
};
export async function writeToS3(file: any, name: string) {
  try {
    const outputBucket = process.env.REACT_APP_OUTPUT_BUCKET_NAME!;
    const params = {
      Key: name,
      Body: file,
      Bucket: outputBucket,
      ContentType: getFormat(name),
    };
    return await s3Connector.putObject(params);
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
}
