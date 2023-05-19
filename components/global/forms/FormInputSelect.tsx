import classNames from "classnames"

export interface SelectOption {
  text: string
  value: string
}

interface Input {
  placeholder?: string
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

export const FormInputSelect = ({ placeholder, onChange, value, name, label, required, options, disabled, className = '', inline }: Input) => {
  const inputClass = 'w-full block rounded border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-4'
  let baseClass = classNames(className, 'whitespace-nowrap')
  if (inline) {
    baseClass = classNames(baseClass, 'flex items-baseline gap-x-4')
  }

  return (
    <div>
      <label htmlFor={name} className={baseClass}>{ label }
        <select
          id={name}
          name={name}
          onChange={onChange}
          disabled={disabled}
          className={inputClass}
          required={required}
          value={value}
        >
          {options.map(x => (<option value={x.value} key={x.value}>{x.text}</option>))}
        </select>
      </label>
    </div>
  )
}
