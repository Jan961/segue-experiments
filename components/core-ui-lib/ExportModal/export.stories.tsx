import type { Meta, StoryObj } from '@storybook/react';
import ExportModal from './ExportModal';

const meta: Meta<typeof ExportModal> = {
  component: ExportModal,
  title: 'Components/ExportModal',
  argTypes: {},
};

export default meta;
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

export const Example: Story = {
  render: () => {
    return (
      <div className="w-[800px] h-vh bg-primary-dark-blue text-primary-white">
        <ExportModal
          visible={true}
          onClose={() => console.log('Close modal')}
          ExportList={exportList}
          tableRef="yourTableRef"
        />
      </div>
    );
  },
};
