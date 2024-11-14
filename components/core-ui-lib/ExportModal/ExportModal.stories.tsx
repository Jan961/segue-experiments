import type { Meta, StoryObj } from '@storybook/react';
import ExportModal from './ExportModal';
import { useState } from 'react';

export default {
  component: ExportModal,
} as Meta<typeof ExportModal>;

type Story = StoryObj<typeof ExportModal>;

const excelIcon = {
  iconName: 'excel',
  iconProps: { fill: 'green' },
};

const pdfIcon = {
  iconName: 'document-solid',
  iconProps: { fill: 'red' },
};

const exportList = [
  { key: 'Excel', iconName: excelIcon.iconName, iconProps: excelIcon.iconProps },
  { key: 'PDF', iconName: pdfIcon.iconName, iconProps: pdfIcon.iconProps },
];

const Template = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleClose = () => {
    setIsOpen(!isOpen);
  };

  // return a modal with a placeholder image
  return (
    <div className="w-[800px] h-vh bg-primary-dark-blue text-primary-white">
      <ExportModal visible={true} onClose={handleClose} ExportList={exportList} />
    </div>
  );
};

export const Default: Story = Template.bind({});
