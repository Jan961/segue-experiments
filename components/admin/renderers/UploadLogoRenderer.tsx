import UploadModal from 'components/core-ui-lib/UploadModal';
import { useEffect, useState } from 'react';
import { Button } from 'components/core-ui-lib/';
import Image from 'next/image';
import axios from 'axios';
import { UploadedFile } from 'components/core-ui-lib/UploadModal/interface';
import { uploadFile } from 'requests/upload';
import { getFileUrl } from 'lib/s3';

export const UploadLogoRenderer = (params, fetchProductionCompanies) => {
  const { id, fileId, fileLocation, fileName } = params.data;
  const [openUploadModal, setOpenUploadModal] = useState<boolean>();
  const [uploadedFile, setUploadedFile] = useState<UploadedFile>(null);
  const [fileUrl, setFileUrl] = useState<string>('');

  const getUrlForImage = async (path) => {
    const url = await getFileUrl(path);
    setFileUrl(url);
  };

  useEffect(() => {
    if (fileLocation) {
      getUrlForImage(fileLocation);
    }
  }, [fileLocation]);

  const onSave = async (file, onProgress, onError, onUploadingImage) => {
    const formData = new FormData();
    formData.append('file', file[0].file);
    formData.append('Id', id.toString());

    try {
      const response = await uploadFile(formData, onProgress, onError, onUploadingImage);
      if (response.status >= 400 && response.status <= 499) {
        onError(file[0].file, 'Error uploading file. Please try again.');
      }
    } catch (error) {
      onError(file[0].file, 'Error uploading file. Please try again.');
    }
  };
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/productionCompanies/logo/delete?Id=${fileId}`);
    } catch (exception) {
      console.log(exception);
    }
  };

  return (
    <div className="h-full flex justify-center items-center">
      {!fileId ? (
        <Button text="Upload Logo" variant="secondary" onClick={() => setOpenUploadModal(true)} disabled={!!fileId} />
      ) : (
        <Image src={fileUrl} alt="Company Logo" width={200} height={200} onClick={() => setOpenUploadModal(true)} />
      )}
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
        value={uploadedFile}
        customHandleFileDelete={handleDelete}
      />
    </div>
  );
};
