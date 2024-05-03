import s3 from 'lib/s3';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const bulkFileUpload = async (path, files, userId) => {
  const metadataList = [];

  for (const file of files) {
    const uniqueFileName = uuidv4() + '_' + file.originalFilename;
    const buffer = await fs.promises.readFile(file.filepath);
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${path || ''}/${uniqueFileName}`,
      Body: buffer,
    };
    const response = await s3.upload(params).promise();
    const data = {
      OriginalFilename: file.originalFilename,
      Location: response?.Key,
      MediaType: file.mimetype,
      UploadUserId: userId,
      Entity: '',
      EntityId: 1234,
      UploadDateTime: new Date().toISOString(),
    };

    metadataList.push(data);
  }

  return { success: true, metadataList };
};

const singleFileUpload = async (path, file, userId) => {
  const metadataList = [];
  const uniqueFileName = uuidv4() + '_' + file.originalFilename;
  const buffer = await fs.promises.readFile(file.filepath);
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${path || ''}/${uniqueFileName}`,
    Body: buffer,
  };

  const response = await s3.upload(params).promise();
  const data = {
    OriginalFilename: file.originalFilename,
    Location: response?.Key,
    MediaType: file.mimetype,
    UploadUserId: userId,
    Entity: '',
    EntityId: 1234,
    UploadDateTime: new Date().toISOString(),
  };

  metadataList.push(data);

  return { success: true, metadataList };
};

export { bulkFileUpload, singleFileUpload };
