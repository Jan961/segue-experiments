import axios from 'axios';
import { notify } from 'components/core-ui-lib';
import { ToastMessages } from 'config/shows';
import { isNullOrEmpty } from '../utils';

interface UploadImageResponse {
  id?: number;
  location: string;
  originalFilename: string;
  [key: string]: any;
}

export const onUploadProgress = (progressEvent, formData, progress, slowProgressInterval, onProgress = null) => {
  const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
  if (percentCompleted === 100) {
    return;
  }
  if (percentCompleted <= 50) {
    progress = percentCompleted;
  } else if (percentCompleted === 100) {
    progress = 50;
    clearInterval(slowProgressInterval);
    slowProgressInterval = setInterval(() => {
      if (progress < 95) {
        progress += 0.5;
        if (onProgress) onProgress(formData.get('file') as File, progress);
      } else {
        clearInterval(slowProgressInterval);
      }
    }, 100);
  }
  if (onProgress) onProgress(formData.get('file') as File, progress);
};

export const uploadFile = async (
  formData: FormData,
  onProgress: (file: File, progress: number) => void,
  onError: (file: File, errorMessage: string) => void,
  onUploadingImage: (file: File, url: string) => void,
): Promise<UploadImageResponse> => {
  let progress = 0;
  let slowProgressInterval: ReturnType<typeof setInterval>;

  try {
    const response = await axios.post<UploadImageResponse>('/api/upload', formData, {
      onUploadProgress: (progressEvent) =>
        onUploadProgress(progressEvent, formData, progress, slowProgressInterval, onProgress),
    });

    progress = 100;
    onProgress(formData.get('file') as File, progress);
    clearInterval(slowProgressInterval);
    notify.success(ToastMessages.imageUploadSuccess);

    onUploadingImage(
      formData.get('file') as File,
      `${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN}/${response.data.location}`,
    );

    return response.data;
  } catch (error) {
    notify.error(ToastMessages.imageUploadFailure);
    onError(formData.get('file') as File, 'Error uploading file. Please try again.');
    clearInterval(slowProgressInterval);
    throw new Error('Error uploading file. Please try again.');
  }
};

export const headlessUpload = async (file: FormData, progress: number, slowProgressInterval) => {
  if (isNullOrEmpty(file.get('file'))) {
    const response = await axios.post('/api/upload', file, {
      onUploadProgress: (progressEvent) => onUploadProgress(progressEvent, file, progress, slowProgressInterval, null),
    });
    notify.success(ToastMessages.imageUploadSuccess);
    return response;
  } else {
    return null;
  }
};

export const headlessUploadMultiple = async (fileList: FormData[], callback: (response: any) => Promise<void>) => {
  let progress = 0; // to track overall progress
  let slowProgressInterval; // interval for slow progress simulation
  await Promise.all(
    fileList.map(async (file) => {
      console.log(file);
      const response = await headlessUpload(file, progress, slowProgressInterval);
      progress = 100;
      clearInterval(slowProgressInterval);
      await callback(response);
    }),
  );
};
