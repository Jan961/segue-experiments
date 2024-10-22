import classNames from 'classnames';
import Icon, { IconName, IconProps } from '../Icon/Icon';
import { PropsWithChildren } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

export interface ButtonProps {
  id?: string;
  testId?: string;
  text?: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  loading?: boolean;
  prefixIconName?: IconName | string;
  sufixIconName?: IconName | string;
  iconProps?: Partial<IconProps>;
  type?: 'button' | 'submit' | 'reset';
}

const baseClass =
  'h-[1.9375rem] min-w-fit px-2 py-1 rounded-md text-center flex justify-center items-center !shadow-sm-shadow font-bold text-sm tracking-[-0.00263re] transition-all';
const primaryClass = 'bg-primary-navy text-primary-white hover:bg-primary-button-hover active:bg-primary-button-active';
const secondaryClass =
  'bg-primary-white border border-primary-button-active text-primary-button-active hover:bg-secondary-button-hover active:bg-secondary-button-active';
const tertiaryClass =
  'bg-primary-red text-primary-white hover:bg-tertiary-button-hover active:bg-tertiary-button-active';

const ClassMap = new Map([
  ['primary', primaryClass],
  ['secondary', secondaryClass],
  ['tertiary', tertiaryClass],
]);

export default function Button({
  id,
  testId = 'core-ui-lib-btn',
  text = '',
  variant = 'primary',
  className = '',
  disabled = false,
  onClick,
  prefixIconName,
  sufixIconName,
  iconProps,
  children,
  type = 'button',
}: PropsWithChildren<ButtonProps>) {
  const variantClass = ClassMap.get(variant);
  const disabledClass = disabled
    ? `!bg-disabled-button bg-opacity-65 text-white !cursor-not-allowed !pointer-events-none border-none`
    : '';
  const endClass = `${baseClass} ${variantClass} ${disabledClass} ${className}`;

  return (
    <button
      id={id}
      type={type}
      className={classNames(
        endClass,
        { 'items-center gap-1 grid grid-cols-12': prefixIconName || sufixIconName },
        { relative: prefixIconName || sufixIconName },
      )}
      disabled={disabled}
      onClick={onClick}
      data-testid={`${testId || id}`}
    >
      {prefixIconName && (
        <span className="col-span-1 absolute left-2">
          <Icon aria-hidden="true" iconName={prefixIconName} {...iconProps} />
        </span>
      )}

      <div className="col-span-10 text-center">{text || ''}</div>
      {children}
      {sufixIconName && (
        <span className="col-span-1 absolute right-2">
          <Icon aria-hidden="true" iconName={sufixIconName} {...iconProps} />
        </span>
      )}
    </button>
  );
}
