import classNames from 'classnames';
import { PropsWithChildren } from 'react';

interface ToolbarButtonProps {
  submit?: boolean;
  onClick?: (e: any) => void;
  disabled?: boolean;
  className?: string;
}

export const ToolbarButton = ({
  submit,
  onClick,
  children,
  disabled,
  className,
}: PropsWithChildren<ToolbarButtonProps>) => {
  let baseClass =
    'bg-primary-navy shadow-md hover:shadow-lg text-white whitespace-nowrap font-medium py-2 px-5 rounded-l-md rounded-r-md';

  baseClass = classNames(baseClass, className);
  if (disabled) baseClass = classNames(baseClass, 'opacity-50');

  return (
    <button onClick={onClick} disabled={disabled} className={baseClass} type={submit ? 'submit' : 'button'}>
      {children}
    </button>
  );
};
