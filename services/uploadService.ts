import s3 from 'lib/s3';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { FileDTO } from 'interfaces';

const bulkFileUpload = async (path, files, userId) => {
  const metadataList: FileDTO[] = [];

  for (const file of files) {
    const uniqueFileName = uuidv4() + '_' + file.originalFilename;
    const buffer = await fs.promises.readFile(file.filepath);
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${path || ''}/${uniqueFileName}`,
      Body: buffer,
    };
    const response = await s3.upload(params).promise();
    const data: FileDTO = {
      originalFilename: file.originalFilename,
      location: response?.Key,
      mediaType: file.mimetype,
      uploadUserId: userId,
      entity: '',
      entityId: 1234,
      uploadDateTime: new Date().toISOString(),
    };

    metadataList.push(data);
  }

  return metadataList;
};

const singleFileUpload = async (path, file, userId) => {
  const uniqueFileName = uuidv4() + '_' + file.originalFilename;
  const buffer = await fs.promises.readFile(file.filepath);
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${path || ''}/${uniqueFileName}`,
    Body: buffer,
  };

  const response = await s3.upload(params).promise();
  const data: FileDTO = {
    originalFilename: file.originalFilename,
    location: response?.Key,
    mediaType: file.mimetype,
    uploadUserId: userId,
    entity: '',
    entityId: 1234,
    uploadDateTime: new Date().toISOString(),
  };

  return data;
};

const transformForPrisma = (data: FileDTO | FileDTO[]) => {
  const transformedData = Array.isArray(data)
    ? data.map((item) => ({
        OriginalFilename: item.originalFilename,
        MediaType: item.mediaType,
        Location: item.location,
        UploadUserId: item.uploadUserId,
        UploadDateTime: item.uploadDateTime,
        Entity: item.entity,
        EntityId: item.entityId,
      }))
    : {
        OriginalFilename: data.originalFilename,
        MediaType: data.mediaType,
        Location: data.location,
        UploadUserId: data.uploadUserId,
        UploadDateTime: data.uploadDateTime,
        Entity: data.entity,
        EntityId: data.entityId,
      };

  return transformedData;
};

export { bulkFileUpload, singleFileUpload, transformForPrisma };
