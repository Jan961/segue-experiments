import GeneralFormInputProps from './interface';
import { DateInput } from 'components/core-ui-lib';

const NumberInput = ({ value, handleChange }: GeneralFormInputProps) => {
  return <DateInput value={value} onChange={(value) => handleChange(value)} />;
};

export default NumberInput;
