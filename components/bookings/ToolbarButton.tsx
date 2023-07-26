import { PropsWithChildren } from 'react'

interface ToolbarButtonProps {
  submit?: boolean;
  onClick?: (e: any) => void
  disabled?: boolean
}

export const ToolbarButton = ({ submit, onClick, children, disabled }: PropsWithChildren<ToolbarButtonProps>) => {
  return (
    <button onClick={onClick}
      disabled={disabled}
      className="bg-white shadow-md hover:shadow-lg text-primary-blue whitespace-nowrap font-bold py-2 px-5 rounded-l-md rounded-r-md"
      type={ submit ? 'submit' : 'button' } >
      { children }
    </button>
  )
}
