import React, { useState } from 'react';
import Button from '../Button';
import PopupModal from '../PopupModal';

type ConfDialogVariant = 'close' | 'cancel' | 'delete' | 'logout' | 'leave';
type ModalText = {
  question: string;
  warning: string;
}

interface ConfirmationDialogProps {
  children?: React.ReactNode;
  show: boolean;
  onYesClick?: Function;
  variant?: ConfDialogVariant;
  yesBtnClass: string;
  noBtnClass: string;
  labelYes: string;
  labelNo: string;
}

export default function ConfirmationDialog({
  show = false,
  onYesClick,
  labelYes = 'Yes',
  labelNo = 'No',
  variant
}: ConfirmationDialogProps) {


  // set text based on  variant
  const text: ModalText = { question: '', warning: '' };

  switch (variant) {
    case 'close': { text.question = 'Are you sure you want to close?'; text.warning = 'Any unsaved changes may be lost.'; }
    case 'cancel': { text.question = 'Are you sure you want to cancel?'; text.warning = 'Any unsaved changes may be lost.'; }
    case 'delete': { text.question = 'Are you sure you want to delete?'; text.warning = 'This action cannot be undone.'; }
    case 'logout': { text.question = 'Are you sure you want to logout?'; text.warning = ''; }
    case 'leave': { text.question = 'Are you sure you want to leave this page?'; text.warning = 'Any unsaved changes may be lost.'; }
  }

  const [dialogVisible, setVisible] = useState(show);

  return (
    <PopupModal
      show={dialogVisible}
      showCloseIcon={false}
    >
      <div className="text-center">
        <div className='text text-primary-navy font-bold text-xl'>{text.question}</div>
        <div className='text text-primary-navy font-bold text-xl'>{text.warning}</div>
      </div>
      <div className="w-full mt-4 flex justify-center items-center mb-4">
        <Button className='w-32' variant='secondary' text={labelNo} onClick={() => setVisible(false)} />
        <Button className={variant === 'delete' ? 'ml-4 w-32 bg-primary-red' : 'ml-4 w-32'} text={labelYes} onClick={() => { onYesClick(); setVisible(false) }} />
      </div>
    </PopupModal>
  );
}
