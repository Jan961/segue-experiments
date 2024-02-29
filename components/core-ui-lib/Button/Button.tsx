import classNames from 'classnames';
import Icon, { IconName, IconProps } from '../Icon/Icon';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

export interface ButtonProps {
  id?: string;
  text?: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  loading?: boolean;
  prefixIconName?: IconName | string;
  sufixIconName?: IconName | string;
  iconProps?: Partial<IconProps>;
}

const baseClass =
  'h-[1.9375rem] min-w-fit px-2 py-1 rounded-md text-center flex justify-center items-center !shadow-sm-shadow font-bold text-sm tracking-[-0.00263re] transition-all hover:scale-105';
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
  text = '',
  variant = 'primary',
  className = '',
  disabled = false,
  onClick,
  prefixIconName,
  sufixIconName,
  iconProps,
}: ButtonProps) {
  const variantClass = ClassMap.get(variant);
  const disabledClass = disabled
    ? `!bg-disabled-button bg-opacity-65 text-white !cursor-not-allowed !pointer-events-none`
    : '';
  const endClass = `${baseClass} ${variantClass} ${disabledClass} ${className}`;

  return (
    <button
      id={id}
      type="button"
      className={classNames(
        endClass,
        { 'items-center gap-1 grid grid-cols-12': prefixIconName || sufixIconName },
        { relative: prefixIconName || sufixIconName },
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {prefixIconName && (
        <span className="col-span-1 absolute left-2">
          <Icon aria-hidden="true" iconName={prefixIconName} {...iconProps} />
        </span>
      )}

      <div className="col-span-10 text-center">{text || ''}</div>

      {sufixIconName && (
        <span className="col-span-1 absolute right-2">
          <Icon aria-hidden="true" iconName={sufixIconName} {...iconProps} />
        </span>
      )}
    </button>
  );
}
