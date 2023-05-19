import classNames from 'classnames'
import React from 'react';

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

const Text = (props) => (<input type="text" {...props} />)

export const FormInputText = ({ placeholder, onChange, value, name, label, required, disabled, className = '' }: Input) => {
  const outputClass = React.useMemo(() => {
    let baseClass = 'w-full block rounded border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-4'

    if (disabled) {
      baseClass = classNames('bg-gray-100 text-gray-400 cursor-not-allowed', baseClass)
    }

    return classNames(baseClass, className)
  }, [className, disabled])

  const inputProps = {
    name,
    onChange,
    placeholder,
    required,
    value,
    className: outputClass,
    disabled,
    readOnly: disabled
  }

  if (label) {
    return (
      <div>
        <label htmlFor={name}>{ label }
          <Text {...inputProps} />
        </label>
      </div>
    )
  }

  return (<Text {...inputProps} />)
}
