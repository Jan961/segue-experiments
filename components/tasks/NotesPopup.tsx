import Button from 'components/core-ui-lib/Button';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import { ConfDialogVariant } from 'components/core-ui-lib/ConfirmationDialog/ConfirmationDialog';
import PopupModal from 'components/core-ui-lib/PopupModal';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import { useEffect, useState } from 'react';

interface NotesPopupProps {
  show: boolean;
  onSave: (n: string) => void;
  onCancel: () => void;
  currentTask: any;
  disabled?: boolean;
}

export default function NotesPopup({ show, onSave, onCancel, currentTask, disabled }: NotesPopupProps) {
  const [note, setNote] = useState<string>('');
  const [confirm, setConfirm] = useState<boolean>(false);
  const [confVariant, setVariant] = useState<ConfDialogVariant>('close');

  useEffect(() => {
    setNote(currentTask?.Notes || '');
  }, [currentTask?.Notes]);

  const showConfModal = (mode: ConfDialogVariant) => {
    if ((currentTask?.Notes || note) && currentTask?.Notes !== note) {
      setVariant(mode);
      setConfirm(true);
    } else {
      handleCancel();
    }
  };

  const handleCancel = () => {
    setConfirm(false);
    setNote(currentTask?.Notes);
    onCancel();
  };

  return (
    <div>
      <PopupModal
        show={show}
        title="View | Edit Notes"
        titleClass="text-primary-navy"
        onClose={() => showConfModal('close')}
        hasOverlay={confirm}
      >
        <div>
          <h3 className="text-responsive-lg font-bold text-primary-navy">
            {currentTask?.Code} | {currentTask?.Name}
          </h3>
          <TextArea
            className="mt-2 h-[237px] w-full min-w-[508px]"
            value={note}
            placeholder="Notes field..."
            onChange={(e) => setNote(e.target.value)}
            disabled={disabled}
          />
          <div className="w-full mt-4 flex justify-end items-center">
            <Button className="w-33" variant="secondary" text="Cancel" onClick={() => showConfModal('cancel')} />
            <Button
              className="ml-4 w-33"
              variant="primary"
              text="Save and Close"
              onClick={() => onSave(note)}
              disabled={disabled}
            />
          </div>
        </div>
      </PopupModal>

      <ConfirmationDialog
        variant={confVariant}
        show={confirm}
        onYesClick={handleCancel}
        onNoClick={() => setConfirm(false)}
        hasOverlay={false}
      />
    </div>
  );
}
