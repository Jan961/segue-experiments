import { forwardRef } from 'react';
import Icon from '../Icon';
import { IconName } from '../Icon/Icon';

export interface TextInputProps {
  id?: string;
  value?: string;
  disabled?: boolean;
  className?: string;
  onChange?: (e: any) => void;
  placeHolder?: string;
  onClick?: (e: any) => void;
  iconName?: IconName;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ id, value = '', className = '', disabled = false, onChange, placeHolder = '', onClick, iconName }, ref) => {
    const baseClass = `block min-w-fit h-[1.9375rem] text-sm shadow-sm-shadow text-primary-input-text rounded-md !border-primary-border outline-none focus:ring-2 focus:ring-primary-input-text ring-inset`;
    const disabledClass = disabled ? `!bg-disabled !cursor-not-allowed !pointer-events-none` : '';

    return (
      <div className="relative" onClick={onClick}>
        <input
          ref={ref}
          id={id}
          type="text"
          className={`${baseClass} ${disabledClass} ${iconName ? 'pr-10' : ''} ${className}`}
          disabled={disabled}
          onChange={onChange}
          placeholder={placeHolder}
          value={value || ''}
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
