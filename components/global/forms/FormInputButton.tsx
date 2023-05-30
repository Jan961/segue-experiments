import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames';

interface FormInputButtonProps {
  loading?: boolean;
  disabled?: boolean;
  text: string;
  onClick?: (e: any) => void
  submit?: boolean;
  className?: string;
  intent?: undefined | 'DANGER'
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
export const FormInputButton = ({ loading, disabled, text, onClick, submit, className, intent }: FormInputButtonProps) => {
  let baseClass = 'rounded shadow text-sm px-3 py-2 cursor-pointer border '

  const intentClass = intent === 'DANGER' ? 'bg-red-500 hover:bg-red-400 border-red-500 text-white' : 'border-gray-200 bg-gray-200 hover:bg-gray-100'

  const availableClasses = classNames(baseClass, intentClass, 'active:bg-blue-600 ease-linear transition-all duration-150')
  const loadingClasses = classNames(availableClasses, 'bg-gray-500')
  const disabledClasses = classNames(availableClasses + 'opacity-50 cursor-not-allowed')

  baseClass = disabled ? disabledClasses : !loading ? availableClasses : loadingClasses

  return (
    <button
      className={classNames(baseClass, className)}
      type={ submit ? 'submit' : 'button'}
      onClick={onClick}
      disabled={disabled}>
      { text }
      { loading && (<LoadingSpinner />)}
    </button>
  )
}
