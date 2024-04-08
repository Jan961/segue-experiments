import React, { useEffect, useState } from 'react';
import Button from '../Button';
import PopupModal from '../PopupModal';
import TextInput from '../TextInput';
import ConfirmationDialog, { ConfDialogVariant } from '../ConfirmationDialog/ConfirmationDialog';

interface InputDialogProps {
  titleText: string;
  subTitleText?: string;
  show: boolean;
  onCancelClick?: () => void;
  onSaveClick?: (value) => void;
  cancelText?: string;
  saveText?: string;
  inputPlaceholder?: string;
  inputLabel?: string;
  inputValue?: string;
}


const InputDialog = ({
  show = false,
  titleText,
  subTitleText,
  onCancelClick,
  onSaveClick,
  cancelText,
  saveText,
  inputPlaceholder,
  inputLabel,
  inputValue
}: Partial<InputDialogProps>) => {

  const [visible, setVisible] = useState<boolean>(show);
  const [showConfirm, setShowConf] = useState<boolean>(false);
  const [confVariant, setConfVariant] = useState<ConfDialogVariant>('cancel');

  useEffect(() => {
    setVisible(show);
  }, [show]);

  useEffect(() => {
    setInputVal(inputValue);
  }, [inputValue]);

  const [inputVal, setInputVal] = useState('');

  const handleClose = () => {
    if(inputVal !== inputValue) {
      setConfVariant('close');
      setShowConf(true);
    } else {
      setVisible(false);
    }
  }

  const handleCancel = () => {
    if(inputVal !== inputValue) {
      setConfVariant('cancel');
      setShowConf(true);
    } else {
      setVisible(false);
    }
  }

  const dismissAll = () => {
    setShowConf(false);
    onCancelClick()
  }

  return (
    <PopupModal
      show={visible}
      title={titleText}
      titleClass='text-responsive-2xl text-primary-navy font-bold -mt-2'
      showCloseIcon={true}
      hasOverlay={showConfirm}
      onClose={handleClose}
    >
      <div className='w-[435px]'>
        <div className="text-xl text-primary-navy font-bold mb-4">{subTitleText}</div>

        <div className="text-base font-bold text-primary-navy">{inputLabel}</div>
        <TextInput
          className="w-full"
          placeholder={inputPlaceholder}
          id="input"
          value={inputVal}
          onChange={(event) => setInputVal(event.target.value)}
        />

        <div className="flex float-right mt-5">
          <Button className="w-32" variant="secondary" text={cancelText} onClick={handleCancel} />
          <Button
            className="ml-4 w-32"
            variant={'primary'}
            text={saveText}
            onClick={() => onSaveClick(inputVal)}
          />
        </div>

        <ConfirmationDialog
        variant={confVariant}
        show={showConfirm}
        onYesClick={dismissAll}
        onNoClick={() => setShowConf(false)}
        hasOverlay={false}
      />
      </div>
    </PopupModal>
  );
}

export default InputDialog;
