import { forwardRef } from 'react';
import Icon from '../Icon';
import { IconName } from '../Icon/Icon';
import classNames from 'classnames';

export interface TextInputProps {
  id?: string;
  value?: string;
  disabled?: boolean;
  className?: string;
  onChange?: (e: any) => void;
  placeHolder?: string;
  onClick?: (e: any) => void;
  iconName?: IconName;
  onKeyDown?: (e: any) => void;
  error?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      id,
      value = '',
      className = '',
      disabled = false,
      onChange,
      placeHolder = '',
      onClick,
      iconName,
      onKeyDown,
      error,
    },
    ref,
    ...rest
  ) => {
    const baseClass = `block min-w-fit h-[1.9375rem] !border text-sm shadow-inner text-primary-input-text rounded-md outline-none focus:ring-2 focus:ring-primary-input-text ring-inset`;
    const inputClass = error ? '!border-primary-red' : '!border-primary-border';
    const disabledClass = disabled ? `!bg-disabled !cursor-not-allowed !pointer-events-none` : '';

    return (
      <div className="relative" onClick={onClick}>
        <input
          ref={ref}
          id={id}
          type="text"
          className={classNames(baseClass, inputClass, disabledClass, `${iconName ? 'pr-10' : ''}`, className)}
          disabled={disabled}
          onChange={onChange}
          placeholder={placeHolder}
          value={value || ''}
          {...rest}
          onKeyDown={onKeyDown}
        />
        {iconName && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <Icon aria-hidden="true" iconName={iconName} />
          </div>
        )}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';

export default TextInput;
