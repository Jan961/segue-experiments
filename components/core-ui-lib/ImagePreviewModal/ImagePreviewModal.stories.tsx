import type { Meta, StoryObj } from '@storybook/react';
import ImagePreviewModal from './ImagePreviewModal';

import { useState } from 'react';

export default {
  title: 'Components/ImagePreviewModal',
  component: ImagePreviewModal,
} as Meta<typeof ImagePreviewModal>;

type Story = StoryObj<typeof ImagePreviewModal>;

const Template = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleModalClose = () => {
    setIsOpen(!isOpen);
  };

  // return a modal with a placeholder image
  return (
    <div className="p-4">
      <ImagePreviewModal
        show={isOpen}
        onClose={handleModalClose}
        imageUrl="https://via.placeholder.com/150"
        altText="Image preview"
      />
    </div>
  );
};

export const Default: Story = Template.bind({});
