import Button from 'components/core-ui-lib/Button';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import PopupModal from 'components/core-ui-lib/PopupModal';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import { useEffect, useState } from 'react';

interface NotesPopupProps {
  show: boolean;
  onSave: (n: string) => void;
  onCancel: () => void;
  onShow: () => void;
  productionItem: any;
}

export default function NotesPopup({ show, onSave, onCancel, onShow, productionItem }: NotesPopupProps) {
  const [note, setNote] = useState<string>(productionItem?.note || '');
  const [confirm, setConfirm] = useState<boolean>(false);

  useEffect(() => {
    setNote(productionItem?.note || '');
  }, [productionItem?.note]);

  const confirmCancel = () => {
    if (productionItem?.note !== note) {
      setConfirm(true);
      onCancel();
    } else {
      handleCancel();
    }
  };

  const handleCancel = () => {
    setNote('');
    onCancel();
  };

  const dismissCancel = () => {
    setConfirm(false);
    onShow();
  };

  // SK-25 PL - add Production Code | Prod Date | Prod Venue
  // accommodates undefined values in the off chance some are created
  const summary = [];
  if (productionItem?.production !== undefined && productionItem?.production !== '') {
    summary.push(productionItem?.production);
  }

  if (productionItem?.date !== undefined && productionItem?.date !== '') {
    summary.push(productionItem?.date);
  }

  return (
    <div>
      <PopupModal show={show} title="View / Edit Notes" titleClass="text-primary-navy" onClose={confirmCancel}>
        <div>
          <h3 className="text w-[482px] text-lg font-bold text-primary-navy">{summary.join(' | ')}</h3>
          <h3 className="text w-[482px] text-lg font-bold text-primary-navy">
            {productionItem?.venue !== undefined ? productionItem?.venue : ''}
          </h3>
          <TextArea className="mt-2 w-[482px] h-[237px]" value={note} onChange={(e) => setNote(e.target.value)} />
          <div className="w-full mt-4 mb-8 flex justify-end items-center">
            <Button className="w-33" variant="secondary" text="Cancel" onClick={confirmCancel} />
            <Button className="ml-4 w-33" variant="primary" text="Save and Close" onClick={() => onSave(note)} />
          </div>
        </div>
      </PopupModal>

      <ConfirmationDialog
        variant="cancel"
        show={confirm}
        onYesClick={() => handleCancel()}
        onNoClick={() => dismissCancel()}
      />
    </div>
  );
}
