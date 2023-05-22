import { dateService } from "services/dateService";

interface Input {
  onChange: (e: any) => void;
  label?: string;
  value: string | Date;
  name?: string; // Also ID
  required?: boolean;
}

export const FormInputDate = ({ onChange, value, name, label, required }: Input) => {
  const stringValue = dateService.dateToPicker(value)

  return (
    <div>
      <label htmlFor={name}>{ label }
        <input id={name}
          type="date"
          name={name}
          onChange={onChange}
          required={required}
          value={stringValue}
          className="w-full block rounded border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-4"
          contentEditable={false}
        />
      </label>
    </div>
  )
}
