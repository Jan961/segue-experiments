import UploadModal from 'components/core-ui-lib/UploadModal';
import { useState } from 'react';
import { Button } from 'components/core-ui-lib/';
import axios from 'axios';
import { UploadedFile } from 'components/core-ui-lib/UploadModal/interface';

export const UploadLogoRenderer = (params, fetchProductionCompanies) => {
  const [openUploadModal, setOpenUploadModal] = useState<boolean>();
  const onSave = async (file, onProgress, onError) => {
    const formData = new FormData();
    formData.append('file', file[0].file);
    formData.append('Id', params.data.Id);
    const imageURL = URL.createObjectURL(file[0].file);
    const tempImage = new Image();
    tempImage.src = imageURL;
    tempImage.onload = async () => {
      if (tempImage.width <= 300 && tempImage.height <= 200) {
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

          progress = 100;
          onProgress(file[0].file, progress);
          clearInterval(slowProgressInterval);
        } catch (error) {
          onError(file[0].file, 'Error uploading file. Please try again.');
          clearInterval(slowProgressInterval);
        }
      } else {
        onError(file[0].file, 'This image is too big. Please upload a smaller image.');
      }
    };
  };
  const handleDelete = async () => {
    try {
      await fetch('/api/productionCompanies/logo/delete', {
        method: 'POST',
        headers: {},
        body: JSON.stringify({ Id: params.data.Id }),
      });
    } catch (exception) {
      console.log(exception);
    }
  };

  if (openUploadModal) {
    let value: UploadedFile;
    if (params.data.Logo !== '') {
      value = {
        imageUrl: params.data.Logo.currentSrc,
        name: 'Company Logo',
        size: params.data.Logo.size,
      };
    }
    return (
      <UploadModal
        visible={openUploadModal}
        title="Image Attachment"
        info="Please upload your company image here. Image should be no larger than 300px wide x 200px high (Max 500kb). Images in a square or portrait format will be proportionally scaled to fit with the rectangular boundary box.
Suitable image formats are jpg, tiff, svg, and png."
        allowedFormats={['image/jpg', 'image/png', 'image/tiff', 'image/svg']}
        onClose={() => {
          setOpenUploadModal(false);
          fetchProductionCompanies();
        }}
        maxFileSize={500 * 1024} // 0.5MB
        onSave={onSave}
        value={value}
        customHandleFileDelete={handleDelete}
      />
    );
  }
  if (params.data.Logo.length === 0) {
    return (
      <Button
        text="Upload Logo"
        variant="secondary"
        className="flex justify-center items-center ml-10 "
        onClick={() => setOpenUploadModal(true)}
        disabled={params.data.Id === null}
      />
    );
  } else {
    return <img src={params.data.Logo.src} alt="Company Logo" onClick={() => setOpenUploadModal(true)} />;
  }
};
