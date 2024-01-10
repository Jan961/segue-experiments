import classNames from 'classnames';
import { useEffect } from 'react';

interface Input {
  onChange: (e: any) => void;
  label?: string;
  value: boolean;
  name?: string; // Also ID
  disabled?: boolean;
  className?: string;
  minimal?: boolean;
  showIntermediate?: boolean;
  testid?: string;
}

export const FormInputCheckbox = ({
  onChange,
  value = false,
  name,
  label,
  disabled,
  className,
  minimal = false,
  showIntermediate = false,
  testid,
}: Input) => {
  const modifyOnChange = (e: any) => {
    e.stopPropagation();
    const newValue = !value;
    const newEvent = { ...e, target: { ...e.target, value: newValue, id: name } };
    onChange(newEvent);
  };

  useEffect(() => {
    (document.getElementById(`form-input-checkbox-${name}`) as HTMLInputElement).indeterminate = showIntermediate;
  }, [showIntermediate]);

  let baseInputClass =
    'rounded border-gray-300 cursor-pointer p-2 m-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ';

  if (!minimal) baseInputClass = classNames(baseInputClass, 'm-2');

  return (
    <label htmlFor={name} className={classNames('flex items-center justify-between', className)}>
      {label && <div className="text-sm">{label}</div>}
      <input
        id={`form-input-checkbox-${name}`}
        data-testid={`form-input-checkbox-${testid}`}
        type="checkbox"
        name={name}
        onChange={modifyOnChange}
        checked={value}
        disabled={disabled}
        className={baseInputClass}
      />
    </label>
  );
};
