
export interface SelectOption {
  text: string;
  value: string;
}

interface Input {
  placeholder?: string;
  onChange: (e: any) => void;
  label: string;
  value: string;
  name: string; // Also ID
  required?: boolean;
  options: SelectOption[]
}

export const FormInputSelect = ({ placeholder, onChange, value, name, label, required }: Input) => {
  return (
    <div>
      <label htmlFor={name} className="">{ label }
        <select
          id={name}
          name={name}
          onChange={onChange}
          className="w-full block rounded border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-4"
          required={required}
          value={value}
        >
          <option value="N">Normal</option>
          <option value="P">Pantomime</option>
        </select>
      </label>
    </div>
  )
}
