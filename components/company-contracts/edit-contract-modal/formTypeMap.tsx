import { TextInput , Select , DateInput } from 'components/core-ui-lib';
import { noop } from 'utils';

const BooleanInput = () => {
  return (
    <Select
      className="w-32"
      options={[
        { text: 'Yes', value: true },
        { text: 'No', value: false },
      ]}
      onChange={noop}
    />
  );
};

const formTypeMap = {
  Number: (_props: { value: string }) => <TextInput />,
  String: (_props: { value: string }) => <TextInput />,
  Boolean: (_props: { value: string }) => <BooleanInput />,
  Date: (_props: { value: string }) => <DateInput onChange={noop} />,
};

export default formTypeMap;
