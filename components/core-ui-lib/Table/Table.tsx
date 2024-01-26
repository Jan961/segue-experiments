import { AgGridReact } from 'ag-grid-react';
import GridStyles from './gridStyles';

export type StyleProps = {
  headerColor?: string;
};

interface TableProps {
  rowData?: any[];
  columnDefs?: any[];
  styleProps?: StyleProps;
}

export default function Table({ rowData, columnDefs, styleProps }: TableProps) {
  return (
    <>
      <GridStyles {...styleProps} />
      <div className="ag-theme-quartz h-full">
        <AgGridReact rowData={rowData} columnDefs={columnDefs} headerHeight={51} rowHeight={43} />
      </div>
    </>
  );
}
