import type { Meta, StoryObj } from '@storybook/react';
import ImagePreviewModal from './ImagePreviewModal';

export default {
  component: ImagePreviewModal,
} as Meta<typeof ImagePreviewModal>;

type Story = StoryObj<typeof ImagePreviewModal>;

const Template = () => {
  // return a modal with a placeholder image
  return (
    <div className="p-4 w-[300px] h-[300px]">
      <ImagePreviewModal
        show={true}
        onClose={() => null}
        imageUrl="/storybook-assets/max-chen-lud4OaUCP4Q-unsplash.jpg"
        altText="Image preview"
      />
    </div>
  );
};

export const Default: Story = Template.bind({});
