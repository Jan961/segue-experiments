import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import Button from '../Button';

interface ConfirmationDialogProps {
  children?: React.ReactNode;
  show: boolean;
  onConfirmation?: Function;
  question: string;
  warning: string;
  yesBtnClass: string;
  noBtnClass: string;
}


export default function ConfirmationDialog({
  show = false,
  onConfirmation,
  question,
  warning,
  yesBtnClass = "primary-blue",
  noBtnClass
}: ConfirmationDialogProps) {

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
                    <div className='text text-primary-navy font-bold text-xl'>{question}</div>
                    <div className='text text-primary-navy font-bold text-xl'>{warning}</div>
                  </div>
                  <div className="w-full mt-4 flex justify-center items-center mb-4">
                    <Button className={yesBtnClass + ' w-32'} variant='secondary' text="No" onClick={() => setVisible(false)} />
                    <Button className={noBtnClass + " ml-4 w-32"} text="Yes" onClick={() => { onConfirmation(); setVisible(false) }} />
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
