import classNames from 'classnames';

export type SelectOption = {
  text: string;
  value: string | number;
};

interface Input {
  onChange: (e: any) => void;
  label?: string;
  value: string | number;
  name: string; // Also ID
  required?: boolean;
  options: SelectOption[];
  disabled?: boolean;
  inline?: boolean; // Side by Side
  className?: string;
}

export const FormInputSelect = ({
  onChange,
  value,
  name,
  label,
  required,
  options,
  disabled,
  className = '',
  inline,
}: Input) => {
  const inputClass =
    'w-full pr-8 block rounded border-gray-300 px-3 py-2 focus:border-indigo-500 mb-2 focus:ring-indigo-500 sm:text-sm';
  let baseClass = classNames('whitespace-nowrap mb-2', className);
  if (inline) {
    baseClass = classNames(baseClass, 'flex items-baseline gap-x-2');
  }

  const disabledClass = classNames(inputClass, 'bg-gray-100 text-gray-400');

  return (
    <label htmlFor={name} className={baseClass}>
      {label && <span className="text-sm pb-2 inline-block">{label}</span>}
      <select
        id={name}
        name={name}
        onChange={onChange}
        disabled={disabled}
        className={disabled ? disabledClass : inputClass}
        required={required}
        value={value || ''}
      >
        {options?.map?.((x) => (
          <option value={x.value} key={x.value}>
            {x.text}
          </option>
        ))}
      </select>
    </label>
  );
};
