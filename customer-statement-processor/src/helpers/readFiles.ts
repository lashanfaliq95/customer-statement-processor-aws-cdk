import {promises as fs} from 'fs';

async function readFiles(dirname: string) {
  const filenames = await fs.readdir(dirname);
  return filenames;
}

export default readFiles;
