import classNames from 'classnames'

interface Input {
  placeholder?: string;
  onChange?: (e: any) => void;
  label?: string;
  value: string;
  name: string; // Also ID
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export const FormInputText = ({ placeholder, onChange, value, name, label, required, className, disabled }: Input) => {
  let baseClass = 'w-full block rounded border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-4'

  if (disabled) {
    baseClass += ' bg-gray-100 text-gray-400 cursor-not-allowed'
  }

  const Button = () => (<input id={name}
    type="text"
    name={name}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    value={value}
    className={ classNames(baseClass, className)}
    contentEditable={false}
    disabled={disabled}
    readOnly={disabled}
  />)

  if (label) {
    return (
      <div>
        <label htmlFor={name}>{ label }
          <Button />
        </label>
      </div>
    )
  }

  return (<Button />)
}
