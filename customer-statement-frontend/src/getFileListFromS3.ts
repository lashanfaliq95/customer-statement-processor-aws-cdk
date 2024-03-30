import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { S3Client } from "@aws-sdk/client-s3";

const s3ClientConnector = new S3Client({
  region: "eu-west-1",
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY!,
  },
});

const getListFromS3 = async (isInputBucket?: boolean) => {
  const command = new ListObjectsV2Command({
    Bucket: isInputBucket
      ? process.env.REACT_APP_INPUT_BUCKET_NAME!
      : process.env.REACT_APP_OUTPUT_BUCKET_NAME!,
    MaxKeys: 100,
  });

  try {
    let isTruncated = true;

    console.log("Your bucket contains the following objects:\n");
    const contents: any = [];

    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken } =
        await s3ClientConnector.send(command);
      if (Contents) {
        contents.push(...Contents);
      }
      isTruncated = IsTruncated || false;
      command.input.ContinuationToken = NextContinuationToken;
    }

    // const contentsList = contents
    //   ?.filter(
    //     ({ Key }: { Key: string }) =>
    //       path.extname(Key!) === ".csv" || path.extname(Key!) === ".xml"
    //   )
    //   .map(({ Key }: { Key: string }) => Key);
    return contents;
  } catch (err) {
    console.error(err);
  }
};

export default getListFromS3;
