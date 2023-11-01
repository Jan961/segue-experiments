import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

interface FormInputButtonProps {
  loading?: boolean;
  disabled?: boolean;
  text?: string;
  onClick?: (e: any) => void;
  submit?: boolean;
  className?: string;
  icon?: IconProp;
  intent?: undefined | 'DANGER' | 'PRIMARY';
}

const LoadingSpinner = () => {
  return (
    <div className="inline-block ml-2 -my-2">
      <div className="animate-spin">
        <FontAwesomeIcon icon="spinner" size="xl" />
      </div>
    </div>
  );
};

// Larger button for submitting forms. Green in color
export const FormInputButton = ({
  loading,
  disabled,
  text,
  onClick,
  submit,
  className,
  intent,
  icon,
}: FormInputButtonProps) => {
  const baseClass = 'rounded shadow text-sm px-3 py-2 cursor-pointer ';

  const intentClass =
    intent === 'DANGER'
      ? 'bg-red-500 hover:bg-red-400 text-white'
      : intent === 'PRIMARY'
      ? 'bg-primary-blue text-white hover:bg-soft-primary-blue hover:text-black'
      : 'bg-gray-200 hover:bg-gray-100 active:bg-gray-300';

  const availableClasses = classNames(baseClass, intentClass);
  const disabledClasses = classNames(baseClass + 'bg-gray-300 text-gray-400 cursor-not-allowed');

  const endClass = disabled ? disabledClasses : !loading ? availableClasses : disabledClasses;

  return (
    <button
      className={classNames(endClass, className)}
      type={submit ? 'submit' : 'button'}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
      {icon && <FontAwesomeIcon icon={icon} className={text ? 'ml-2' : ''} />}
      {loading && <LoadingSpinner />}
    </button>
  );
};
