import s3ClientConnector from '../connectors/s3ClientConnector';
import {GetObjectCommand} from '@aws-sdk/client-s3';

export async function readFromS3(file: string, bucket?:string) {
  try {
    const data = await s3ClientConnector.send(new GetObjectCommand({ Bucket:bucket, Key: file }));

    return data
  } catch (ex) {
    console.error('Reading data from s3 failed.');
    return;
  }
}
