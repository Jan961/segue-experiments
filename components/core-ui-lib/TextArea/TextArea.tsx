import React, { forwardRef, useEffect, useRef } from 'react';

export interface TextInputProps {
  id?: string;
  value?: string;
  disabled?: boolean;
  className?: string;
  onChange?: (e: any) => void;
  placeholder?: string;
  onClick?: (e: any) => void;
  onBlur?: (e: any) => void;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextInputProps>(
  ({ id, value = '', className = '', disabled = false, onChange, placeholder = '', onClick, onBlur }, ref) => {
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
      const textarea = textAreaRef.current;
      if (textarea && className.includes('h-auto')) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [value, className]);

    const handleChange = (e: any) => {
      if (className.includes('h-auto') && textAreaRef.current) {
        textAreaRef.current.style.height = 'auto';
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
      }
      onChange && onChange(e);
    };

    const baseClass = `block min-w-fit h-[1.9375rem] text-sm shadow-input-shadow text-primary-input-text rounded-md !border-primary-border outline-none focus:ring-2 focus:ring-primary-input-text ring-inset`;
    const disabledClass = disabled ? `!bg-disabled-input !cursor-not-allowed !pointer-events-none` : '';

    return (
      <div className="relative" onClick={onClick}>
        <textarea
          ref={(node) => {
            textAreaRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
            }
          }}
          id={id}
          className={`${baseClass} ${disabledClass} ${className}`}
          disabled={disabled}
          onChange={handleChange}
          placeholder={placeholder}
          value={value || ''}
          onBlur={onBlur}
        />
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';

export default TextArea;
