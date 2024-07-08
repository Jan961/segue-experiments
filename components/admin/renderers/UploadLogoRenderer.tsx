import UploadModal from 'components/core-ui-lib/UploadModal';
import { useEffect, useState } from 'react';
import { Button } from 'components/core-ui-lib/';
import Image from 'next/image';
import axios from 'axios';
import { UploadedFile } from 'components/core-ui-lib/UploadModal/interface';
import { uploadFile } from 'requests/upload';
import { getFileUrl } from 'lib/s3';

export const UploadLogoRenderer = (params, fetchProductionCompanies, onUploadSucess) => {
  const { id, companyName, companyVATNo, webSite, fileLocation, fileName } = params.data;
  const [openUploadModal, setOpenUploadModal] = useState<boolean>();
  const [uploadedFile, setUploadedFile] = useState<UploadedFile>(null);

  useEffect(() => {
    if (fileLocation) {
      setUploadedFile((prev) => ({ ...prev, imageUrl: getFileUrl(fileLocation) }));
    }
  }, [fileLocation]);

  const onSave = async (file, onProgress, onError, onUploadingImage) => {
    const formData = new FormData();
    formData.append('file', file[0].file);
    formData.append('path', `admin/company/logo`);

    try {
      const response = await uploadFile(formData, onProgress, onError, onUploadingImage);
      if (response.status >= 400 && response.status <= 499) {
        onError(file[0].file, 'Error uploading file. Please try again.');
      } else {
        setUploadedFile((prev) => ({ ...prev, imageUrl: getFileUrl(response.location) }));
        onUploadSucess({ companyName, companyVATNo, id, webSite, fileId: response.id });
      }
    } catch (error) {
      onError(file[0].file, 'Error uploading file. Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/file/delete?location${fileLocation}`);
      await axios.post('/api/productionCompanies/update', {
        id,
        companyName,
        companyVATNo,
        webSite,
        fileLocation: null,
      });
    } catch (exception) {
      console.log(exception);
    }
  };

  return (
    <div className="h-full flex justify-center items-center">
      {!fileLocation ? (
        <Button
          text="Upload Logo"
          variant="secondary"
          onClick={() => setOpenUploadModal(true)}
          disabled={!!fileLocation}
        />
      ) : (
        <Image
          src={getFileUrl(fileLocation)}
          alt={fileName}
          width={200}
          height={200}
          onClick={() => setOpenUploadModal(true)}
        />
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
