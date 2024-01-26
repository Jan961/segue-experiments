import type { Meta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';

import TextInput from './TextInput';

const meta: Meta<typeof TextInput> = {
  component: TextInput,
  argTypes: {
    iconName: { control: { type: 'text' } },
    className: { control: { type: 'text' } },
  },
};

export default meta;

export const Input = () => {
  const [{ value }, updateArgs] = useArgs();
  return <TextInput value={value} onChange={(e) => updateArgs(e.target.value)} />;
};

export const SearchInput = () => {
  const [{ value }, updateArgs] = useArgs();
  return <TextInput iconName="search" value={value} onChange={(e) => updateArgs(e.target.value)} />;
};
