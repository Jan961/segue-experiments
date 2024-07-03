import aws from 'aws-sdk';

aws.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

export const getFileUrl = (fileLocation: string) => {
  return process.env.CLOUDFRONT_DOMAIN + '/' + fileLocation;
};

const s3 = new aws.S3();

export default s3;
