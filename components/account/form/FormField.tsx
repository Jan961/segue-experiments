import TextInput from 'components/core-ui-lib/TextInput';
import { Label } from 'components/core-ui-lib';
import FormError from 'components/core-ui-lib/FormError';

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
        <div className="flex">
          <Label required={required} text={displayText} variant="md" />
          <FormError error={validationCheck} className="mt-1 ml-1" />
        </div>
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
