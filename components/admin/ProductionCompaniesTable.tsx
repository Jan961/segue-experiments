import Table from 'components/core-ui-lib/Table';
import React from 'react';

interface ProductionCompaniesTableProps {
  onChange: (value: any) => void;
  onCellClicked: (value: any) => void;
  columnDefs: any[]; // Adjust the type according to your actual data structure
  rowData: any[]; // Adjust the type according to your actual data structure
  styleProps: Record<string, any>;
  getRowStyle: (value: any) => void; // Adjust the type according to your actual data structure
  getRowHeight: any;
}
const ProductionCompaniesTable: React.FC<ProductionCompaniesTableProps> = ({
  onChange,
  onCellClicked,
  columnDefs,
  rowData,
  styleProps,
  getRowStyle,
  getRowHeight,
}) => {
  return (
    <Table
      columnDefs={columnDefs}
      rowData={rowData}
      styleProps={styleProps}
      onCellClicked={onCellClicked}
      onCellValueChange={onChange}
      getRowStyle={getRowStyle}
      getRowHeight={getRowHeight}
    />
  );
};

export default ProductionCompaniesTable;
