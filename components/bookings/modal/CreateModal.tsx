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
        className={minimal ? 'col-span-7 bg-transparent shadow-none hover:bg-gray-200 opacity-25 hover:opacity-100 py-3' : 'w-full'}
        icon={minimal ? null : faPlus}
        onClick={triggerOpen} />
    </>
  )
}
