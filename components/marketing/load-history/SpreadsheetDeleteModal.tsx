import { Button, PopupModal, Checkbox } from 'components/core-ui-lib';
import { useState } from 'react';

interface SpreadsheetDeleteModalProps {
  visible: boolean;
  onNoClick: () => void;
  onDeleteClick: () => void;
}

export const SpreadsheetDeleteModal = ({ visible, onNoClick, onDeleteClick }: SpreadsheetDeleteModalProps) => {
  const [keepSpreadsheet, setKeepSpreadsheet] = useState(true);

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
      <div className="flex gap-x-2 justify-end">
        <Button className="w-[128px] mt-3" text="Close" variant="secondary" onClick={onNoClick} />
        <Button className="w-[128px] mt-3" variant="tertiary" text="Delete" onClick={onDeleteClick} />
      </div>
    </PopupModal>
  );
};

export default SpreadsheetDeleteModal;
