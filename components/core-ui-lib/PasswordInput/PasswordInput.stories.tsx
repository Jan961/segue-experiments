import type { Meta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';

import TextInput from './PasswordInput';

const meta: Meta<typeof TextInput> = {
  component: TextInput,
  argTypes: {
    iconName: { control: { type: 'text' } },
    className: { control: { type: 'text' } },
  },
};

export default meta;

export const Input = () => {
  const [{ value }, updateArgs] = useArgs<{ value: string }>();
  return <TextInput value={value} onChange={(e) => updateArgs({ value: e.target.value })} />;
};

export const Disabled = () => {
  return <TextInput disabled value="I am disabled" />;
};
