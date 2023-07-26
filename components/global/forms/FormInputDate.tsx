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
  inline?: boolean
}

export const FormInputDate = ({ onChange, value, name, label, required, className, disabled, inline }: Input) => {
  const stringValue = dateToPicker(value)
  let baseClass = 'w-full block rounded border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-2'
  if (disabled) baseClass = classNames(baseClass, 'bg-gray-100 text-gray-400')
  const flexClass = inline ? 'flex whitespace-nowrap items-center' : ''

  const inputProps = {
    id: name,
    type: 'date',
    name,
    onChange,
    value: stringValue,
    required,
    className: baseClass,
    disabled,
    contentEditable: false
  }

  return (
    <div className={className}>
      <label htmlFor={name} className={flexClass}>
        <div className='text-sm pb-2 pr-2'>{ label } { required ? '*' : null }</div>
        <input {...inputProps}/>
      </label>
    </div>
  )
}
