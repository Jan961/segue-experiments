import { useEffect } from 'react';

interface CheckboxProps {
  id: string;
  onChange: (e: any) => void;
  label?: string;
  value?: string;
  name?: string; // Also ID
  disabled?: boolean;
  checked?: boolean;
  showIntermediate?: boolean;
  testId?: string;
  className?: string;
}

const Checkbox = ({
  id,
  onChange,
  value = '',
  checked = false,
  name,
  disabled,
  showIntermediate = false,
  testId,
  className,
  label,
}: CheckboxProps) => {
  const modifyOnChange = (e: any) => {
    e.stopPropagation();
    const newValue = !value;
    const newEvent = { ...e, target: { ...e.target, value: newValue, id: name } };
    onChange(newEvent);
  };

  useEffect(() => {
    (document.getElementById(`form-input-checkbox-${id}`) as HTMLInputElement).indeterminate = showIntermediate;
  }, [showIntermediate]);

  return (
    <div className={`w-full ${checked || showIntermediate ? 'flex' : ''} flex items-center gap-2 ${className}`}>
      <input
        id={`form-input-checkbox-${id}`}
        data-testid={`core-ui-lib-checkbox-${testId}`}
        type="checkbox"
        name={name}
        onChange={modifyOnChange}
        value={value}
        checked={checked}
        disabled={disabled}
        className="peer relative appearance-none shrink-0 w-4 h-4 rounded-sm focus:ring-primary-input-text text-base"
      />
      {label && <label className="text-primary-label text-sm leading-8 font-normal ">{label}</label>}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="19"
        viewBox="0 0 19 19"
        fill="none"
        className="absolute w-4 h-4 pointer-events-none stroke-white fill-none peer-checked:!fill-primary-input-text"
      >
        <g clipPath="url(#clip0_41_112)">
          <rect x="1.1875" y="1.78125" width="16.625" height="15.4375" fill="white" />
          <path d="M16.8886 0H2.11138C0.939906 0 0 0.95 0 2.11138V16.8886C0 18.05 0.939906 19 2.11138 19H16.8886C18.0601 19 19 18.05 19 16.8886V2.11138C19 0.95 18.0601 0 16.8886 0ZM7.38922 14.7773L2.11138 9.49941L3.59931 8.01147L7.38922 11.7901L15.4007 3.77863L16.8886 5.27725L7.38922 14.7767V14.7773Z" />
        </g>
        <defs>
          <clipPath id="clip0_41_112">
            <rect width="19" height="19" fill="white" />
          </clipPath>
        </defs>
      </svg>
      {showIntermediate && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="19"
          viewBox="0 0 19 19"
          fill="none"
          className="absolute w-4 h-4 pointer-events-none stroke-white"
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
              <rect width="19" height="19" fill="white" />
            </clipPath>
          </defs>
        </svg>
      )}
    </div>
  );
};

export default Checkbox;
