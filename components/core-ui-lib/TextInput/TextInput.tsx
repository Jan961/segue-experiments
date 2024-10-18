import React, { forwardRef } from 'react';
import Icon from '../Icon';
import { IconName } from '../Icon/Icon';
import classNames from 'classnames';
import { isUndefined } from 'utils';

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
  required?: boolean;
  testId?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  pattern?: RegExp;
  autoComplete?: 'on' | 'off';
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
      onKeyDown,
      testId,
      autoComplete = 'off',
      pattern,
      type,
      ...rest
    },
    ref,
  ) => {
    const baseClass = `block w-fit-content pl-2 h-[1.9375rem] text-sm shadow-input-shadow text-primary-input-text rounded-md outline-none autofill-white-bg`;
    const inputClass = error ? '!border-primary-red' : '!border-primary-border';
    const disabledClass = disabled ? 'disabled-input !border-none !bg-gray-200 focus:outline-none' : '';

    const handleChange = (e) => {
      if (isUndefined(pattern)) {
        onChange(e);
      } else {
        const valueStr = e.target.value.toString();
        pattern.test(valueStr) && onChange(e);
      }
    };

    const handleWheel = (e) => {
      if (type === 'number') {
        e.preventDefault();
        e.target.blur();
        setTimeout(() => e.target.focus(), 0);
      }
    };

    return (
      <div
        className={classNames(
          'flex justify-between items-center relative',
          inputClassName,
          disabled ? 'pointer-events-none' : '',
        )}
        onClick={disabled ? undefined : onClick}
      >
        <input
          data-testid={testId || 'core-ui-lib-text-input'}
          ref={ref}
          id={id}
          type={type || 'text'}
          className={classNames(baseClass, inputClass, disabledClass, `${iconName ? 'pr-6' : ''}`, className, {
            'focus:ring-2 focus:ring-primary-input-text ring-inset': !disabled,
            'cursor-not-allowed': disabled,
          })}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          value={value || ''}
          onKeyDown={onKeyDown}
          autoComplete={autoComplete}
          onWheel={handleWheel}
          {...rest}
        />
        {iconName && (
          <div
            data-testid={testId ? `${testId}-icon` : 'core-ui-lib-text-input-icon'}
            className="input-icon pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <Icon aria-hidden="true" iconName={iconName} />
          </div>
        )}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';

export default TextInput;
