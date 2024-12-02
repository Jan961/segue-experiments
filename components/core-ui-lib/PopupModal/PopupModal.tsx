import React, { Fragment, useEffect, useState, useRef, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { calibri } from 'lib/fonts';
import Icon from '../Icon';
import classNames from 'classnames';

interface PopupModalProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  show: boolean;
  footerComponent?: ReactNode;
  onClose?: () => void;
  titleClass?: string;
  showCloseIcon?: boolean;
  panelClass?: string;
  hasOverlay?: boolean;
  closeOnOverlayClick?: boolean;
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
  closeOnOverlayClick = false,
  testId = 'overlay',
  footerComponent,
}: PopupModalProps) {
  const [overlay, setOverlay] = useState<boolean>(false);
  const [isScrollbarVisible, setIsScrollbarVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOverlay(hasOverlay);
  }, [hasOverlay]);

  useEffect(() => {
    const checkScrollbarVisibility = () => {
      if (panelRef.current) {
        const hasHorizontalScrollbar = panelRef.current.scrollWidth > panelRef.current.clientWidth;
        setIsScrollbarVisible(hasHorizontalScrollbar);
      }
    };

    checkScrollbarVisibility();
    window.addEventListener('resize', checkScrollbarVisibility);

    return () => window.removeEventListener('resize', checkScrollbarVisibility);
  }, [children]);

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-150 h-[max-content]" onClick={handleOverlayClick} onClose={() => null}>
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
          className={classNames(calibri.variable, 'font-calibri fixed inset-0 z-50', overlay ? '' : 'bg-black/75')}
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
                ref={panelRef}
                className={classNames(
                  'bg-primary-white flex flex-col max-h-[90vh] px-5 pt-5 pb-5 transform text-left align-middle shadow-xl transition-all max-w-full overflow-x-auto overflow-y-hidden',
                  panelClass,
                  isScrollbarVisible ? 'pr-[calc(1rem+16px)]' : 'pr-4', // Dynamic right padding based on scrollbar
                )}
              >
                <header className="flex justify-between items-center">
                  <Dialog.Title className={`text-xl font-bold leading-6 text-primary-navy ${titleClass}`}>
                    {title}
                  </Dialog.Title>
                  {showCloseIcon && <Icon iconName="cross" variant="lg" onClick={onClose} testId="close-icon" />}
                </header>

                {subtitle && (
                  <Dialog.Title className="text-xl font-bold leading-6 text-primary-navy">{subtitle}</Dialog.Title>
                )}

                <div className="h-[max-content]' mt-3 pr-3 overflow-y-auto" data-testid="popup-modal-content">
                  {children}
                </div>

                {footerComponent && (
                  <div className="sticky bottom-0 mt-4 flex justify-end mr-3 space-x-3 bg-white">{footerComponent}</div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
