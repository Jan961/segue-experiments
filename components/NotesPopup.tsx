import Button from 'components/core-ui-lib/Button';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import { ConfDialogVariant } from 'components/core-ui-lib/ConfirmationDialog/ConfirmationDialog';
import PopupModal from 'components/core-ui-lib/PopupModal';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import { useEffect, useState } from 'react';

interface NotesPopupProps {
  show: boolean;
  testId?: string;
  onSave: (n: string) => void;
  onCancel: () => void;
  notes: string;
  title?: string;
}

export default function NotesPopup({ show, onSave, onCancel, notes, testId, title }: NotesPopupProps) {
  const [note, setNote] = useState<string>('');
  const [confirm, setConfirm] = useState<boolean>(false);
  const [confVariant, setVariant] = useState<ConfDialogVariant>('close');

  useEffect(() => {
    setNote(notes || '');
  }, [notes]);

  const showConfModal = (mode: ConfDialogVariant) => {
    if (notes !== note) {
      setVariant(mode);
      setConfirm(true);
    } else {
      handleCancel();
    }
  };

  const handleCancel = () => {
    setConfirm(false);
    setNote(notes);
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
          <h3 className="text-responsive-lg font-bold text-primary-navy">{title}</h3>
          <TextArea
            testId={`${testId}-textarea`}
            className="mt-2 h-[237px] w-full min-w-[508px]"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="w-full mt-4 flex justify-end items-center">
            <Button
              testId={`${testId}-cancel-btn`}
              className="w-33"
              variant="secondary"
              text="Cancel"
              onClick={() => showConfModal('cancel')}
            />
            <Button
              testId={`${testId}-save-btn`}
              className="ml-4 w-33"
              variant="primary"
              text="Save and Close"
              onClick={() => onSave(note)}
            />
          </div>
        </div>
      </PopupModal>

      <ConfirmationDialog
        testId={`${testId}-confirmation-dialog`}
        variant={confVariant}
        show={confirm}
        onYesClick={handleCancel}
        onNoClick={() => setConfirm(false)}
        hasOverlay={false}
      />
    </div>
  );
}
