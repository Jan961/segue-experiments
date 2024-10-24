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
  closeOnOverlayClick?: boolean; // New prop to close on overlay click
  hasOverflow?: boolean;
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
  closeOnOverlayClick = false, // Default to false
  hasOverflow = true,
}: PopupModalProps) {
  const [overlay, setOverlay] = useState<boolean>(false);

  useEffect(() => {
    setOverlay(hasOverlay);
  }, [hasOverlay]);

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-150" onClick={handleOverlayClick} onClose={() => null}>
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
            'font-calibri fixed inset-0 z-50',
            hasOverflow ? 'overflow-y-auto' : '',
            overlay ? '' : 'bg-black/75',
          )}
          data-testid="overlay"
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
                  'bg-primary-white flex flex-col max-h-[90vh] px-7 pt-7 pb-5 transform text-left align-middle shadow-xl transition-all max-w-full overflow-x-auto overflow-y-hidden',
                  panelClass,
                )}
              >
                {showCloseIcon && (
                  <Icon
                    iconName="cross"
                    variant="lg"
                    className="hover:scale-105 sticky left-full"
                    onClick={onClose}
                    data-testid="close-icon"
                  />
                )}
                <Dialog.Title as="h3" className={`-mt-6 text-lg font-bold leading-6 ${titleClass}`}>
                  {title}
                </Dialog.Title>
                <div className="overflow-y-auto mt-3">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
