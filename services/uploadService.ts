import s3 from 'lib/s3';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const bulkFileUpload = async (path, files) => {
  const metadataList = [];

  for (const file of files) {
    const uniqueFileName = uuidv4() + '_' + file.originalFilename;
    const buffer = await fs.promises.readFile(file.filepath);
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${path || ''}/${uniqueFileName}`,
      Body: buffer,
    };
    const metadata = await s3.upload(params).promise();
    metadataList.push(metadata);
  }

  return { success: true, metadataList };
};

const singleFileUpload = async (path, file) => {
  const metadataList = [];
  const uniqueFileName = uuidv4() + '_' + file.originalFilename;
  const buffer = await fs.promises.readFile(file.filepath);
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${path || ''}/${uniqueFileName}`,
    Body: buffer,
  };

  const metadata = await s3.upload(params).promise();
  metadataList.push(metadata);

  return { success: true, metadata };
};

export { bulkFileUpload, singleFileUpload };
