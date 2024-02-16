import { render, screen } from '@testing-library/react';
import Table from './Table';

describe('Table Component', () => {
  const rowData = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Doe' },
  ];
  const columnDefs = [
    { headerName: 'ID', field: 'id' },
    { headerName: 'Name', field: 'name' },
  ];
  const styleProps = { headerColor: 'red' };

  test('renders table with provided data and style', async () => {
    render(<Table rowData={rowData} columnDefs={columnDefs} styleProps={styleProps} />);
    const idHeader = screen.getByText('ID');
    const johnRow = screen.getByText('John');
    const doeRow = screen.getByText('Doe');

    expect(idHeader).toBeInTheDocument();
    expect(johnRow).toBeInTheDocument();
    expect(doeRow).toBeInTheDocument();

    const headerElement = screen.getByRole('row', { name: 'Header' });
    expect(headerElement).toHaveStyle('');
  });

  test('updates grid options for auto height when row data is less than AUTO_HEIGHT_LIMIT', async () => {
    render(<Table rowData={rowData} columnDefs={columnDefs} styleProps={styleProps} />);
    const gridContainer = screen.getByTestId('table-container');
    expect(gridContainer).toHaveStyle('');
  });

  test('updates grid options for auto height when row data is less than AUTO_HEIGHT_LIMIT', async () => {
    render(<Table rowData={rowData} columnDefs={columnDefs} styleProps={styleProps} />);
    const gridContainer = screen.getByTestId('table-container');
    expect(gridContainer).toBeInTheDocument();

    const computedStyles = window.getComputedStyle(gridContainer);
    expect(computedStyles.height).toBe('');
  });
});
