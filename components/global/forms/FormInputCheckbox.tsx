import classNames from 'classnames';

interface Input {
  onChange: (e: any) => void;
  label?: string;
  value: boolean;
  name?: string; // Also ID
  disabled?: boolean;
  className?: string;
  minimal?: boolean;
}

export const FormInputCheckbox = ({ onChange, value, name, label, disabled, className, minimal = false }: Input) => {
  const modifyOnChange = (e: any) => {
    e.stopPropagation();
    const newValue = !value;
    const newEvent = { ...e, target: { ...e.target, value: newValue, id: name } };
    onChange(newEvent);
  };

  let baseInputClass =
    'rounded border-gray-300 cursor-pointer p-3 m-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ';

  if (!minimal) baseInputClass = classNames(baseInputClass, 'm-2 mb-4');

  return (
    <label htmlFor={name} className={classNames('flex items-center justify-between', className)}>
      {label && <div className="text-sm pb-2">{label}</div>}
      <input
        id={name}
        type="checkbox"
        name={name}
        onClick={modifyOnChange}
        checked={value}
        disabled={disabled}
        className={baseInputClass}
      />
    </label>
  );
};
