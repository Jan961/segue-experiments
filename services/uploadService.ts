import s3 from 'lib/s3';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { FileDTO } from 'interfaces';
import config from 'config';
import { File } from 'prisma/generated/prisma-client';
import { UTCDate } from '@date-fns/utc';

const bulkFileUpload = async (path, files, userId) => {
  const metadataList: FileDTO[] = [];

  for (const file of files) {
    const uniqueFileName = uuidv4() + '_' + file.originalFilename;
    const buffer = await fs.promises.readFile(file.filepath);
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${path + '/' || ''}${uniqueFileName}`,
      Body: buffer,
      FileName: file.originalFilename,
      ContentDisposition: `attachment; filename="${file.originalFilename}"`,
    };
    const response = await s3.upload(params).promise();
    const data: FileDTO = {
      originalFilename: file.originalFilename,
      location: response?.Key,
      imageUrl: `${config.cloudFrontDomain}/${response?.Key}`,
      mediaType: file.mimetype,
      uploadUserId: userId,
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
    Key: `${path + '/' || ''}${uniqueFileName}`,
    Body: buffer,
    FileName: file.originalFilename,
    ContentDisposition: `attachment; filename="${file.originalFilename}"`,
  };

  const response = await s3.upload(params).promise();
  const data: FileDTO = {
    originalFilename: file.originalFilename,
    location: response?.Key,
    imageUrl: `${config.cloudFrontDomain}/${response?.Key}`,
    mediaType: file.mimetype,
    uploadUserId: userId,
    uploadDateTime: new Date().toISOString(),
  };

  return data;
};

export const deleteFile = async (location: string) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: location,
  };
  return s3.deleteObject(params).promise();
};

const transformForPrisma = (data: FileDTO) => {
  return {
    Id: data.id,
    OriginalFilename: data.originalFilename,
    MediaType: data.mediaType,
    Location: data.location,
    UploadUserId: data.uploadUserId,
    UploadDateTime: new Date(data.uploadDateTime),
  };
};

const transformForUi = (data: File): Partial<FileDTO> => {
  return {
    id: data.Id,
    originalFilename: data.OriginalFilename,
    mediaType: data.MediaType,
    location: data.Location,
    uploadUserId: data.UploadUserId,
    uploadDateTime: new UTCDate(data.UploadDateTime).toISOString(),
  };
};

export { bulkFileUpload, singleFileUpload, transformForPrisma, transformForUi };
