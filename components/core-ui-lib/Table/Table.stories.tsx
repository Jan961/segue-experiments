import type { Meta, StoryObj } from '@storybook/react';
import 'ag-grid-community/styles/ag-grid.css'; // Core CSS
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Theme
import Table from './Table';

const rows = [
  { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
  { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
  { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
];

const cols = [{ field: 'make' }, { field: 'model' }, { field: 'price' }, { field: 'electric' }];

// const sections = ['#41A29A', '#EC6255', '#FDCE74'];

const meta: Meta<typeof Table> = {
  component: Table,
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof Table>;

export const Example: Story = {
  render: () => {
    return (
      <div className="w-[800px] h-44">
        <Table columnDefs={cols} rowData={rows} styleProps={{ headerColor: '#41A29A' }} />
      </div>
    );
  },
};

export const GridExample = () => {
  return (
    <div className="w-screen h-screen">
      <Table columnDefs={cols} rowData={rows} />
    </div>
  );
};
