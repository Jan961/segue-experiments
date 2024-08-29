import { Button, PopupModal } from 'components/core-ui-lib';
import { UploadedFile } from 'components/core-ui-lib/UploadModal/interface';
import { UploadParamType } from 'interfaces';

interface SpreadsheetModalProps {
  visible: boolean;
  onClose: () => void;
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
}: SpreadsheetModalProps) => {
  return (
    <PopupModal show={visible} title="Load Sales History" onClose={onClose}>
      <div>{uploadedFile && uploadedFile[0].name}</div>
      <Button
        className="w-[128px]"
        text="Close"
        onClick={() => {
          handleUpload(uploadedFile, uploadParams.onProgress, uploadParams.onError, uploadParams.onUploadingImage);
          onClose();
        }}
      />
    </PopupModal>
  );
};

export default SpreadsheetConfirmationModal;
