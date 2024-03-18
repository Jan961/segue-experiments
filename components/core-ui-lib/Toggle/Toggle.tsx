import { Switch } from '@headlessui/react';
import classNames from 'classnames';
import { useEffect, useState } from 'react';

export interface ToggleProps {
  onChange: (e: any) => void;
  checked: boolean;
  label?: string;
  name?: string;
  className?: string;
}

const Toggle = ({ label, onChange, name, checked, className }: ToggleProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(checked);
  }, [checked]);

  const onToggle = (status: boolean) => {
    setEnabled(status);
    onChange(status);
  };

  return (
    <Switch
      name={name}
      checked={enabled}
      onChange={onToggle}
      className={classNames(
        className,
        'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75 w-7 h-[18px] bg-disabled-button',
      )}
    >
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className={classNames(
          'pointer-events-none inline-block w-4 h-4 transform rounded-full bg-primary shadow-lg ring-0 transition duration-200 ease-in-out',
          { 'translate-x-2': enabled, 'translate-x-0': !enabled },
        )}
      />
    </Switch>
  );
};

export default Toggle;