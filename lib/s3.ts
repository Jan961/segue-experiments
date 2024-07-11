import aws from 'aws-sdk';

aws.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

export const getFileUrl = (fileLocation: string) => {
  return fileLocation ? `${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN}/${fileLocation}` : '';
};

const s3 = new aws.S3();

export default s3;
