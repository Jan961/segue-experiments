import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import Button from '../Button';

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
  const text: ModalText = { question: '', warning: ''};

  switch(variant) {
    case 'close': { text.question = 'Are you sure you want to close?'; text.warning = 'Any unsaved changes may be lost.'; }
    case 'cancel': { text.question = 'Are you sure you want to cancel?'; text.warning = 'Any unsaved changes may be lost.'; }
    case 'delete': { text.question = 'Are you sure you want to delete?'; text.warning = 'This action cannot be undone.'; }
    case 'logout': { text.question = 'Are you sure you want to logout?'; text.warning = ''; }
    case 'leave': { text.question = 'Are you sure you want to leave this page?'; text.warning = 'Any unsaved changes may be lost.'; }
  }

  const [dialogVisible, setVisible] = useState(show);

  return (
    <Transition appear show={dialogVisible} as={Fragment}>
      <Dialog as="div" className="relative z-150" onClose={() => null}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75 z-10" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto z-20">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="px-7 pt-2 transform bg-primary-white text-left align-middle shadow-xl transition-all">
                <div>
                  <div className="text-center">
                    <div className='text text-primary-navy font-bold text-xl'>{text.question}</div>
                    <div className='text text-primary-navy font-bold text-xl'>{text.warning}</div>
                  </div>
                  <div className="w-full mt-4 flex justify-center items-center mb-4">
                    <Button className='w-32' variant='secondary' text={labelNo} onClick={() => setVisible(false)} />
                    <Button className={variant === 'delete' ? 'ml-4 w-32 bg-primary-red' : 'ml-4 w-32'}  text={labelYes} onClick={() => { onYesClick(); setVisible(false) }} />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
