import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { calibri } from 'lib/fonts';
import Icon from '../Icon';
import classNames from 'classnames';

interface PopupModalProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  show: boolean;
  onClose?: () => void;
  titleClass?: string;
  showCloseIcon?: boolean;
  panelClass?: string;
  hasOverlay?: boolean;
  closeOnOverlayClick?: boolean; // New prop to close on overlay click
  hasOverflow?: boolean;
  testId?: string;
}

export default function PopupModal({
  title = '',
  subtitle = '',
  children,
  show = false,
  onClose = () => null,
  titleClass,
  showCloseIcon = true,
  panelClass,
  hasOverlay = false,
  closeOnOverlayClick = false, // Default to false
  hasOverflow = true,
  testId = 'popup-modal-wrapper',
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
          data-testid={testId}
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
                  'bg-primary-white flex flex-col max-h-[90vh] px-5 pt-5 pb-5 transform text-left align-middle shadow-xl transition-all max-w-full overflow-x-auto overflow-y-hidden',
                  panelClass,
                )}
              >
                <header className="flex justify-between items-center">
                  <Dialog.Title className={`text-xl font-bold leading-6 text-primary-navy ${titleClass}`}>
                    {title}
                  </Dialog.Title>
                  {showCloseIcon && <Icon iconName="cross" variant="lg" onClick={onClose} data-testid="close-icon" />}
                </header>

                {subtitle && (
                  <Dialog.Title className="text-xl font-bold leading-6 text-primary-navy">{subtitle}</Dialog.Title>
                )}

                <div className="overflow-y-auto mt-3 pr-3">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
