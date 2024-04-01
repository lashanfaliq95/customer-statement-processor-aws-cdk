import {ListObjectsV2Command} from '@aws-sdk/client-s3';
import {S3Client} from '@aws-sdk/client-s3';
import * as path from 'path';

const s3ClientConnector = new S3Client({
  region: 'eu-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const getListFromS3 = async (bucketName?:string,isNotFiltered?:boolean) => {
  const command = new ListObjectsV2Command({
    Bucket: bucketName||process.env.INPUT_BUCKET_NAME!,
    MaxKeys: 100,
  });

  try {
    let isTruncated = true;

    const contents: any = [];

    while (isTruncated) {
      const {Contents, IsTruncated, NextContinuationToken} =
        await s3ClientConnector.send(command);
      if (Contents) {
        contents.push(...Contents);
      }
      isTruncated = IsTruncated || false;
      command.input.ContinuationToken = NextContinuationToken;
    }

    const contentsList = contents
      ?.filter(
        ({Key}: {Key: string}) =>
          path.extname(Key!) === '.csv' || path.extname(Key!) === '.xml'
      )

    return Promise.resolve(isNotFiltered? contents:contentsList);
  } catch (err) {
    console.error(err);
    Promise.reject(err)
  }
};
