import { S3 } from "@aws-sdk/client-s3";

const s3Connector = new S3({
  region: "eu-west-1",
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY!,
  },
});

export default async function readFromS3(file: string) {
  try {
    console.log(file);
    return await s3Connector.getObject({
      Bucket: process.env.REACT_APP_INPUT_BUCKET_NAME!,
      Key: file,
    });
  } catch (ex) {
    console.error("Reading data from s3 failed.", ex);
    return;
  }
}
