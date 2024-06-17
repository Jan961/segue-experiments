import UploadModal from 'components/core-ui-lib/UploadModal';
import { useState } from 'react';
import { Button } from 'components/core-ui-lib/';
import axios from 'axios';

export const UploadLogoRenderer = (params) => {
  const [openUploadModal, setOpenUploadModal] = useState<boolean>();

  const onSave = async (file, onProgress, onError) => {
    const formData = new FormData();
    formData.append('file', file[0].file);
    formData.append('Id', params.data.Id);

    let progress = 0;
    let slowProgressInterval;

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
      if (response.status >= 400 && response.status <= 499) {
        onError(file[0].file, 'Error uploading file. Please try again.');
        clearInterval(slowProgressInterval);
      }
      console.log(response);

      progress = 100;
      onProgress(file[0].file, progress);
      clearInterval(slowProgressInterval);
    } catch (error) {
      onError(file[0].file, 'Error uploading file. Please try again.');
      clearInterval(slowProgressInterval);
    }
  };

  const handleDelete = async () => {
    const response = await fetch('/api/productionCompanies/logo/delete', {
      method: 'POST',
      headers: {},
      body: JSON.stringify({ Id: params.data.Id }),
    });
    console.log(response);
  };

  if (openUploadModal) {
    console.log(params.data);
    return (
      <UploadModal
        visible={openUploadModal}
        title="Image Attachment"
        info="Please upload your file by dragging it into the grey box below or by clicking the upload cloud."
        allowedFormats={['image/jpg', 'image/png', 'image/tiff', 'image/svg']}
        onClose={() => {
          setOpenUploadModal(false);
        }}
        maxFileSize={512 * 1024} // 0.5MB
        onSave={onSave}
        value={{ imageUrl: params.data.Logo.currentSrc }}
        customHandleFileDelete={handleDelete}
      />
    );
  }
  if (params.data.Logo.length === 0) {
    return <Button text="Upload Logo" variant="secondary" onClick={() => setOpenUploadModal(true)} />;
  } else {
    return <img src={params.data.Logo.src} alt="Company Logo" onClick={() => setOpenUploadModal(true)} />;
  }
};
