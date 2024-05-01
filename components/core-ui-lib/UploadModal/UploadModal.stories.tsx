// Import React and necessary components
import React from 'react';
import { Meta, Story } from '@storybook/react';
import UploadModal from './UploadModal'; // Adjust the import path based on your structure
import { useArgs } from '@storybook/client-api';
import Button from '../Button';

// TypeScript type for Storybook Meta and Story
type UploadModalStory = Story<React.ComponentProps<typeof UploadModal>>;

// Default export with component, title, and parameters
export default {
  component: UploadModal,
  argTypes: {
    onClose: { action: 'closed' },
    onChange: { action: 'file selected' },
  },
} as Meta;

// Template for default state
const Template: UploadModalStory = (args) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, updateArgs] = useArgs();
  const openUploadModal = () => updateArgs({ visible: true });
  const onClose = () => updateArgs({ visible: false });
  return (
    <div>
      <Button onClick={openUploadModal} text="Upload Image" />
      <UploadModal {...args} onClose={onClose} />
    </div>
  );
};

// Default state with visible modal
export const Default = Template.bind({});
Default.args = {
  title: 'Upload Image',
  visible: false,
  info: 'Please upload an image file.',
  isMultiple: false,
  maxFiles: 1,
  maxFileSize: 5000000, // 5MB
  allowedFormats: ['image/jpeg', 'image/png'],
};

// Modal allowing multiple files
export const MultipleFiles = Template.bind({});
MultipleFiles.args = {
  ...Default.args,
  title: 'Upload Images',
  info: 'You can upload up to 5 images.',
  isMultiple: true,
  maxFiles: 5,
};

// Modal demonstrating error handling for file size
export const ErrorFileSize = Template.bind({});
ErrorFileSize.args = {
  ...Default.args,
  title: 'File Size Error',
  maxFileSize: 1024, // 1KB max file size to force error
};

// Modal limited to specific file formats
export const SpecificFormats = Template.bind({});
SpecificFormats.args = {
  ...Default.args,
  title: 'Upload Document',
  info: 'Only PDF and DOC files are allowed.',
  allowedFormats: ['application/pdf', 'application/msword'],
};

// Custom error and styling demonstration
export const CustomError = Template.bind({});
CustomError.args = {
  ...Default.args,
  title: 'Custom Error',
  info: 'An error occurred, please try again.',
};
