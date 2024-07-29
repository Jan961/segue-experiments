import TextInput from 'components/core-ui-lib/TextInput';

interface FormFieldProps {
  currentValue: string;
  displayText: string;
  fieldName: string;
  required?: boolean;
  handleInputChange: (field: string, value: string) => void;
  onBlur: () => void;
}

export const FormField = ({
  currentValue,
  displayText,
  fieldName,
  required = false,
  handleInputChange,
  onBlur,
}: FormFieldProps) => {
  return (
    <label htmlFor="" className="grid w-full">
      <div className="flex gap-x-1">
        <p className="text-primary-input-text">{displayText}</p>
        {required && <p className="text-red-600">*</p>}
      </div>
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
