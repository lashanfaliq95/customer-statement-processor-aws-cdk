import axios from 'axios'

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

