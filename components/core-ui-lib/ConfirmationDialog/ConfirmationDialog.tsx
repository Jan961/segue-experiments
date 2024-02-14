import React, { useState } from 'react';
import Button from '../Button';
import PopupModal from '../PopupModal';
import { confOptions } from 'config/ConfirmationDialog';

type ConfDialogVariant = 'close' | 'cancel' | 'delete' | 'logout' | 'leave';

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
  const [visible, setVisible] = useState<boolean>(show);

  return (
    <PopupModal show={visible} showCloseIcon={false}>
      <div className="-mt-5">
        <div className="text-center">
          <div className="text text-primary-navy font-bold text-xl">{confOptions[variant].question}</div>
          <div className="text text-primary-navy font-bold text-xl">{confOptions[variant].warning}</div>
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
