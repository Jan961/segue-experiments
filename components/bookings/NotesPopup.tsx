import Button from 'components/core-ui-lib/Button';
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
  const [note, setNote] = useState<string>(productionItem?.note || '');

  useEffect(() => {
    setNote(productionItem?.note || '');
  }, [productionItem]);

  const handleCancel = () => {
    setNote('');
    onCancel();
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

  if (productionItem?.venue !== undefined && productionItem?.venue !== '') {
    summary.push(productionItem?.venue);
  }

  return (
    <PopupModal show={show} title="View / Edit Notes" titleClass="text-primary-navy" onClose={handleCancel}>
      <div>
        <h2 className="text text-primary-navy">{summary.join(' | ')}</h2>
        <TextArea className="mt-2 w-[482px] h-[237px]" value={note} onChange={(e) => setNote(e.target.value)} />
        <div className="w-full mt-4 mb-8 flex justify-end items-center">
          <Button className="w-33" variant="secondary" text="Cancel" onClick={handleCancel} />
          <Button className="ml-4 w-33" variant="primary" text="Save and Close" onClick={() => onSave(note)} />
        </div>
      </div>
    </PopupModal>
  );
}
