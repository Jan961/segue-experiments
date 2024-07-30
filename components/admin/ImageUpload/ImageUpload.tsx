import { UploadModal, Button } from 'components/core-ui-lib';
import { getFileUrl } from 'lib/s3';
import { useEffect, useState } from 'react';
import { uploadFile } from 'requests/upload';
import Image from 'next/image';
import axios from 'axios';

export const ImageUpload = () => {
  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);

  const onUploadSuccess = async ({ fileId }) => {
    await axios.post('/api/admin/accountDetails/update', { fileId });
  };

  const onSave = async (file, onProgress, onError, onUploadingImage) => {
    const formData = new FormData();
    console.log(file);
    console.log('yo');
    formData.append('file', file[0].file);
    formData.append('path', `admin/account/logo`);

    try {
      const response = await uploadFile(formData, onProgress, onError, onUploadingImage);
      if (response.status >= 400 && response.status < 600) {
        onError(file[0].file, 'Error uploading file. Please try again.');
      } else {
        console.log('uploaded ok, here is response locaton:');
        console.log(getFileUrl(response.location));
        setUploadedFileUrl((prev) => ({ ...prev, imageUrl: getFileUrl(response.location) }));
        onUploadSuccess({ fileId: response.id });
      }
    } catch (error) {
      onError(file[0].file, 'Error uploading file. Please try again.');
    }

    console.log(setUploadedFileUrl);
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
        setUploadedFileUrl(getFileUrl(data.accountLogoFile.File.Location));
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

          {uploadedFileUrl ? (
            <Image src={uploadedFileUrl} alt="..." width={50} height={50} onClick={() => setOpenUploadModal(true)} />
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
          />
        </div>
      </div>
    </div>
  );
};
