import s3Connector from '../connectors/s3Connector';
const fs = require('fs');
import * as path from 'path';

// Pass readable stream 'doc' to s3
export async function writeToS3(name: string, ext: string, doc?: any) {
  try {
    const bucketName=`${name}-${ext}-output.pdf`
    const params = {
      Key: bucketName,
      Body: doc,
      Bucket: process.env.OUTPUT_BUCKET_NAME!,
      ContentType: 'application/pdf',
      ContentLength: doc?.readableLength,
    };
    console.log('Inserting file to bucket file:', bucketName);
    return await s3Connector.putObject(params);
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
}
