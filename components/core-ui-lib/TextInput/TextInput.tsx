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
  error?: string;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    { id, value = '', className = '', disabled = false, onChange, placeHolder = '', onClick, iconName, error, ...rest },
    ref,
  ) => {
    const baseClass = `block w-fit-content pl-2 h-[1.9375rem] !border text-sm shadow-input-shadow text-primary-input-text rounded-md outline-none focus:ring-2 focus:ring-primary-input-text ring-inset`;
    const inputClass = error ? '!border-primary-red' : '!border-primary-border';

    return (
      <div
        className={`flex justify-between items-center relative ${disabled ? 'disabled-input' : ''}`}
        onClick={onClick}
      >
        <input
          ref={ref}
          id={id}
          type="text"
          className={classNames(baseClass, inputClass, `${iconName ? 'pr-6' : ''}`, className)}
          onChange={onChange}
          placeholder={placeHolder}
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
