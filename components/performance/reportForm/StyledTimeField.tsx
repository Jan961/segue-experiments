import React from 'react'
import TimeField from 'react-simple-timefield'

interface StyledTimeFieldProps {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void
  disabled?: boolean
}

export const StyledTimeField = ({ value, onChange, disabled }: StyledTimeFieldProps): React.JSX.Element => (
  <TimeField
    value={value}
    onChange={onChange}
    style={{ width: 55 }}
    {...{ disabled, className: 'p-0 border-none px-1  bg-gray-100 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ' }}
  />
)
