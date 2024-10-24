import s3 from 'lib/s3';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { FileDTO } from 'interfaces';
import config from 'config';
import { File } from 'prisma/generated/prisma-client';

const bulkFileUpload = async (files, userId) => {
  const metadataList: FileDTO[] = [];

  for (const file of files) {
    const uniqueFileId = uuidv4();
    const buffer = await fs.promises.readFile(file.filepath);
    const stats = await fs.promises.stat(file.filepath);
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: uniqueFileId,
      Body: buffer,
      FileName: file.originalFilename,
      ContentDisposition: `attachment; filename="${file.originalFilename}"`,
    };

    const response = await s3.upload(params).promise();
    const data: FileDTO = {
      id: uniqueFileId,
      originalFilename: file.originalFilename,
      location: response?.Key,
      imageUrl: `${config.cloudFrontDomain}/${response?.Key}`,
      mediaType: file.mimetype,
      uploadUserId: userId,
      fileLastModifiedDateTime: new Date().toISOString(),
      fileCreatedDateTime: stats.birthtime.toISOString(),
    };

    metadataList.push(data);
  }

  return metadataList;
};

const singleFileUpload = async (path, file, userId) => {
  const uniqueFileId = uuidv4();
  const buffer = await fs.promises.readFile(file.filepath);
  const stats = await fs.promises.stat(file.filepath);
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: uniqueFileId,
    Body: buffer,
    FileName: file.originalFilename,
    ContentDisposition: `attachment; filename="${file.originalFilename}"`,
  };

  const response = await s3.upload(params).promise();
  const data: FileDTO = {
    id: uniqueFileId,
    originalFilename: file.originalFilename,
    location: response?.Key,
    imageUrl: `${config.cloudFrontDomain}/${response?.Key}`,
    mediaType: file.mimetype,
    uploadUserId: userId,
    fileLastModifiedDateTime: new Date().toISOString(),
    fileCreatedDateTime: stats.birthtime.toISOString(),
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
    OriginalFilename: data.originalFilename,
    MediaType: data.mediaType,
    Location: data.location,
    UploadUserId: data.uploadUserId,
    FileCreatedDateTime: new Date(data.fileCreatedDateTime),
    FileLastModifiedDateTime: new Date(data.fileLastModifiedDateTime),
  };
};

const transformForUi = (data: File): Partial<FileDTO> => {
  return {
    originalFilename: data.OriginalFilename,
    mediaType: data.MediaType,
    location: data.Location,
    uploadUserId: data.UploadUserId,
    fileCreatedDateTime: data.FileCreatedDateTime.toDateString(),
    fileLastModifiedDateTime: data.FileLastModifiedDateTime.toDateString(),
  };
};

export { bulkFileUpload, singleFileUpload, transformForPrisma, transformForUi };

// FileCreatedDateTime      DateTime         @db.DateTime(0)
// FileLastModifiedDateTime DateTime     @db.DateTime(0)
