import s3Connector from '../connectors/s3Connector';
import {promises as fs} from 'fs';
import {Upload} from '@aws-sdk/lib-storage';

export async function writeToS3Service(file: any) {
  const data = await fs.readFile(file.path);

  try {
    const params = {
      Key: file.originalFilename,
      Body: data,
      Bucket: process.env.INPUT_BUCKET_NAME!,
    };

    const parallelUploads3 = new Upload({
      client: s3Connector,
      params:params,

      queueSize: 4, // optional concurrency configuration
      partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
      leavePartsOnError: false, // optional manually handle dropped parts
    });

  
    console.log('Inserting file to bucket file1:', file.originalFilename,);

    await parallelUploads3.done();
  } catch (e) {
    console.log(e);
  }
}
