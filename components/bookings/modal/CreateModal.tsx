import { StyledDialog } from 'components/global/StyledDialog'
import { FormInputButton } from 'components/global/forms/FormInputButton'
import CreatePanel from '../panel/CreatePanel'
import React from 'react'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useRecoilState } from 'recoil'
import { viewState } from 'state/booking/viewState'

interface CreateModalProps {
  minimal?: boolean
  date?: string
}

export const CreateModal = ({ minimal = false, date }: CreateModalProps) => {
  const [open, setOpen] = React.useState(false)
  const [view, setView] = useRecoilState(viewState)

  const close = () => {
    setOpen(false)
  }

  const triggerOpen = () => {
    if (date) {
      setView({ ...view, selectedDate: date }) // We use selectedDate when creating
    }
    setOpen(true)
  }

  return (
    <>
      <StyledDialog title='Create New' open={open} onClose={close}>
        <CreatePanel finish={close}/>
      </StyledDialog>
      <FormInputButton
        text={ minimal ? '' : 'Add Additional Event'}
        className={minimal
          ? `col-span-10 bg-transparent shadow-none
            text-transparent
           hover:bg-gray-200 hover:opacity-100 opacity-0 `
          : 'w-full'}
        icon={faPlus}
        onClick={triggerOpen} />
    </>
  )
}
