import Table from 'components/core-ui-lib/Table';
import React from 'react';

interface ProductionCompaniesTableProps {
  onChange: (value: any) => void;
  columnDefs: any[]; // Adjust the type according to your actual data structure
  rowData: any[]; // Adjust the type according to your actual data structure
  styleProps: Record<string, any>; // Adjust the type according to your actual data structure
}
const ProductionCompaniesTable: React.FC<ProductionCompaniesTableProps> = ({
  onChange,
  columnDefs,
  rowData,
  styleProps,
}) => {
  const onCellClicked = (e) => {
    const { column, rowIndex } = e;
    if (column.colId === 'delete') {
      console.log('delete column');
      console.log(rowIndex);
      if (rowData.length <= 1) {
        console.log('You cannot delete this row');
      }
    }
  };

  return (
    <Table
      columnDefs={columnDefs}
      rowData={rowData}
      styleProps={styleProps}
      onCellClicked={onCellClicked}
      onCellValueChange={onChange}
    />
  );
};

export default ProductionCompaniesTable;
