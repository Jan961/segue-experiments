import classNames from 'classnames';
import React from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Input {
  placeholder?: string;
  onChange?: (e: any) => void;
  onKeyDown?: (e: any) => void;
  label?: string;
  value: string;
  name: string; // Also ID
  required?: boolean;
  className?: string;
  disabled?: boolean;
  area?: boolean;
}

export const FormInputText = (props: Input) => {
  const { placeholder, onChange, onKeyDown, value, name, label, required, disabled, className = '', area } = props;
  const outputClass = React.useMemo(() => {
    let baseClass =
      'w-full block rounded border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-2';

    if (disabled) {
      baseClass = classNames('bg-gray-100 text-gray-400 cursor-not-allowed', baseClass);
    }

    return classNames(baseClass, className);
  }, [className, disabled]);

  const inputProps = {
    id: name,
    name,
    onChange,
    onKeyDown,
    placeholder,
    required,
    value: value || '',
    className: outputClass,
    disabled,
    readOnly: disabled,
  };

  const containerClass = classNames('relative', className);

  const iconClass = 'absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 mt-2';

  if (area) {
    return (
      <div className={className}>
        <label htmlFor={name}>
          <div className="text-sm pb-2">
            {label} {required ? '*' : null}
          </div>
          <textarea {...inputProps} rows={4} />
        </label>
      </div>
    );
  }

  if (label) {
    return (
      <div className={className}>
        <label htmlFor={name}>
          <div className="text-sm pb-2">
            {label} {required ? '*' : null}
          </div>
          <input type="text" {...inputProps} />
        </label>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      {label && (
        <label htmlFor={name}>
          <div className="text-sm pb-2">
            {label} {required ? '*' : null}
          </div>
        </label>
      )}
      <input type="text" {...inputProps} />
      <FontAwesomeIcon icon={faSearch} className={iconClass} />
    </div>
  );
};
