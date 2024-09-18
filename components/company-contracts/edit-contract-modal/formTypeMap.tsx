import { ReactNode } from 'react';
import { TextInput, Select, DateInput } from 'components/core-ui-lib';
import { noop } from 'utils';

const BooleanInput = ({ value }: { value: string }) => {
  return (
    <Select
      className="w-32"
      options={[
        { text: 'Yes', value: true },
        { text: 'No', value: false },
      ]}
      onChange={noop}
      value={value}
    />
  );
};

const formTypeMap = {
  Number: ({ value }: { value: string }) => <TextInput value={value} />,
  String: ({ value }: { value: string }) => <TextInput value={value} />,
  Boolean: ({ value }: { value: string }) => <BooleanInput value={value} />,
  Date: ({ value }: { value: string }) => <DateInput onChange={noop} value={value} />,
};

export const createFormInput = (type: string, label: string, value: string): ReactNode => {
  const Component = formTypeMap[type];
  if (!Component) return null;
  return (
    <div>
      <div className="w-52">{label}</div>
      <Component value={value} />
    </div>
  );
};
