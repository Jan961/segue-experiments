import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

interface FormButtonSubmitProps {
  loading?: boolean;
  disabled?: boolean;
  text: string;
  onClick?: (e: any) => void;
  submit?: boolean;
  intent?: undefined | 'DANGER';
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

export const FormButtonSubmit = ({
  loading,
  disabled,
  text,
  onClick,
  submit = true,
  intent,
}: FormButtonSubmitProps) => {
  const baseClasses = 'text-white rounded shadow outline text-sm px-6 py-3 font-bold cursor-pointer';
  const intentClasses =
    intent === 'DANGER' ? 'bg-red-500 hover:bg-red-400 active:bg-red-600' : ' bg-emerald-500 hover:bg-emerald-400';
  const disabledClasses = classNames(baseClasses, 'bg-gray-300 cursor-not-allowed');
  const availableClasses = classNames(baseClasses, intentClasses);

  const className = disabled || loading ? disabledClasses : availableClasses;

  return (
    <div className="text-right">
      <button className={className} type={submit ? 'submit' : 'button'} onClick={onClick} disabled={disabled}>
        {text}
        {loading && <LoadingSpinner />}
      </button>
    </div>
  );
};
