import type { Meta, StoryObj } from '@storybook/react';
import UploadModal from './UploadModal';

const meta: Meta<typeof UploadModal> = {
  component: UploadModal,
  title: 'Components/UploadModal',
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof UploadModal>;

export const Example: Story = {
  render: () => {
    return (
      <UploadModal
        visible={true}
        title="Upload Files"
        info="Please select files to upload"
        isMultiple={true}
        maxFiles={3}
        maxFileSize={1024 * 1024}
        allowedFormats={['image/jpeg', 'image/png']}
        onClose={() => console.log('Close modal')}
        onChange={(files) => console.log('Files changed:', files)}
      />
    );
  },
};
