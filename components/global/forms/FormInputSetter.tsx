import { FormInputButton } from './FormInputButton'
import { FormInputText } from './FormInputText';

interface Input {
  placeholder?: string;
  onChange?: (e: any) => void;
  onClick: (e: any) => void;
  label?: string;
  value: string;
  name: string; // Also ID
  required?: boolean;
  disabled?: boolean
}

// With a button on the side
export const FormInputTextAttached = ({ placeholder, onChange, value, name, label, disabled, onClick }: Input) => {
  return (
    <div >
      <label htmlFor={name}>{ label }
        <div className="flex mb-4">
          <FormInputText disabled name={name} value={value} className="mb-0 rounded-r-none" />
          <FormInputButton disabled={disabled} text="Change" onClick={onClick} className="rounded-l-none" />
        </div>
      </label>
    </div>
  )
}
