import Button from 'components/core-ui-lib/Button';
import PopupModal from 'components/core-ui-lib/PopupModal';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import { useEffect, useState } from 'react';

interface NotesPopupProps {
  show: boolean;
  onSave: (n: string) => void;
  onCancel: () => void;
  value?: string;
}

export default function NotesPopup({ show, value, onSave, onCancel }: NotesPopupProps) {
  const [note, setNote] = useState<string>(value || '');

  useEffect(() => {
    setNote(value);
  }, [value]);

  const handleCancel = () => {
    setNote('');
    onCancel();
  };

  return (
    <PopupModal show={show} title="View / Edit Notes" titleClass="text-primary-navy" onClose={() => null}>
      <div>
        <h2 className="text-primary-navy">PROD_CODE | DATE |VENUE</h2>
        <TextArea className="mt-2 w-[461px] h-[237px]" value={note} onChange={(e) => setNote(e.target.value)} />
        <div className="w-full mt-4 flex justify-end items-center">
          <Button className="w-33" variant="secondary" text="Cancel" onClick={handleCancel} />
          <Button className="ml-4 w-33" variant="primary" text="Save and Close" onClick={() => onSave(note)} />
        </div>
      </div>
    </PopupModal>
  );
}
