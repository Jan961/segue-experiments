import { isNullOrEmpty } from './index';
import axios from 'axios';

export const uploadFile = async (file: FormData, progress: number, slowProgressInterval) => {
  if (isNullOrEmpty(file.get('file'))) {
    const response = await axios.post('/api/upload', file, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (percentCompleted <= 50) {
          progress = percentCompleted;
        } else if (percentCompleted === 100) {
          progress = 50;
          clearInterval(slowProgressInterval);
          slowProgressInterval = setInterval(() => {
            if (progress < 95) {
              progress += 0.5;
            } else {
              clearInterval(slowProgressInterval);
            }
          }, 100);
        }
      },
    });

    return response;
  } else {
    return null;
  }
};

export const uploadMultipleFiles = async (fileList: FormData[], callback: (response: any) => Promise<void>) => {
  let progress = 0; // to track overall progress
  let slowProgressInterval; // interval for slow progress simulation
  await Promise.all(
    fileList.map(async (file) => {
      const response = await uploadFile(file, progress, slowProgressInterval);
      progress = 100;
      clearInterval(slowProgressInterval);
      await callback(response);
    }),
  );
};
