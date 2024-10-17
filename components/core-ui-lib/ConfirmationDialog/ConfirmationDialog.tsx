import React, { useEffect, useState } from 'react';
import Button from '../Button';
import PopupModal from '../PopupModal';

export type ConfDialogVariant = 'close' | 'cancel' | 'delete' | 'logout' | 'leave' | 'return' | 'continue';

export type ConfirmationDialogContent = {
  question: string;
  warning: string;
};

export enum ConfVariant {
  Close = 'close',
  Cancel = 'cancel',
  Delete = 'delete',
  Logout = 'logout',
  Leave = 'leave',
  Return = 'return',
  Continue = 'continue',
}

export interface ConfirmationDialogProps {
  children?: React.ReactNode;
  show: boolean;
  onYesClick?: () => void;
  onNoClick?: () => void;
  variant?: ConfDialogVariant;
  yesBtnClass: string;
  noBtnClass: string;
  labelYes: string;
  labelNo?: string;
  hasOverlay?: boolean;
  content?: ConfirmationDialogContent;
  testId?: string;
}

export const confOptions = {
  close: {
    question: 'Are you sure you want to close?',
    warning: 'Any unsaved changes may be lost.',
  },
  cancel: {
    question: 'Are you sure you want to cancel?',
    warning: 'Any unsaved changes may be lost.',
  },
  delete: {
    question: 'Are you sure you want to delete?',
    warning: 'This action cannot be undone.',
  },
  logout: {
    question: 'Are you sure you want to logout?',
    warning: '',
  },
  leave: {
    question: 'Are you sure you want to leave this page?',
    warning: 'Any unsaved changes may be lost.',
  },
  return: {
    question: 'Are you sure you want to return to home?',
    warning: '',
  },
  continue: {
    question: 'Are you sure you want to continue?',
    warning: '',
  },
};

export default function ConfirmationDialog({
  show = false,
  onYesClick,
  onNoClick,
  labelYes = 'Yes',
  labelNo = 'No',
  variant,
  hasOverlay = false,
  content,
  testId,
}: Partial<ConfirmationDialogProps>) {
  const [visible, setVisible] = useState<boolean>(show);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  // yes = true, false = no
  const handleAction = (action: boolean) => {
    action ? onYesClick() : onNoClick();
  };

  return (
    <PopupModal data-testid={testId} show={visible} showCloseIcon={false} hasOverlay={hasOverlay}>
      <div data-testid="confirmation-dialog" className="-mt-5">
        <div className="text-center">
          <div data-testid="confirmation-dialog-question" className="text text-primary-navy font-bold text-xl">
            {content ? content.question : confOptions[variant].question}
          </div>
          <div data-testid="confirmation-dialog-warning" className="text text-primary-navy font-bold text-xl">
            {content ? content.warning : confOptions[variant].warning}
          </div>
        </div>
        <div className="w-full mt-4 flex justify-center items-center">
          {labelNo && (
            <Button
              testId="confirmation-dialog-no-btn"
              className="w-32"
              variant="secondary"
              text={labelNo}
              onClick={() => handleAction(false)}
            />
          )}
          <Button
            testId="confirmation-dialog-yes-btn"
            className="ml-4 w-32"
            variant={variant === 'delete' ? 'tertiary' : 'primary'}
            text={labelYes}
            onClick={() => handleAction(true)}
          />
        </div>
      </div>
    </PopupModal>
  );
}
