import TextInput from 'components/core-ui-lib/TextInput';

interface FormFieldProps {
  currentValue: string;
  displayText: string;
  fieldName: string;
  required?: boolean;
  validationCheck?: string;
  handleInputChange: (field: string, value: string) => void;
  onBlur: () => void;
}

export const FormField = ({
  currentValue,
  displayText,
  fieldName,
  required = false,
  validationCheck,
  handleInputChange,
  onBlur,
}: FormFieldProps) => {
  return (
    <label htmlFor="" className="grid w-full">
      <div className="flex gap-x-1">
        <p className="text-primary-input-text">{displayText}</p>
        {required && <p className="text-primary-red">*</p>}
        {validationCheck && <small className="text-primary-red self-center">{validationCheck}</small>}
      </div>
      <TextInput
        testId="company-info-input"
        placeholder={`Enter ${displayText}`}
        className="w-full justify-between"
        inputClassName="w-full"
        value={currentValue}
        onChange={(e) => handleInputChange(fieldName, e.target.value)}
        onBlur={async () => {
          await onBlur();
        }}
        error={validationCheck && 'true'}
      />
    </label>
  );
};
