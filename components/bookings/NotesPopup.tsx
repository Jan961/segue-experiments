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
  productionItem: any;
}

export default function NotesPopup({ show, onSave, onCancel, productionItem }: NotesPopupProps) {
  const [note, setNote] = useState<string>('');
  const [confirm, setConfirm] = useState<boolean>(false);
  const [confVariant, setVariant] = useState<ConfDialogVariant>('close');

  useEffect(() => {
    setNote(productionItem?.note || '');
  }, [productionItem?.note]);

  const showConfModal = (mode:ConfDialogVariant) => {
    if (productionItem?.note !== note) {
      setVariant(mode);
      setConfirm(true);
    } else {
      handleCancel();
    }
  };

  const handleCancel = () => {
    setConfirm(false);
    setNote(productionItem?.note);
    onCancel();
  }

  return (
    <div>
      <PopupModal show={show} title="View / Edit Notes" titleClass="text-primary-navy" onClose={() => showConfModal('close')}>
        <div>
          <h3 className="text-responsive-lg font-bold text-primary-navy">{`${productionItem?.production} | ${productionItem?.date}`}</h3>
          <h3 className="text-responsive-lg font-bold text-primary-navy">
            {productionItem?.venue !== undefined ? productionItem?.venue : ''}
          </h3>
          <TextArea className="mt-2 w-[482px] h-[237px]" value={note} onChange={(e) => setNote(e.target.value)} />
          <div className="w-full mt-4 mb-8 flex justify-end items-center">
            <Button className="w-33" variant="secondary" text="Cancel" onClick={() => showConfModal('cancel')} />
            <Button className="ml-4 w-33" variant="primary" text="Save and Close" onClick={() => onSave(note)} />
          </div>
        </div>
      </PopupModal>

      <ConfirmationDialog
        variant={confVariant}
        show={confirm}
        onYesClick={handleCancel}
        onNoClick={() => setConfirm(false)}
      />
    </div>
  );
}
