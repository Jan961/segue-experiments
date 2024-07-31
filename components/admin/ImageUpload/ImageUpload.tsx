import { UploadModal, Button } from 'components/core-ui-lib';
import { getFileUrl } from 'lib/s3';
import { useEffect, useState } from 'react';
import { uploadFile } from 'requests/upload';
import { UploadedFile } from 'components/core-ui-lib/UploadModal/interface';
import Image from 'next/image';
import axios from 'axios';

export const ImageUpload = () => {
  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile>(null);

  const onUploadSuccess = async ({ fileId }) => {
    await axios.post('/api/admin/accountDetails/accountLogo/update', { fileId });
  };

  const onSave = async (file, onProgress, onError, onUploadingImage) => {
    const formData = new FormData();
    formData.append('file', file[0].file);
    formData.append('path', `admin/account/logo`);

    try {
      const response = await uploadFile(formData, onProgress, onError, onUploadingImage);
      if (response.status >= 400 && response.status < 600) {
        onError(file[0].file, 'Error uploading file. Please try again.');
      } else {
        setUploadedFile({
          id: response.id,
          name: response.originalFilename,
          imageUrl: getFileUrl(response.location),
          size: null,
          location: response.location,
        });
        onUploadSuccess({ fileId: response.id });
      }
    } catch (error) {
      onError(file[0].file, 'Error uploading file. Please try again.');
    }
  };

  const onDelete = async () => {
    try {
      console.log(uploadedFile.location);
      await axios.delete(`/api/file/delete?location=${uploadedFile.location}`);
      console.log('here');
      await axios.post('/api/admin/accountDetails/accountLogo/update', { fileId: null });
    } catch (exception) {
      console.log(exception, 'Error. Failed to delete file.');
    }
  };

  useEffect(() => {
    const fetchAccountLogo = async () => {
      try {
        const response = await fetch('/api/admin/accountDetails/accountLogo/read', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          body: null,
        });
        const data = await response.json();
        const file = data.accountLogoFile.File;
        setUploadedFile({
          id: file.Id,
          name: file.OriginalFilename,
          imageUrl: getFileUrl(file.Location),
          size: null,
          location: file.Location,
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchAccountLogo();
  }, []);

  return (
    <div className="h-[190px] overflow-y-hidden overflow-x-hidden bg-green-500">
      <div className="mt-[24px] bg-red-500">
        <div className="flex items-center justify-end gap-x-3 ">
          <p className="text-primary-input-text">Company Logo</p>

          {uploadedFile ? (
            <Image
              src={uploadedFile.imageUrl}
              alt="..."
              width={50}
              height={50}
              onClick={() => setOpenUploadModal(true)}
            />
          ) : (
            <Button
              onClick={() => {
                setOpenUploadModal(true);
              }}
              text="Upload"
              variant="secondary"
              className="w-[132px] mr-1"
            />
          )}

          <UploadModal
            title="Upload Company Logo"
            visible={openUploadModal}
            info="Please upload your company logo here. Image should be no larger than 300px wide x 200px high (Max 500kb). Images in a square or portrait format will be proportionally scaled to fit with the rectangular boundary box. Suitable image formats are jpg, tiff, svg, and png."
            allowedFormats={['image/jpg', 'image/tiff', 'image/svg', 'image/png']}
            onClose={() => {
              setOpenUploadModal(false);
            }}
            maxFileSize={1024 * 500}
            onSave={onSave}
            value={uploadedFile}
            customHandleFileDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
};
