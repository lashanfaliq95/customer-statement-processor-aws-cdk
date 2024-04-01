import { S3 } from "@aws-sdk/client-s3";
import axios from 'axios'

const s3Connector = new S3({
  region: "eu-west-1",
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY!,
  },
});


export default async function readFromS3(file: string, bucket: string) {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/bucket/${bucket}/${file}`,    {responseType: 'blob'},

    );    
    const blob = new Blob([res?.data])

    return blob
  } catch (ex) {
    console.error("Reading data from s3 failed.", ex);
    return;
  }
}

