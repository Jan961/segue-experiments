import { PropsWithChildren } from 'react'
import { Dialog } from '@headlessui/react'
import { MenuButton } from './MenuButton'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface StyledDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
}

export const StyledDialog = ({ open, onClose, title, children }: PropsWithChildren<StyledDialogProps>) => {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 overflow-y-auto" aria-hidden="true">
        <div className="flex min-h-full items-center justify-center p-5">
          <Dialog.Panel className="mx-auto max-w-sm rounded bg-white">
            <FontAwesomeIcon size='xl' icon={faClose} className="float-right p-4 cursor-pointer" onClick={onClose} />
            <Dialog.Title className="text-xl mb-2 p-4 border-gray-200 border-b">
              { title }
            </Dialog.Title>
            <div className="p-4">{ children }</div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
}

interface FooterButton {
  onClick?: (e: any) => void;
  submit?: boolean;
  intent?: undefined | 'DANGER';
  disabled?: boolean;
}

const FooterCancel = ({ onClick, submit, children = 'Cancel' }: PropsWithChildren<FooterButton>) => {
  return (
    <button type={submit ? 'button' : 'button' } onClick={onClick}
      className="hover:underline text-red-500 px-4 py-2"
    >
      { children }
    </button>
  )
}

const FooterContinue = ({ onClick, submit, children, intent, disabled }: PropsWithChildren<FooterButton>) => {
  return <MenuButton onClick={onClick} submit={submit} intent={intent} disabled={disabled}>{ children }</MenuButton>
}

const FooterContainer = ({ children }: PropsWithChildren<unknown>) => {
  return (<div className='text-right mt-4'>{ children }</div>)
}

StyledDialog.FooterCancel = FooterCancel
StyledDialog.FooterContinue = FooterContinue
StyledDialog.FooterContainer = FooterContainer
