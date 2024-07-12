import TextInput from '../../core-ui-lib/TextInput';

interface FormFieldProps {
  value: string;
  displayText: string;
  handleInputChange: (field: string, value: string) => void;
}

export const FormField = ({ value, displayText, handleInputChange }: FormFieldProps) => {
  return (
    <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
      <p className="text-primary-input-text">{displayText}</p>
      <TextInput
        placeholder={`Enter ${displayText}`}
        className="w-full justify-between"
        inputClassName="w-full"
        value={value}
        onChange={(e) => handleInputChange(value, e.target.value)}
      />
    </label>
  );
};
