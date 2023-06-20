import classNames from 'classnames'
import { dateToPicker } from 'services/dateService'

interface Input {
  onChange: (e: any) => void
  label?: string
  value: string | Date
  name?: string // Also ID
  required?: boolean
  className?: string
  disabled?: boolean
}

export const FormInputTime = ({ onChange, value, name, label, required, className, disabled }: Input) => {
  const stringValue = dateToPicker(value)
  const baseClass = 'w-full block rounded border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-2'
  const disabledClass = classNames(baseClass, 'bg-gray-100 text-gray-400')

  return (
    <div className={className}>
      <label htmlFor={name}>{ label }
        <input id={name}
          type="time"
          name={name}
          onChange={onChange}
          required={required}
          value={stringValue}
          className={disabled ? disabledClass : baseClass}
          disabled={disabled}
        />
      </label>
    </div>
  )
}
