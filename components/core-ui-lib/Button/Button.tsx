type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

export interface ButtonProps {
  id?: string;
  text?: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

const baseClass =
  'h-[1.9375rem] min-w-fit px-2 py-1 rounded-md text-center flex justify-center items-center !shadow-sm-shadow font-bold text-sm tracking-[-0.00263re] transition-all hover:scale-110';
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
}: ButtonProps) {
  const variantClass = ClassMap.get(variant);
  const disabledClass = disabled ? `!bg-disabled !cursor-not-allowed !pointer-events-none` : '';
  const endClass = `${baseClass} ${variantClass} ${disabledClass} ${className}`;

  return (
    <button id={id} type="button" className={endClass} disabled={disabled} onClick={onClick}>
      {text || ''}
    </button>
  );
}
