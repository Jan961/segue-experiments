import React, { forwardRef } from 'react';
import Icon from '../Icon';
import { IconName } from '../Icon/Icon';
import classNames from 'classnames';
export interface TextInputProps {
  id?: string;
  name?: string;
  value?: string | number;
  disabled?: boolean;
  className?: string;
  maxlength?: number;
  inputClassName?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onClick?: (e: any) => void;
  iconName?: IconName;
  error?: string;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
  type?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      id,
      value = '',
      className = '',
      disabled = false,
      onChange = () => null,
      placeholder = '',
      onClick,
      iconName,
      error,
      inputClassName,
      ...rest
    },
    ref,
  ) => {
    const baseClass = `block w-fit-content pl-2 h-[1.9375rem] !border text-sm shadow-input-shadow text-primary-input-text rounded-md outline-none focus:ring-2 focus:ring-primary-input-text ring-inset`;
    const inputClass = error ? '!border-primary-red' : '!border-primary-border';

    return (
      <div
        className={`flex justify-between items-center relative  ${inputClassName} ${disabled ? 'disabled-input' : ''} `}
        onClick={onClick}
      >
        <input
          ref={ref}
          id={id}
          type={rest.type ? rest.type : 'text'}
          className={classNames(baseClass, inputClass, `${iconName ? 'pr-6' : ''}`, className)}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          value={value || ''}
          {...rest}
        />
        {iconName && (
          <div className="input-icon pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <Icon aria-hidden="true" iconName={iconName} />
          </div>
        )}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';

export default TextInput;
