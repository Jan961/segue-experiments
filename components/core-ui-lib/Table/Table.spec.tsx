// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// // import '@testing-library/jest-dom/extend-expect'; // For using custom matchers

// import Table, { AUTO_HEIGHT_LIMIT, StyleProps } from './Table';

// const rowData = [
//     { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
//     { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
//     { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
//   ];

//   const columnDefs = [{ field: 'make' }, { field: 'model' }, { field: 'price' }, { field: 'electric' }];

// describe('Table Component', () => {
//   const styleProps: StyleProps = {
//     headerColor: 'red', // Example style prop
//   };

//   const onCellClicked = jest.fn();
//   const onRowClicked = jest.fn();

//   const customGridOptions = {
//     suppressCellSelection: true,
//     suppressRowClickSelection: true,
//   };

//   // test('renders table with provided data', () => {
//   //   render(<Table rowData={rowData} columnDefs={columnDefs} styleProps={styleProps} />);
//   //   const tableElement = screen.getByRole('grid');

//   //   // Check if the table element is rendered
//   //   expect(tableElement).toBeInTheDocument();

//   //   // Check if the header color style is applied
//   //   expect(tableElement).toHaveStyle('color: red');

//   //   // Check if all rows of data are rendered
//   //   rowData.forEach(row => {
//   //     const rowText = Object.values(row).join(' '); // Concatenate all row values
//   //     expect(screen.getByText(rowText)).toBeInTheDocument();
//   //   });
//   // });

//   // test('handles cell click event', () => {
//   //   render(<Table rowData={rowData} columnDefs={columnDefs} onCellClicked={onCellClicked} />);
//   //   const cellElement = screen.getByText('Tesla'); // Click on a cell with the text 'Tesla'
//   //   fireEvent.click(cellElement);
//   //   expect(onCellClicked).toHaveBeenCalled();
//   // });

//   // test('handles row click event', () => {
//   //   render(<Table rowData={rowData} columnDefs={columnDefs} onRowClicked={onRowClicked} />);
//   //   const rowElement = screen.getByText('Ford'); // Click on a row with the text 'Ford'
//   //   fireEvent.click(rowElement);
//   //   expect(onRowClicked).toHaveBeenCalled();
//   // });

//   // test('updates grid layout based on row data length', () => {
//   //   render(<Table rowData={rowData} columnDefs={columnDefs} />);
//   //   const gridElement = screen.getByRole('grid');

//   //   // Check if the default layout is applied
//   //   expect(gridElement).toHaveClass('ag-theme-quartz');

//   //   // Check if the grid layout is updated to autoHeight if the row data length is less than AUTO_HEIGHT_LIMIT
//   //   render(<Table rowData={[...rowData.slice(0, AUTO_HEIGHT_LIMIT - 1)]} columnDefs={columnDefs} />);
//   //   expect(gridElement).toHaveClass('ag-theme-quartz');
//   // });

//   // test('applies custom grid options', () => {
//   //   render(<Table rowData={rowData} columnDefs={columnDefs} gridOptions={customGridOptions} />);
//   //   const gridElement = screen.getByRole('grid');

//   //   // Check if the custom grid options are applied
//   //   expect(gridElement).toHaveAttribute('suppresscellselection', 'true');
//   //   expect(gridElement).toHaveAttribute('suppressrowclickselection', 'true');
//   // });
// });
