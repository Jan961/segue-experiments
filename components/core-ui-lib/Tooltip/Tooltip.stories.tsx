import type { Meta, StoryObj } from '@storybook/react';

import Tooltip, { TooltipProps } from './Tooltip';
import Button from 'components/core-ui-lib/Button';

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const BtnTooltipTop: Story = (args: TooltipProps) => (
  <Tooltip {...args}>
    <Button text="Sample Button" className="w-[155px]" onClick={() => alert('I am a test storybook button')} />
  </Tooltip>
);

BtnTooltipTop.args = {
  body: 'Tooltip displayed at the top of the item',
  position: 'top',
  height: 'h-auto',
  width: 'w-auto',
  bgColorClass: 'primary-navy',
  txtColorClass: 'text-white',
};

export const BtntooltipBottom: Story = (args: TooltipProps) => (
  <Tooltip {...args}>
    <Button text="Sample Button" className="w-[155px]" onClick={() => alert('I am a test storybook button')} />
  </Tooltip>
);

BtntooltipBottom.args = {
  body: 'Tooltip displayed at the bottom of the item',
  position: 'bottom',
  height: 'h-auto',
  width: 'w-auto',
  bgColorClass: 'primary-navy',
  txtColorClass: 'text-white',
};

export const BtnTooltipLeft: Story = (args: TooltipProps) => (
  <Tooltip {...args}>
    <Button text="Sample Button" className="w-[200px]" onClick={() => alert('I am a test storybook button')} />
  </Tooltip>
);

BtnTooltipLeft.args = {
  body: 'Tooltip displayed at the left hand side of the item',
  position: 'left',
  height: 'h-auto',
  width: 'w-auto',
  bgColorClass: 'primary-navy',
  txtColorClass: 'text-white',
};

export const BtnTooltipRight: Story = (args: TooltipProps) => (
  <Tooltip {...args}>
    <Button text="Sample Button" className="w-[155px]" onClick={() => alert('I am a test storybook button')} />
  </Tooltip>
);

BtnTooltipRight.args = {
  body: 'Tooltip displayed at the right hand side of the item',
  position: 'right',
  height: 'h-auto',
  width: 'w-auto',
  bgColorClass: 'primary-navy',
  txtColorClass: 'text-white',
};

export const TxtTooltipDefaultPos: Story = (args: TooltipProps) => (
  <Tooltip {...args}>
    <div className="text text-center text-primary-navy font-bold text-xl">Hover over me to see a tooltip</div>
  </Tooltip>
);

TxtTooltipDefaultPos.args = {
  body: 'Tooltip displayed at the top (default side) of the item',
  height: 'h-auto',
  width: 'w-auto',
  bgColorClass: 'primary-navy',
  txtColorClass: 'text-white',
};

export const TxtTooltipCustomSizeColour: Story = (args: TooltipProps) => (
  <Tooltip {...args}>
    <div className="text-primary-blue font-bold text-xl">Hover over me to see a tooltip</div>
  </Tooltip>
);

TxtTooltipCustomSizeColour.args = {
  body: 'Tooltip displayed at the top (default side) of the item',
  height: 'h-24',
  width: 'w-32',
  bgColorClass: 'primary-blue',
  txtColorClass: 'text-white',
};

export const TxtTooltipWithTitle: Story = (args: TooltipProps) => (
  <Tooltip {...args}>
    <div className="text-primary-blue font-bold text-xl">Hover over me to see a tooltip</div>
  </Tooltip>
);

TxtTooltipWithTitle.args = {
  body: 'Tooltip displayed at the top (default side) of the item',
  title: 'Tooltip Title',
  bgColorClass: 'primary-blue',
  txtColorClass: 'text-white',
};
