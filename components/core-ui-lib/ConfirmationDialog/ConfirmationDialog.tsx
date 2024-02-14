import React, { useState } from 'react';
import Button from '../Button';
import PopupModal from '../PopupModal';

type ConfDialogVariant = 'close' | 'cancel' | 'delete' | 'logout' | 'leave';
type ModalText = {
  question: string;
  warning: string;
};

interface ConfirmationDialogProps {
  children?: React.ReactNode;
  show: boolean;
  onYesClick?: () => void;
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
  variant,
}: ConfirmationDialogProps) {
  // set text based on  variant
  const text: ModalText = { question: '', warning: '' };

  switch (variant) {
    case 'close': {
      text.question = 'Are you sure you want to close?';
      text.warning = 'Any unsaved changes may be lost.';
      break;
    }

    case 'cancel': {
      text.question = 'Are you sure you want to cancel?';
      text.warning = 'Any unsaved changes may be lost.';
      break;
    }

    case 'delete': {
      text.question = 'Are you sure you want to delete?';
      text.warning = 'This action cannot be undone.';
      break;
    }

    case 'logout': {
      text.question = 'Are you sure you want to logout?';
      text.warning = '';
      break;
    }

    case 'leave': {
      text.question = 'Are you sure you want to leave this page?';
      text.warning = 'Any unsaved changes may be lost.';
      break;
    }
  }

  const [visible, setVisible] = useState<boolean>(show);

  return (
    <PopupModal show={visible} showCloseIcon={false}>
      <div className="-mt-5">
        <div className="text-center">
          <div className="text text-primary-navy font-bold text-xl">{text.question}</div>
          <div className="text text-primary-navy font-bold text-xl">{text.warning}</div>
        </div>
        <div className="w-full mt-4 flex justify-center items-center mb-4">
          <Button className="w-32" variant="secondary" text={labelNo} onClick={() => setVisible(false)} />
          <Button
            className="ml-4 w-32"
            variant={variant === 'delete' ? 'tertiary' : 'primary'}
            text={labelYes}
            onClick={onYesClick}
          />
        </div>
      </div>
    </PopupModal>
  );
}
