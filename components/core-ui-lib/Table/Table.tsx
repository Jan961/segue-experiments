import { AgGridReact } from 'ag-grid-react';
import GridStyles from './gridStyles';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

const AUTO_HEIGHT_LIMIT = 2;

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
  overrideHLimit?: boolean;
}

export default forwardRef(function Table(
  { rowData, columnDefs, styleProps, onCellClicked, onRowClicked, gridOptions, displayHeader = true, overrideHLimit = false }: TableProps,
  ref,
) {
  const [gridApi, setGridApi] = useState<GridApi | undefined>();

  useImperativeHandle(ref, () => ({
    getApi: () => gridApi,
  }));

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);

      if (rowData?.length > 0 && rowData?.length < AUTO_HEIGHT_LIMIT && params.api) {
        params.api.updateGridOptions({ domLayout: 'autoHeight' });
      }
    
  };

  useEffect(() => {
    if (rowData?.length > 0 && gridApi) {
      if (rowData?.length < AUTO_HEIGHT_LIMIT && !overrideHLimit) {
        gridApi.updateGridOptions({ domLayout: 'autoHeight' });
      } else {
        gridApi.updateGridOptions({ domLayout: 'normal' });
      }
    }
  }, [rowData]);

  return (
    <>
      <GridStyles {...styleProps} />
      <div className="ag-theme-quartz h-full">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          headerHeight={displayHeader ? 51 : 0}
          rowHeight={43}
          onCellClicked={onCellClicked}
          onRowClicked={onRowClicked}
          gridOptions={gridOptions}
          onGridReady={onGridReady}
        />
      </div>
    </>
  );
});
