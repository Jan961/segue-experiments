import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames';

interface FormInputButtonProps {
  loading?: boolean;
  disabled?: boolean;
  text: string;
  onClick?: (e: any) => void
  submit?: boolean;
  className?: string;
}

const LoadingSpinner = () => {
  return (
    <div className="inline-block ml-2 -my-2">
      <div className="animate-spin">
        <FontAwesomeIcon icon='spinner' size='xl'/>
      </div>
    </div>
  )
}

// Larger button for submitting forms. Green in color
export const FormInputButton = ({ loading, disabled, text, onClick, submit, className }: FormInputButtonProps) => {
  let baseClass = 'rounded shadow text-sm px-3 py-2 cursor-pointer border '
  const availableClasses = baseClass + ' border-gray-200 bg-gray-200 hover:bg-gray-100 active:bg-blue-600 ease-linear transition-all duration-150 '
  const loadingClasses = baseClass + ' bg-gray-500'
  const disabledClasses = baseClass + ' opacity-50'

  baseClass = disabled ? disabledClasses : !loading ? availableClasses : loadingClasses

  return (
    <button
      className={classNames(className, baseClass)}
      type={ submit ? 'submit' : 'button'}
      onClick={onClick}
      disabled={disabled}>
      { text }
      { loading && (<LoadingSpinner />)}
    </button>
  )
}
