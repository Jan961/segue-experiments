import TextInput from 'components/core-ui-lib/TextInput';

interface FormFieldProps {
  currentValue: string;
  displayText: string;
  fieldName: string;
  handleInputChange: (field: string, value: string) => void;
  onBlur: () => void;
}

export const FormField = ({ currentValue, displayText, fieldName, handleInputChange, onBlur }: FormFieldProps) => {
  return (
    <label htmlFor="" className="grid w-full">
      <p className="text-primary-input-text">{displayText}</p>
      <TextInput
        placeholder={`Enter ${displayText}`}
        className="w-full justify-between"
        inputClassName="w-full"
        value={currentValue}
        onChange={(e) => handleInputChange(fieldName, e.target.value)}
        onBlur={async () => {
          await onBlur();
        }}
      />
    </label>
  );
};
