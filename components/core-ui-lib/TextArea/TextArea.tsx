import { forwardRef } from 'react';

export interface TextInputProps {
  id?: string;
  value?: string;
  disabled?: boolean;
  className?: string;
  onChange?: (e: any) => void;
  placeHolder?: string;
  onClick?: (e: any) => void;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextInputProps>(
  ({ id, value = '', className = '', disabled = false, onChange, placeHolder = '', onClick }, ref) => {
    const baseClass = `block min-w-fit h-[1.9375rem] text-sm shadow-input-shadow text-primary-input-text rounded-md !border-primary-border outline-none focus:ring-2 focus:ring-primary-input-text ring-inset`;
    const disabledClass = disabled ? `!bg-disabled-input !cursor-not-allowed !pointer-events-none` : '';

    return (
      <div className="relative" onClick={onClick}>
        <textarea
          ref={ref}
          id={id}
          className={`${baseClass} ${disabledClass} ${className}`}
          disabled={disabled}
          onChange={onChange}
          placeholder={placeHolder}
          value={value || ''}
        />
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';

export default TextArea;