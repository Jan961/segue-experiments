import { Button, PopupModal } from 'components/core-ui-lib';
import { UploadedFile } from 'components/core-ui-lib/UploadModal/interface';
import { UploadParamType } from 'interfaces';

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
          <p>Please download the annotated spreadsheet, correct the errors, then upload your data.</p>
        </div>
      );
    }

    if (uploadParams.spreadsheetWarningOccured) {
      return (
        <div>
          <p>There have been warnings found in this data.</p>
          <p>
            Please download the spreadsheet, correct the warnings or enter a Y into the `Ignore Warnings` column for
            that row, then upload your data.
          </p>
        </div>
      );
    }

    return (
      <div>
        <p>This date will be uploaded to. Any existing sales data will be overwritten. Do you wish to proceed?</p>
      </div>
    );
  };

  const buttonOptions = () => {
    if (!uploadParams.spreadsheetErrorOccured && !uploadParams.spreadsheetWarningOccured) {
      return (
        <>
          <Button
            className="w-[128px] mt-3"
            text="No"
            onClick={() => {
              onClose();
              closeUploadModal();
            }}
          />
          <Button
            className="w-[128px] mt-3"
            text="Yes"
            onClick={() => {
              handleUpload(uploadedFile, uploadParams.onProgress, uploadParams.onError, uploadParams.onUploadingImage);
              onClose();
              closeUploadModal();
            }}
          />
        </>
      );
    } else {
      return (
        <>
          <Button
            className="w-[128px] mt-3"
            text="Close"
            onClick={() => {
              onClose();
              closeUploadModal();
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
        </>
      );
    }
  };

  const downloadSpreadsheet = () => {
    window.open(URL.createObjectURL(uploadedFile[0].file), '_blank');
  };

  return (
    <PopupModal show={visible} title="Load Sales History" onClose={onClose} panelClass="w-1/4">
      {statusMessage()}
      <div className="flex gap-x-2 justify-end">{buttonOptions()}</div>
    </PopupModal>
  );
};

export default SpreadsheetConfirmationModal;
