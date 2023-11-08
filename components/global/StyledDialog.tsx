import { PropsWithChildren } from 'react';
import { Dialog } from '@headlessui/react';
import { MenuButton } from './MenuButton';
import { faClose, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface StyledDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  width?: undefined | 'lg' | 'xl' | 'md';
  className?: string;
}

// Only use non-default classes on desktop only pages.
const DEFAULT_WIDTH_CLASS = 'max-w-sm w-96';

const WIDTH_CLASSES = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-3xl',
  none: '',
};

export const StyledDialog = ({
  open,
  onClose,
  title,
  children,
  width,
  className,
}: PropsWithChildren<StyledDialogProps>) => {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 overflow-y-auto" aria-hidden="true">
        <div className="flex min-h-full items-center justify-center p-5">
          <Dialog.Panel
            className={`mx-auto ${
              WIDTH_CLASSES[width] ? WIDTH_CLASSES[width] : DEFAULT_WIDTH_CLASS
            } rounded bg-white ${className}`}
          >
            <FontAwesomeIcon size="xl" icon={faClose} className="float-right p-4 cursor-pointer" onClick={onClose} />
            <Dialog.Title className="text-xl mb-2 p-4 border-gray-200 border-b">{title}</Dialog.Title>
            <div className="p-4">{children}</div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

interface FooterButton {
  onClick?: (e: any) => void;
  submit?: boolean;
  intent?: undefined | 'DANGER';
  disabled?: boolean;
}

const FooterCancel = ({ onClick, submit, children = 'Cancel' }: PropsWithChildren<FooterButton>) => {
  return (
    <button type={submit ? 'button' : 'button'} onClick={onClick} className="hover:underline text-red-500 px-4 py-2">
      {children}
    </button>
  );
};

const FooterDelete = ({ onClick, children, disabled }: PropsWithChildren<FooterButton>) => {
  return (
    <MenuButton onClick={onClick} intent={'DANGER'} disabled={disabled}>
      {children}
    </MenuButton>
  );
};

const FooterContinue = ({ onClick, submit, children, intent, disabled }: PropsWithChildren<FooterButton>) => {
  return (
    <MenuButton onClick={onClick} submit={submit} intent={intent} disabled={disabled}>
      {children}
    </MenuButton>
  );
};

const FooterContainer = ({ children }: PropsWithChildren<unknown>) => {
  return <div className="text-right mt-4">{children}</div>;
};

StyledDialog.FooterCancel = FooterCancel;
StyledDialog.FooterContinue = FooterContinue;
StyledDialog.FooterContainer = FooterContainer;
StyledDialog.FooterDelete = FooterDelete;
