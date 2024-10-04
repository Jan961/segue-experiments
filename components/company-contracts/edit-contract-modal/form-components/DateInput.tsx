import GeneralFormInputProps from './interface';
import { DateInput as CoreDateInput } from 'components/core-ui-lib';

const DateInput = ({ value, handleChange }: GeneralFormInputProps) => {
  return (
    <CoreDateInput
      value={value}
      onChange={(value) => {
        handleChange(value);
      }}
      disabled={false}
    />
  );
};

export default DateInput;
