import type { Meta, StoryObj } from '@storybook/react';

import Tooltip, { TooltipProps } from './Tooltip';
import Button from 'components/core-ui-lib/Button';

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const btnTooltipTop: Story = (args: TooltipProps) => (
  <Tooltip {...args}>
    <Button text="Sample Button" className="w-[155px]" onClick={() => alert('I am a test storybook button')} />
  </Tooltip>
);

btnTooltipTop.args = {
  body: 'Tooltip displayed at the top of the item',
  position: 'top',
  height: 'h-auto',
  width: 'w-auto',
  bgColorClass: 'primary-navy',
  txtColorClass: 'text-white',
};

export const btntooltipBottom: Story = (args: TooltipProps) => (
  <Tooltip {...args}>
    <Button text="Sample Button" className="w-[155px]" onClick={() => alert('I am a test storybook button')} />
  </Tooltip>
);

btntooltipBottom.args = {
  body: 'Tooltip displayed at the bottom of the item',
  position: 'bottom',
  height: 'h-auto',
  width: 'w-auto',
  bgColorClass: 'primary-navy',
  txtColorClass: 'text-white',
};

export const btnTooltipLeft: Story = (args: TooltipProps) => (
  <Tooltip {...args}>
    <Button text="Sample Button" className="w-[200px]" onClick={() => alert('I am a test storybook button')} />
  </Tooltip>
);

btnTooltipLeft.args = {
  body: 'Tooltip displayed at the left hand side of the item',
  position: 'left',
  height: 'h-auto',
  width: 'w-auto',
  bgColorClass: 'primary-navy',
  txtColorClass: 'text-white',
};

export const btnTooltipRight: Story = (args: TooltipProps) => (
  <Tooltip {...args}>
    <Button text="Sample Button" className="w-[155px]" onClick={() => alert('I am a test storybook button')} />
  </Tooltip>
);

btnTooltipRight.args = {
  body: 'Tooltip displayed at the right hand side of the item',
  position: 'right',
  height: 'h-auto',
  width: 'w-auto',
  bgColorClass: 'primary-navy',
  txtColorClass: 'text-white',
};

export const txtTooltipDefaultPos: Story = (args: TooltipProps) => (
  <Tooltip {...args}>
    <div className="text text-center text-primary-navy font-bold text-xl">Hover over me to see a tooltip</div>
  </Tooltip>
);

txtTooltipDefaultPos.args = {
  body: 'Tooltip displayed at the top (default side) of the item',
  height: 'h-auto',
  width: 'w-auto',
  bgColorClass: 'primary-navy',
  txtColorClass: 'text-white',
};

export const txtTooltipCustomSizeColour: Story = (args: TooltipProps) => (
  <Tooltip {...args}>
    <div className="text-primary-blue font-bold text-xl">Hover over me to see a tooltip</div>
  </Tooltip>
);

txtTooltipCustomSizeColour.args = {
  body: 'Tooltip displayed at the top (default side) of the item',
  height: 'h-24',
  width: 'w-32',
  bgColorClass: 'primary-blue',
  txtColorClass: 'text-white',
};

export const txtTooltipWithTitle: Story = (args: TooltipProps) => (
  <Tooltip {...args}>
    <div className="text-primary-blue font-bold text-xl">Hover over me to see a tooltip</div>
  </Tooltip>
);

txtTooltipWithTitle.args = {
  body: 'Tooltip displayed at the top (default side) of the item',
  title: 'Tooltip Title',
  bgColorClass: 'primary-blue',
  txtColorClass: 'text-white',
};

export const manualToogle: Story = (args: TooltipProps) => (
  <Tooltip {...args}>
    <div className="text-primary-blue font-bold text-xl">
      Change the manualToogle prop from true/false in control to
      <br />
      toogle the tooltip in and out of view. This is used when an external <br />
      function controls the visibility of the tooltip.
    </div>
  </Tooltip>
);

manualToogle.args = {
  body: 'Tooltip displayed at the top (default side) of the item',
  title: 'Tooltip Title',
  bgColorClass: 'primary-blue',
  txtColorClass: 'text-white',
  useManualToggle: true,
  manualToggle: true,
};
