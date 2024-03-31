import s3Connector from '../connectors/s3Connector';

export async function readFromS3(file: string) {
  try {
    return await s3Connector.getObject({
      Bucket: process.env.INPUT_BUCKET_NAME!,
      Key: file,
    });
  } catch (ex) {
    console.error('Reading data from s3 failed.');
    return;
  }
}
