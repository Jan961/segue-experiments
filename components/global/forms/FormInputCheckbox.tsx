import classNames from 'classnames'

interface Input {
  onChange: (e: any) => void
  label?: string
  value: boolean
  name?: string // Also ID
  disabled?: boolean
  className?: string
}

export const FormInputCheckbox = ({ onChange, value, name, label, disabled, className }: Input) => {
  const modifyOnChange = (e: any) => {
    const newValue = !value
    const newEvent = { ...e, target: { ...e.target, value: newValue, id: name } }
    onChange(newEvent)
  }

  return (
    <label htmlFor={name} className={ classNames(className, 'flex items-center justify-between')}>
      <div className="text-sm pb-2">{ label }</div>
      <input
        id={name}
        type="checkbox"
        name={name}
        onChange={modifyOnChange}
        checked={value}
        disabled={disabled}
        className="rounded border-gray-300 cursor-pointer p-3 my-2 ml-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-4"
      />
    </label>
  )
}
