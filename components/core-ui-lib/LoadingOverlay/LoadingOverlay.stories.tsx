import type { Meta, StoryObj } from '@storybook/react';
import LoadingOverlay from './LoadingOverlay';

const meta: Meta<typeof LoadingOverlay> = {
  component: LoadingOverlay,
};

export default meta;
type Story = StoryObj<typeof LoadingOverlay>;

const Template = (spinner: boolean) => {
  // return a modal with a placeholder image
  return (
    <div>
      <img
        className="fixed top-0 right-0"
        src="/storybook-assets/max-chen-lud4OaUCP4Q-unsplash.jpg"
        alt="placholder background image"
      />
      <LoadingOverlay spinner={spinner} />
    </div>
  );
};

export const SpinnerVersion: Story = Template.bind({ args: { spinner: true } });

export const LoaderVersion: Story = Template.bind({ args: { spinner: false } });
