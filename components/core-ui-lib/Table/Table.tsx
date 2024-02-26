import { AgGridReact } from 'ag-grid-react';
import GridStyles from './gridStyles';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
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
  gridOptions?: any;
  displayHeader?: boolean;
  getRowStyle?: any;
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
    displayHeader = true,
  }: TableProps,
  ref,
) {
  const [gridApi, setGridApi] = useState<GridApi | undefined>();
  const [autoHeightLimit, setAutoHeightLimit] = useState<number>(400);
  useImperativeHandle(ref, () => ({
    getApi: () => gridApi,
  }));

  const gridHeight = useMemo(() => {
    if (rowData?.length > 0) {
      return HEADER_HEIGHT + rowData.length * ROW_HEIGHT;
    }
    return HEADER_HEIGHT;
  }, [rowData]);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    if (rowData?.length > 0) {
      gridHeight < autoHeightLimit && params.api
        ? params.api.updateGridOptions({ domLayout: 'autoHeight' })
        : params.api.updateGridOptions({ domLayout: 'normal' });
    }
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
          // defaultColDef={{
          //   tooltipComponent: TableTooltip,
          // }}
          rowData={rowData}
          columnDefs={columnDefs}
          headerHeight={displayHeader ? HEADER_HEIGHT : 0}
          rowHeight={ROW_HEIGHT}
          onCellClicked={onCellClicked}
          onRowClicked={onRowClicked}
          onGridReady={onGridReady}
          getRowStyle={getRowStyle}
          tooltipHideDelay={5000}
          tooltipShowDelay={0}
          gridOptions={gridOptions}
          reactiveCustomComponents
        />
      </div>
    </>
  );
});
