import { Button, PopupModal } from 'components/core-ui-lib';
import { UploadedFile } from 'components/core-ui-lib/UploadModal/interface';
import validateSpreadsheetFile from '../utils/validateSpreadsheet';
import { UploadParamType } from 'interfaces';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import { venueState } from 'state/booking/venueState';
import { dateToSimple } from 'services/dateService';

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
  const { productions, selected } = useRecoilValue(productionJumpState);
  const selectedProducton = productions.filter((prod) => prod.Id === selected)[0];

  const [file, setFile] = useState<UploadedFile[]>(uploadedFile);
  const venueList = useRecoilValue(venueState);
  const prodCode = selectedProducton.ShowCode;
  const dateRange = dateToSimple(selectedProducton.StartDate) + '-' + dateToSimple(selectedProducton.EndDate);

  const updatefile = async () => {
    setFile(await validateSpreadsheetFile(file, prodCode, venueList, dateRange));
  };

  useEffect(() => {
    updatefile();
  }, []);

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
