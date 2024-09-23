import { useState, useEffect } from 'react';
import { TextInput, BooleanInput, NumberInput, DateInput } from './form-components';

const formTypeMap = {
  Number: NumberInput,
  String: TextInput,
  Boolean: BooleanInput,
  Date: DateInput,
};

interface FormInputGeneralProps {
  type: string;
  label: string;
  initialValue: any;
  handleChange: (value: any) => void;
}

export const FormInputGeneral = ({ type, label, initialValue, handleChange }: FormInputGeneralProps) => {
  const Component = formTypeMap[type];
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (!Component) return null;
  return (
    <div>
      <div className="w-52">{label}</div>
      <Component
        value={value}
        handleChange={(value) => {
          handleChange(value);
          setValue(value);
        }}
      />
    </div>
  );
};
