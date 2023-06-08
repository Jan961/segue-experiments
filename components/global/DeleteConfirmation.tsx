import React, { PropsWithChildren } from 'react'
import { StyledDialog } from './StyledDialog'

interface DeleteConfirmationProps {
  onConfirm: () => void
  onCancel: () => void
  title: string
}

export const DeleteConfirmation = ({ onConfirm, onCancel, title, children }: PropsWithChildren<DeleteConfirmationProps>) => {
  const [open, setOpen] = React.useState(true)

  const cancel = () => {
    setOpen(false)
    onCancel()
  }

  const confirm = () => {
    setOpen(false)
    onConfirm()
  }

  return (
    <StyledDialog open={open} onClose={cancel} title={title}>
      { children }
      <StyledDialog.FooterContainer>
        <StyledDialog.FooterCancel onClick={onCancel}>Cancel</StyledDialog.FooterCancel>
        <StyledDialog.FooterContinue intent="DANGER" onClick={confirm}>Delete</StyledDialog.FooterContinue>
      </StyledDialog.FooterContainer>
    </StyledDialog>
  )
}
