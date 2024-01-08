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
  testId?: string;
  tooltip?: string;
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
  testId,
  loading,
  disabled = false,
  text,
  onClick,
  submit,
  className,
  intent,
  icon,
  tooltip = '',
}: FormInputButtonProps) => {
  const baseClass = `flex justify-center items-center rounded shadow text-responsive-sm px-3 py-2 ${
    disabled ? 'auto' : 'cursor-pointer'
  }`;

  const intentClass =
    intent === 'DANGER'
      ? 'bg-red-500 hover:bg-red-400 text-white'
      : intent === 'PRIMARY'
      ? 'bg-primary-blue text-white hover:bg-soft-primary-blue hover:text-black'
      : '';

  const availableClasses = classNames(baseClass, intentClass);
  const disabledClasses = classNames(baseClass + 'bg-gray-300 text-gray-400 cursor-not-allowed');

  const endClass = disabled ? disabledClasses : !loading ? availableClasses : disabledClasses;

  return (
    <div className="has-tooltip group">
      {tooltip && <span className="tooltip rounded shadow-lg p-1 bg-gray-100 relative right-16">{tooltip}</span>}
      <button
        className={classNames(endClass, className)}
        type={submit ? 'submit' : 'button'}
        onClick={onClick}
        disabled={disabled}
        data-testid={testId ? `form-input-button-${testId}` : 'form-input-button'}
      >
        <span>{text}</span>
        {icon && <FontAwesomeIcon icon={icon} className={text ? 'ml-2' : ''} />}
        {loading && <LoadingSpinner />}
      </button>
    </div>
  );
};
