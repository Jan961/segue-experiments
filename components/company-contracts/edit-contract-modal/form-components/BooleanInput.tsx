import GeneralFormInputProps from './interface';
import { Select } from 'components/core-ui-lib';

const BooleanInput = ({ value, handleChange }: GeneralFormInputProps) => {
  return (
    <Select
      className="w-32"
      options={[
        { text: 'Yes', value: true },
        { text: 'No', value: false },
      ]}
      onChange={(value) => handleChange(value)}
      value={value}
    />
  );
};

export default BooleanInput;
