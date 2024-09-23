import GeneralFormInputProps from './interface';
import { Select } from 'components/core-ui-lib';

const BooleanInput = ({ value, handleChange }: GeneralFormInputProps) => {
  return (
    <Select
      className="w-32"
      options={[
        { text: 'Yes', value: 'true' },
        { text: 'No', value: 'false' },
      ]}
      onChange={(selectedValue) => {
        if (selectedValue === 'true') {
          handleChange(true);
        } else if (selectedValue === 'false') {
          handleChange(false);
        } else {
          handleChange(null);
        }
      }}
      value={value === true ? 'true' : value === false ? 'false' : ''}
    />
  );
};

export default BooleanInput;
