import { AgGridReact } from 'ag-grid-react';
import GridStyles from './gridStyles';
import {
  CellClickedEvent,
  CellValueChangedEvent,
  GridApi,
  GridReadyEvent,
  RowClickedEvent,
  RowDoubleClickedEvent,
  RowHeightParams,
  RowSelectedEvent,
  SelectionChangedEvent,
} from 'ag-grid-community';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import CustomTooltipRenderer from './renderers/CustomTooltipRenderer';
import Loader from '../Loader';

export type StyleProps = {
  headerColor?: string;
};

export interface TableProps {
  rowData?: any[];
  columnDefs?: any[];
  styleProps?: StyleProps;
  onCellClicked?: (e: CellClickedEvent) => void;
  onRowClicked?: (e: RowClickedEvent) => void;
  onRowSelected?: (e: RowSelectedEvent) => void;
  onRowDoubleClicked?: (e: RowDoubleClickedEvent) => void;
  onCellValueChange?: (e: CellValueChangedEvent) => void;
  gridOptions?: any;
  displayHeader?: boolean;
  getRowStyle?: any;
  rowClassRules?: any;
  headerHeight?: number;
  getRowHeight?: (params: RowHeightParams) => number;
  tableHeight?: number;
  excelStyles?: any[];
  rowSelection?: string;
  onSelectionChanged?: (event: SelectionChangedEvent) => void;
  testId?: string;
  marginBottom?: number;
}

const ROW_HEIGHT = 43;
const HEADER_HEIGHT = 51;

const DEFAULT_COLUMN_DEF = {
  wrapHeaderText: true,
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
  menuTabs: [],
  tooltipComponent: CustomTooltipRenderer,
};

export default forwardRef(function Table(
  {
    rowData,
    columnDefs,
    styleProps,
    onCellClicked,
    onRowClicked,
    onCellValueChange = () => null,
    gridOptions = {},
    getRowStyle,
    rowClassRules,
    displayHeader = true,
    getRowHeight,
    tableHeight = 0,
    headerHeight,
    onRowSelected = () => null,
    onRowDoubleClicked = () => null,
    excelStyles = [],
    rowSelection = 'single',
    onSelectionChanged,
    testId = 'core-ui-lib-table',
    marginBottom = 250,
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

  const handleCellValueChange = (e) => {
    isDirty.current = true;
    onCellValueChange(e);
  };

  const DEFAULT_GRID_OPTIONS = {
    rowSelection,
    autoSizeStrategy: {
      type: 'fitGridWidth',
      defaultMinWidth: 50,
    },
    stopEditingWhenCellsLoseFocus: true,
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
    } else if (rowData?.length === 0 && gridApi) {
      gridApi.updateGridOptions({ domLayout: 'autoHeight' });
    }
  }, [rowData, gridApi, autoHeightLimit, gridHeight]);

  useEffect(() => {
    setAutoHeightLimit(tableHeight === 0 ? window.innerHeight - marginBottom : tableHeight);
    const handleResize = () => {
      setAutoHeightLimit(tableHeight === 0 ? window.innerHeight - marginBottom : tableHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [tableHeight]);

  const gridHeaderHeight = headerHeight || HEADER_HEIGHT;

  return (
    <>
      <GridStyles {...styleProps} />
      <div
        className="ag-theme-quartz"
        data-testid={testId}
        style={{
          height: !rowData?.length ? '100%' : gridHeight > autoHeightLimit ? `${autoHeightLimit}px` : '',
        }}
      >
        <AgGridReact
          data-testid={testId}
          rowData={rowData}
          columnDefs={columnDefs}
          headerHeight={displayHeader ? gridHeaderHeight : 0}
          rowHeight={ROW_HEIGHT}
          onCellClicked={onCellClicked}
          onRowClicked={onRowClicked}
          onRowSelected={onRowSelected}
          onRowDoubleClicked={onRowDoubleClicked}
          onCellValueChanged={handleCellValueChange}
          onGridReady={onGridReady}
          getRowStyle={getRowStyle}
          rowClassRules={rowClassRules}
          tooltipHideDelay={5000}
          domLayout="autoHeight"
          tooltipShowDelay={0}
          gridOptions={{ ...DEFAULT_GRID_OPTIONS, ...gridOptions }}
          getRowHeight={getRowHeight}
          navigateToNextCell={() => null}
          defaultColDef={DEFAULT_COLUMN_DEF}
          suppressScrollOnNewData
          suppressContextMenu
          excelStyles={excelStyles}
          onSelectionChanged={onSelectionChanged}
          loadingOverlayComponent={Loader}
        />
      </div>
    </>
  );
});
