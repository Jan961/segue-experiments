import type { Meta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';

import TextArea from './TextArea';

const meta: Meta<typeof TextArea> = {
  component: TextArea,
  argTypes: {
    className: { control: { type: 'text' } },
  },
};

export default meta;

export const Input = () => {
  const [{ value }, updateArgs] = useArgs();
  return <TextArea value={value} onChange={(e) => updateArgs(e.target.value)} />;
};
