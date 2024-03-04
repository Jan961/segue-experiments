import { AgGridReact } from 'ag-grid-react';
import GridStyles from './gridStyles';
import { GridApi, GridReadyEvent, RowHeightParams } from 'ag-grid-community';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
// import TableTooltip from './TableTooltip';

export type StyleProps = {
  headerColor?: string;
};

interface TableProps {
  rowData?: any[];
  columnDefs?: any[];
  styleProps?: StyleProps;
  onCellClicked?: (e) => void;
  onRowClicked?: (e) => void;
  onRowSelected?: (e) => void;
  gridOptions?: any;
  displayHeader?: boolean;
  getRowStyle?: any;
  rowClassRules?: any;
  getRowHeight?: (params: RowHeightParams) => number;
}

const ROW_HEIGHT = 43;
const HEADER_HEIGHT = 51;
const DELTA = 250; // Set as const for now. We may look to accept it as a prop if necessary

export default forwardRef(function Table(
  {
    rowData,
    columnDefs,
    styleProps,
    onCellClicked,
    onRowClicked,
    gridOptions,
    getRowStyle,

    rowClassRules,
    displayHeader = true,
    getRowHeight,
    onRowSelected = () => null,
  }: TableProps,
  ref,
) {
  const [gridApi, setGridApi] = useState<GridApi | undefined>();
  const [autoHeightLimit, setAutoHeightLimit] = useState<number>(400);
  const isDirty = useRef(false);
  useImperativeHandle(ref, () => ({
    getApi: () => gridApi,
    isDirty: () => isDirty.current,
  }));

  const gridHeight = useMemo(() => {
    if (rowData?.length > 0) {
      return HEADER_HEIGHT + rowData.length * ROW_HEIGHT;
    }
    return HEADER_HEIGHT;
  }, [rowData]);

  const handleCellValueChange = () => {
    isDirty.current = true;
  };

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    if (rowData?.length > 0) {
      gridHeight < autoHeightLimit && params.api
        ? params.api.updateGridOptions({ domLayout: 'autoHeight' })
        : params.api.updateGridOptions({ domLayout: 'normal' });
    }

    const columnDefs = params.api.getColumnDefs();
    const updColDefs = columnDefs.map((column) => {
      return { ...column, headerClass: 'text-center' };
    });
    params.api.updateGridOptions({ columnDefs: updColDefs });
  };

  useEffect(() => {
    if (rowData?.length > 0 && gridApi) {
      gridHeight < autoHeightLimit && gridApi
        ? gridApi.updateGridOptions({ domLayout: 'autoHeight' })
        : gridApi.updateGridOptions({ domLayout: 'normal' });
    }
  }, [rowData, gridApi, autoHeightLimit, gridHeight]);

  useEffect(() => {
    setAutoHeightLimit(window.innerHeight - DELTA);
    const handleResize = () => {
      setAutoHeightLimit(window.innerHeight - DELTA);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <GridStyles {...styleProps} />
      <div
        className="ag-theme-quartz"
        style={{
          height: !rowData?.length ? '100%' : gridHeight > autoHeightLimit ? `${autoHeightLimit}px` : '',
        }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          headerHeight={displayHeader ? HEADER_HEIGHT : 0}
          rowHeight={ROW_HEIGHT}
          onCellClicked={onCellClicked}
          onRowClicked={onRowClicked}
          onRowSelected={onRowSelected}
          onCellValueChanged={handleCellValueChange}
          onGridReady={onGridReady}
          getRowStyle={getRowStyle}
          rowClassRules={rowClassRules}
          tooltipHideDelay={5000}
          tooltipShowDelay={0}
          gridOptions={gridOptions}
          getRowHeight={getRowHeight}
        />
      </div>
    </>
  );
});
