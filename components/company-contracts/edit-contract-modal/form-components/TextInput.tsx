import GeneralFormInputProps from './interface';
import { TextInput as CoreUITextInput } from 'components/core-ui-lib';

const TextInput = ({ value, handleChange }: GeneralFormInputProps) => {
  return <CoreUITextInput value={value} onChange={(e) => handleChange(e.target.value)} />;
};

export default TextInput;
