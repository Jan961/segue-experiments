import { forwardRef, useEffect } from 'react';
import Label from '../Label';

interface CheckboxProps {
  id: string;
  onChange: (e: any) => void;
  label?: string;
  value?: string | number;
  name?: string; // Also ID
  disabled?: boolean;
  checked?: boolean;
  showIntermediate?: boolean;
  testId?: string;
  className?: string;
  labelClassName?: string;
  required?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id,
      onChange,
      value = '',
      checked = false,
      name,
      disabled = false,
      showIntermediate = false,
      testId = 'core-ui-lib-checkbox',
      className,
      label,
      labelClassName,
      required = false,
    }: CheckboxProps,
    ref,
  ) => {
    const modifyOnChange = (e: any) => {
      e.stopPropagation();
      const newValue = !checked;
      const newEvent = { ...e, target: { ...e.target, value: newValue, id: name, name } };
      onChange(newEvent);
    };

    useEffect(() => {
      (document.getElementById(`form-input-checkbox-${id}`) as HTMLInputElement).indeterminate = showIntermediate;
    }, [showIntermediate]);

    return (
      <div className={`${checked || showIntermediate ? 'flex' : ''} flex items-center gap-2 relative ${className}`}>
        <input
          ref={ref}
          id={`form-input-checkbox-${id}`}
          data-testid={`${testId}`}
          type="checkbox"
          name={name}
          onChange={modifyOnChange}
          value={value}
          checked={checked}
          disabled={disabled}
          className={`
          peer 
          relative 
          appearance-none 
          shrink-0 
          w-[1.1875rem] 
          h-[1.1875rem] 
          rounded-sm 
          focus:ring-transparent  
          focus:checked:bg-primary-input-text 
          checked:hover:bg-primary-input-text  
          checked:bg-primary-input-text
          ${disabled ? 'disabled-input' : ''}
          `}
        />

        {label && (
          <Label testId={`${testId}-label`} text={label} className={labelClassName} variant="sm" required={required} />
        )}

        {showIntermediate && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="absolute w-5 h-5 pointer-events-none"
          >
            <g clipPath="url(#clip0_41_113)">
              <rect x="1.1875" y="1.78125" width="16.625" height="15.4375" fill="white" />
              <path
                d="M16.8886 0H2.11138C0.95 0 0 0.95 0 2.11138V16.8886C0 18.05 0.95 19 2.11138 19H16.8886C18.05 19 19 18.05 19 16.8886V2.11138C19 0.95 18.05 0 16.8886 0ZM14.7784 10.5551H4.22334V8.44372H14.7784V10.5551Z"
                fill="#617293"
              />
            </g>
            <defs>
              <clipPath id="clip0_41_113">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
        )}
      </div>
    );
  },
);
Checkbox.displayName = 'Checkbox';

export default Checkbox;
