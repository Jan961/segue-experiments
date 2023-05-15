import { PropsWithChildren } from 'react'
import { Dialog } from '@headlessui/react'

interface StyledDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
}

export const StyledDialog = ({ open, onClose, title, children }: PropsWithChildren<StyledDialogProps>) => {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 overflow-y-auto" aria-hidden="true">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm p-4 rounded bg-white">
            <Dialog.Title className="text-xl mb-2">
              { title }
            </Dialog.Title>
            { children }
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
}
