import classNames from 'classnames'

export type SelectOption = {
  text: string
  value: string
}

interface Input {
  onChange: (e: any) => void
  label?: string
  value: string | number
  name: string; // Also ID
  required?: boolean
  options: SelectOption[]
  disabled?: boolean
  inline?: boolean // Side by Side
  className?: string
}

export const FormInputSelect = ({ onChange, value, name, label, required, options, disabled, className = '', inline }: Input) => {
  const inputClass = 'w-full block rounded border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-4'
  let baseClass = classNames(className, 'whitespace-nowrap')
  if (inline) {
    baseClass = classNames(baseClass, 'flex items-baseline gap-x-4')
  }

  const disabledClass = classNames(inputClass, 'bg-gray-100 text-gray-400')

  return (
    <div>
      <label htmlFor={name} className={baseClass}>
        <span className="text-sm pb-1 inline-block">{ label }</span>
        <select
          id={name}
          name={name}
          onChange={onChange}
          disabled={disabled}
          className={disabled ? disabledClass : inputClass}
          required={required}
          value={value}
        >
          {options.map(x => (<option value={x.value} key={x.value}>{x.text}</option>))}
        </select>
      </label>
    </div>
  )
}
