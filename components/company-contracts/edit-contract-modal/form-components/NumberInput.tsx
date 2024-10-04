import GeneralFormInputProps from './interface';
import { TextInput } from 'components/core-ui-lib';

const NumberInput = ({ value, handleChange }: GeneralFormInputProps) => {
  return <TextInput value={value} onChange={(e) => handleChange(e.target.value)} />;
};

export default NumberInput;
