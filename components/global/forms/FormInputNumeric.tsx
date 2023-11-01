import classNames from 'classnames';
import React from 'react';

interface Input {
  placeholder?: string;
  onChange?: (value: number) => void;
  label?: string;
  min?: number;
  max?: number;
  value?: number;
  name: string; // Also ID
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export const FormInputNumeric = (props: Input) => {
  const { placeholder, onChange, name, label, required, disabled, min, max, className = '', value = 0 } = props;
  const outputClass = React.useMemo(() => {
    let baseClass =
      'w-full block rounded border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-2';

    if (disabled) {
      baseClass = classNames('bg-gray-100 text-gray-400 cursor-not-allowed', baseClass);
    }

    return classNames(baseClass, className);
  }, [className, disabled]);

  const numericOnChange = (e: any) => {
    const { value } = e.target;
    onChange(value ? Number(value) : null);
  };

  const handleFocus = (event: any) => event.target.select();

  const inputProps = {
    id: name,
    name,
    onInput: numericOnChange,
    placeholder,
    required,
    value,
    className: outputClass,
    disabled,
    min,
    max,
    onFocus: handleFocus,
    readOnly: disabled,
  };

  if (label) {
    return (
      <div className={className}>
        <label htmlFor={name}>
          {label && (
            <div className="text-sm pb-2 pr-2">
              {label} {required ? '*' : null}
            </div>
          )}
          <input type="number" {...inputProps} />
        </label>
      </div>
    );
  }

  return <input type="number" {...inputProps} />;
};
