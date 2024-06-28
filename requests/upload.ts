// export const uploadFile = async (formData, onProgress)=>{
//     let progress = 0; // to track overall progress
//     let slowProgressInterval; // interval for slow progress simulation
//     return axios
//       .post('/api/upload', formData, {
//         onUploadProgress: (progressEvent) => {
//           const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//           if (percentCompleted <= 50) {
//             progress = percentCompleted;
//           } else if (percentCompleted === 100) {
//             progress = 50;
//             clearInterval(slowProgressInterval);
//             slowProgressInterval = setInterval(() => {
//               if (progress < 95) {
//                 progress += 0.5;
//                 onProgress(file[0].file, progress);
//               } else {
//                 clearInterval(slowProgressInterval);
//               }
//             }, 100);
//           }

//           onProgress(file[0].file, progress);
//         },
//       }) // eslint-disable-next-line
//       .then((response: any) => {
//         progress = 100;
//         onProgress(file[0].file, progress);
//       })
// }

import axios from 'axios';
import { notify } from 'components/core-ui-lib';
import { ToastMessages } from 'config/shows';

interface UploadImageResponse {
  location: string;
  [key: string]: any;
}

export const uploadFile = async (
  formData: FormData,
  onProgress: (file: File, progress: number) => void,
  onError: (file: File, errorMessage: string) => void,
  onUploadingImage: (file: File, url: string) => void,
): Promise<UploadImageResponse> => {
  let progress = 0;
  let slowProgressInterval: number;

  try {
    const response = await axios.post<UploadImageResponse>('/api/upload', formData, {
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
              onProgress(formData.get('file') as File, progress);
            } else {
              clearInterval(slowProgressInterval);
            }
          }, 100);
        }

        onProgress(formData.get('file') as File, progress);
      },
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
