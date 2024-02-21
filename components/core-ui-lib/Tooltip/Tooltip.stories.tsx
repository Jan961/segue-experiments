import type { Meta, StoryObj } from '@storybook/react';

import Tooltip, { TooltipProps } from './Tooltip';
import Button from 'components/core-ui-lib/Button';

const meta: Meta<typeof Tooltip> = {
    component: Tooltip,
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Btn_Tooltip_Top: Story = (args: TooltipProps) => (
    <Tooltip {...args}>
        <Button
            text="Sample Button"
            className="w-[155px]"
            onClick={() => alert('I am a test storybook button')}>
        </Button>
    </Tooltip>
);

Btn_Tooltip_Top.args = {
    body: 'Tooltip displayed at the top of the item',
    position: 'top',
    height: 'h-auto',
    width: 'w-auto',
    bgColorClass: 'primary-navy',
    txtColorClass: 'text-white',
};

export const Btn_Tooltip_Bottom: Story = (args: TooltipProps) => (
    <Tooltip {...args}>
        <Button
            text="Sample Button"
            className="w-[155px]"
            onClick={() => alert('I am a test storybook button')}>
        </Button>
    </Tooltip>
);

Btn_Tooltip_Bottom.args = {
    body: 'Tooltip displayed at the top of the item',
    position: 'bottom',
    height: 'h-auto',
    width: 'w-auto',
    bgColorClass: 'primary-navy',
    txtColorClass: 'text-white',
};

export const Btn_Tooltip_Left: Story = (args: TooltipProps) => (
    <Tooltip {...args}>
        <Button
            text="Sample Button"
            className="w-[200px]"
            onClick={() => alert('I am a test storybook button')}>
        </Button>
    </Tooltip>
);

Btn_Tooltip_Left.args = {
    body: 'Tooltip displayed at the top of the item',
    position: 'left',
    height: 'h-auto',
    width: 'w-auto',
    bgColorClass: 'primary-navy',
    txtColorClass: 'text-white',
};


export const Btn_Tooltip_Right: Story = (args: TooltipProps) => (
    <Tooltip {...args}>
        <Button
            text="Sample Button"
            className="w-[155px]"
            onClick={() => alert('I am a test storybook button')}>
        </Button>
    </Tooltip>
);

Btn_Tooltip_Right.args = {
    body: 'Tooltip displayed at the top of the item',
    position: 'right',
    height: 'h-auto',
    width: 'w-auto',
    bgColorClass: 'primary-navy',
    txtColorClass: 'text-white',
};

export const Txt_Tooltip_DefaultPos: Story = (args: TooltipProps) => (
    <Tooltip {...args}>
        <div className='text text-center text-primary-navy font-bold text-xl'>
            Hover over me to see a tooltip
        </div>
    </Tooltip>
);

Txt_Tooltip_DefaultPos.args = {
    body: 'Tooltip displayed at the top of the item',
    height: 'h-auto',
    width: 'w-auto',
    bgColorClass: 'primary-navy',
    txtColorClass: 'text-white',
};

export const Txt_Tooltip_Custom_Size_Colour: Story = (args: TooltipProps) => (
    <Tooltip {...args}>
        <div className='text-primary-blue font-bold text-xl'>
            Hover over me to see a tooltip
        </div>
    </Tooltip>
);

Txt_Tooltip_Custom_Size_Colour.args = {
    body: 'Tooltip displayed at the top of the item',
    height: 'h-24',
    width: 'w-32',
    bgColorClass: 'primary-blue',
    txtColorClass: 'text-white',
};

export const Txt_Tooltip_With_Title: Story = (args: TooltipProps) => (
    <Tooltip {...args}>
        <div className='text-primary-blue font-bold text-xl'>
            Hover over me to see a tooltip
        </div>
    </Tooltip>
);

Txt_Tooltip_With_Title.args = {
    body: 'Tooltip displayed at the top of the item',
    title: 'Tooltip Title',
    bgColorClass: 'primary-blue',
    txtColorClass: 'text-white',
};

