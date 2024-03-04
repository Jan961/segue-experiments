import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { calibri } from 'lib/fonts';
import Icon from '../Icon';
import classNames from 'classnames';

interface PopupModalProps {
  title?: string;
  children?: React.ReactNode;
  show: boolean;
  onClose?: () => void;
  titleClass?: string;
  showCloseIcon?: boolean;
  panelClass?: string;
  hasOverlay?: boolean;
}

export default function PopupModal({
  title = '',
  children,
  show = false,
  onClose = () => null,
  titleClass,
  showCloseIcon = true,
  panelClass,
  hasOverlay = false,
}: PopupModalProps) {
  const [overlay, setOverlay] = useState<boolean>(false);

  useEffect(() => {
    setOverlay(hasOverlay);
  }, [hasOverlay]);

  return (
    <Transition appear show={show} as={Fragment}>
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
          <div className="fixed inset-0 z-10" />
        </Transition.Child>

        <div
          className={classNames(
            calibri.variable,
            'font-calibri fixed inset-0 overflow-y-auto z-20',
            overlay ? '' : 'bg-black/75',
          )}
        >
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
              <Dialog.Panel
                className={classNames(
                  'px-7 pt-7 pb-5 transform bg-primary-white text-left align-middle shadow-xl transition-all',
                  panelClass,
                )}
              >
                {showCloseIcon && (
                  <Icon
                    iconName="cross"
                    variant="lg"
                    className="hover:scale-105 fixed right-4 top-4"
                    onClick={onClose}
                  />
                )}
                <Dialog.Title as="h3" className={`text-lg font-bold leading-6 ${titleClass}`}>
                  {title}
                </Dialog.Title>

                <div className="mt-1">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
