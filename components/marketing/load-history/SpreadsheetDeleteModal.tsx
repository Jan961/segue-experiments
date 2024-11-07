import { Button, PopupModal, Checkbox } from 'components/core-ui-lib';
import { useState } from 'react';
import LoadingOverlay from 'components/shows/LoadingOverlay';
import TextBoxConfirmation from './TextBoxConfirmation/TextBoxConfirmation';

interface SpreadsheetDeleteModalProps {
  visible: boolean;
  onNoClick: () => void;
  onDeleteClick: () => void;
  salesHistoryRows: any;
}

export const SpreadsheetDeleteModal = ({
  visible,
  onNoClick,
  onDeleteClick,
  salesHistoryRows,
}: SpreadsheetDeleteModalProps) => {
  const [validConfirmationMessage, setValidConfirmationMessage] = useState<boolean>(null);
  const [displayErrorMessage, setDisplayErrorMessage] = useState<boolean>(false);
  const [keepSpreadsheet, setKeepSpreadsheet] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    if (keepSpreadsheet) {
      const a = document.createElement('a');
      a.href = salesHistoryRows[0].fileURL;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    onDeleteClick();
    setIsLoading(false);
  };

  return (
    <PopupModal show={visible} showCloseIcon={false} panelClass="w-1/4">
      <div className=" text-primary-navy font-bold text-xl mb-2">
        <p>If you delete this file, all uploaded data will also be deleted. Are you sure?</p>
      </div>
      <div className="flex gap-x-2">
        <Checkbox
          id="delete-saleshistory-spreadsheet"
          onChange={() => setKeepSpreadsheet(!keepSpreadsheet)}
          checked={keepSpreadsheet}
        />
        <p className="text-sm">Download a copy of this spreadsheet to archive?</p>
      </div>
      <div className="mt-3 mb-5">
        <TextBoxConfirmation requiredMessage="DELETE" setValid={setValidConfirmationMessage} />
        {displayErrorMessage && (
          <p className="text-primary-red absolute">Please enter the text exactly as displayed to confirm.</p>
        )}
      </div>
      <div className="flex gap-x-2 justify-end">
        <Button className="w-[128px] mt-3" text="Close" variant="secondary" onClick={onNoClick} />
        <Button
          className="w-[128px] mt-3"
          variant="tertiary"
          text="Delete"
          onClick={() => {
            if (validConfirmationMessage) {
              handleDelete();
            } else {
              setDisplayErrorMessage(true);
            }
          }}
        />
      </div>
      {isLoading && <LoadingOverlay />}
    </PopupModal>
  );
};

export default SpreadsheetDeleteModal;
