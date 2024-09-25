import GeneralFormInputProps from './interface';
import { DateInput as CoreDateInput } from 'components/core-ui-lib';
import { dateToSimple } from 'services/dateService';

const DateInput = ({ value, handleChange }: GeneralFormInputProps) => {
  return (
    <CoreDateInput
      value={value}
      onChange={(value) => {
        handleChange(dateToSimple(value));
      }}
      disabled={false}
    />
  );
};

export default DateInput;
