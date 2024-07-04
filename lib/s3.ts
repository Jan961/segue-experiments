import aws from 'aws-sdk';

aws.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

export const getFileUrl = (fileLocation: string) => {
  return `${process.env.CLOUDFRONT_DOMAIN}/${fileLocation}`;
};

const s3 = new aws.S3();

export const getFileUrl = async (path: string) => {
  // Define the parameters for getting the pre-signed URL
  const params = {
    Bucket: 'images',
    Key: path, // The key of your image file in the S3 bucket
    Expires: 60, // URL expiry time in seconds
  };

  try {
    // Get the pre-signed URL
    const url = s3.getSignedUrl('getObject', params);
    return url;
  } catch (error) {
    console.error('Error getting the pre-signed URL', error);
  }
};

export default s3;
