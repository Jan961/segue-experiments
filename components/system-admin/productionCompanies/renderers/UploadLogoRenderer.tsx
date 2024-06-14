import UploadModal from 'components/core-ui-lib/UploadModal';
import { useState } from 'react';
import { Button } from '../../../core-ui-lib';
import axios from 'axios';

export const UploadLogoRenderer = (params) => {
  const [openUploadModal, setOpenUploadModal] = useState<boolean>();

  const uint8ArrayToBase64 = (uint8Array) => {
    const binaryString = uint8Array.reduce((data, byte) => {
      return data + String.fromCharCode(byte);
    }, '');
    return btoa(binaryString);
  };
  const onSave = async (file, onProgress, onError) => {
    console.log('saving', file);

    const formData = new FormData();
    formData.append('file', file[0].file); // Assuming file[0].file is the actual file object
    formData.append('path', 'marketing/');
    formData.append('Id', params.data.Id); // Pass the Id value to the form data

    let progress = 0; // to track overall progress
    let slowProgressInterval; // interval for slow progress simulation

    try {
      const response = await axios.post('/api/productionCompanies/logo/insert', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
                onProgress(file[0].file, progress);
              } else {
                clearInterval(slowProgressInterval);
              }
            }, 100);
          }
          onProgress(file[0].file, progress);
        },
      });

      progress = 100;
      onProgress(file[0].file, progress);
      clearInterval(slowProgressInterval);
      console.log(response);
    } catch (error) {
      onError(file[0].file, 'Error uploading file. Please try again.');
      clearInterval(slowProgressInterval);
    }
  };

  if (params.data.Logo === null) {
    if (openUploadModal) {
      return (
        <UploadModal
          visible={openUploadModal}
          title="Image Attachment"
          info="Please upload your file by dragging it into the grey box below or by clicking the upload cloud."
          allowedFormats={['image/jpeg', 'image/png', 'image/gif', 'image/bmp']}
          onClose={() => {
            setOpenUploadModal(false);
          }}
          maxFileSize={5120 * 1024} // 5MB
          onSave={onSave}
        />
      );
    } else {
      return <Button text="Upload Logo" variant="secondary" onClick={() => setOpenUploadModal(true)} />;
    }
  } else {
    const byteArray = new Uint8Array(params.data.Logo.data);
    const base64String = uint8ArrayToBase64(byteArray);
    const srcTag = 'data:image/png;base64,' + base64String;
    console.log(srcTag);
    return <img src={srcTag} alt="Base64 Image" />;
  }
};
