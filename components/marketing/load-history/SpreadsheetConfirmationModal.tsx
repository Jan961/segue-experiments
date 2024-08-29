import { Button, PopupModal } from 'components/core-ui-lib';
import { UploadedFile } from 'components/core-ui-lib/UploadModal/interface';
import { UploadParamType } from 'interfaces';
import { useEffect } from 'react';

interface SpreadsheetModalProps {
  visible: boolean;
  onClose: () => void;
  closeUploadModal: () => void;
  handleUpload: (
    selectedFiles: UploadedFile[],
    onProgress: (file: File, uploadProgress: number) => void,
    onError: (file: File, errorMessage: string) => void,
    onUploadingImage: (file: File, imageUrl: string) => void,
  ) => void;
  uploadParams: UploadParamType;
  uploadedFile: UploadedFile[];
}

const SpreadsheetConfirmationModal = ({
  visible,
  onClose,
  handleUpload,
  uploadParams,
  uploadedFile,
  closeUploadModal,
}: SpreadsheetModalProps) => {
  const statusMessage = () => {
    if (uploadParams.spreadsheetErrorOccured) {
      return (
        <div>
          <p>There have been errors found in this data.</p>
          <p>Please redownload the annotated spreadsheet, correct the errors, then re-upload your data.</p>
        </div>
      );
    }

    if (uploadParams.spreadsheetWarningOccured) {
      return <div>Warnings</div>;
    }

    return <div>All good</div>;
  };

  const downloadSpreadsheet = () => {
    window.open(URL.createObjectURL(uploadedFile[0].file), '_blank');
  };

  useEffect(() => {
    console.log('closeUploadModal:', closeUploadModal);
  }, [closeUploadModal]);

  return (
    <PopupModal show={visible} title="Load Sales History" onClose={onClose} panelClass="w-1/4">
      {statusMessage()}
      <div className="flex gap-x-2">
        <Button
          className="w-[128px] mt-3"
          text="Close"
          onClick={() => {
            handleUpload(uploadedFile, uploadParams.onProgress, uploadParams.onError, uploadParams.onUploadingImage);
            onClose();
          }}
        />
        <Button
          className="w-[128px] mt-3"
          text="Redownload"
          onClick={() => {
            downloadSpreadsheet();
            onClose();
            closeUploadModal();
          }}
        />
      </div>
    </PopupModal>
  );
};

export default SpreadsheetConfirmationModal;
