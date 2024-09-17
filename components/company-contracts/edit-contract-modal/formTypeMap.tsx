import { TextInput } from 'components/core-ui-lib';
// import { Select } from "components/core-ui-lib";

// const BooleanInput = () => {

// }

const formTypeMap = {
  Number: (props: { label: string; value: string }) => (
    <div>
      {props.label}
      <TextInput />
    </div>
  ),
  String: (props: { label: string; value: string }) => (
    <div>
      {props.label}
      <TextInput />
    </div>
  ),
  Boolean: (props: { label: string; value: string }) => <div>{props.label}Boolean Input</div>,
};

export default formTypeMap;
