// import React from 'react';
// import { render, waitFor } from '@testing-library/react';
// import Table from './Table';

// describe('Table Component', () => {
//   const rowData = [{ id: 1, name: 'John' }, { id: 2, name: 'Doe' }];
//   const columnDefs = [{ headerName: 'ID', field: 'id' }, { headerName: 'Name', field: 'name' }];
//   const styleProps = { headerColor: 'red' };

//   test('renders table with provided data and style', async () => {
//     const { getByText, container } = render(
//       <Table rowData={rowData} columnDefs={columnDefs} styleProps={styleProps} />
//     );

//     // Wait for table to be rendered
//     await waitFor(() => {
//       const idHeader = getByText('ID');
//       const johnRow = getByText('John');
//       const doeRow = getByText('Doe');

//       // Check if table elements are rendered correctly
//       expect(idHeader).toBeInTheDocument();
//       expect(johnRow).toBeInTheDocument();
//       expect(doeRow).toBeInTheDocument();

//       // Check if style is applied
//       const headerElement = container.querySelector('.ag-header');
//       expect(headerElement).toHaveStyle('color: red');
//     });
//   });

//   // Add more tests as needed...
// });
