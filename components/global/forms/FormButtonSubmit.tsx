import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface FormButtonSubmitProps {
  loading: boolean;
  disabled: boolean;
  text: string;
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

export const FormButtonSubmit = ({ loading, disabled, text }: FormButtonSubmitProps) => {
  const baseClasses = 'text-white rounded shadow outline text-sm px-6 py-3 font-bold cursor-pointer'
  const availableClasses = baseClasses + ' hover:shadow-lg bg-emerald-500 active:bg-emerald-600 ease-linear transition-all duration-150 '
  const loadingClasses = baseClasses + ' bg-gray-500'
  const disabledClasses = baseClasses + ' bg-gray-300'

  const className = disabled ? disabledClasses : !loading ? availableClasses : loadingClasses

  return (
    <div className="text-right">
      <button
        className={className}
        type="submit"
        disabled={disabled}>
        { text }
        { loading && (<LoadingSpinner />)}
      </button>
    </div>
  )
}
