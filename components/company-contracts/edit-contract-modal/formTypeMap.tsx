import { useState } from 'react';
import { TextInput, Select, DateInput } from 'components/core-ui-lib';

interface BooleanInputProps {
  value: string;
  onChange: (value: any) => void;
}

const BooleanInput = ({ value, onChange }: BooleanInputProps) => {
  return (
    <Select
      className="w-32"
      options={[
        { text: 'Yes', value: true },
        { text: 'No', value: false },
      ]}
      onChange={(value) => onChange(value)}
      value={value}
    />
  );
};

interface FormInputProps {
  value: string;
  handleChange: (newValue: any) => void;
}

const formTypeMap = {
  Number: ({ value, handleChange }: FormInputProps) => (
    <TextInput value={value} onChange={(e) => handleChange(e.target.value)} />
  ),
  String: ({ value, handleChange }: FormInputProps) => (
    <TextInput value={value} onChange={(e) => handleChange(e.target.value)} />
  ),
  Boolean: ({ value, handleChange }: FormInputProps) => (
    <BooleanInput value={value} onChange={(value) => handleChange(value)} />
  ),
  Date: ({ value, handleChange }: FormInputProps) => (
    <DateInput value={value} onChange={(value) => handleChange(value)} />
  ),
};

interface FormInputGeneralProps {
  type: string;
  label: string;
  initialValue: string;
}

export const FormInputGeneral = ({ type, label, initialValue }: FormInputGeneralProps) => {
  const Component = formTypeMap[type];
  const [value, setValue] = useState(initialValue);

  if (!Component) return null;
  return (
    <div>
      <div className="w-52">{label}</div>
      <Component
        value={value}
        handleChange={(value) => {
          console.log('new value:', value);
          setValue(value);
        }}
      />
    </div>
  );
};
