import DefaultCellRenderer from "components/bookings/table/DefaultCellRenderer";
import SelectCompOrderRender from "./SelectCompOrderRender";
import DateColumnRenderer from "components/bookings/table/DateColumnRenderer";
import SalesDataButtonRenderer from "./SalesDataButtonRenderer";

export const gridOptions = {
  autoSizeStrategy: {
    type: 'fitGridWidth',
    defaultMinWidth: 50,
    wrapHeaderText: true,
  }
}

export const prodComparisionColDefs = (optionsLength = 0, selectForComparison) => [
    {
      headerName: 'Order for Comparison',
      field: 'compOrder',
      cellRenderer: SelectCompOrderRender,
      cellRendererParams: {
        optionsLength,
        selectForComparison
      },
      width: 120,
      cellStyle: {
        textAlign: 'center',
        overflow: 'visible',
      },
    },
    {
      headerName: 'Production',
      field: 'prodName',
      cellRenderer: DefaultCellRenderer,
      width: 350,
    },
    {
      headerName: 'Date of First Performance',
      field: 'firstPerfDt',
      cellRenderer: DateColumnRenderer,
      width: 130,
      cellStyle: {
        textAlign: 'center',
      },
    },
    {
      headerName: 'No. Perfs',
      field: 'numPerfs',
      cellRenderer: DefaultCellRenderer,
      width: 70,
      cellStyle: {
        textAlign: 'center',
      },
    },
    {
      headerName: 'Production Duration (Wks)',
      field: 'prodWks',
      cellRenderer: DefaultCellRenderer,
      width: 140,
      cellStyle: {
        textAlign: 'center',
      },
    },
    {
      headerName: 'Sales Data',
      cellRenderer: SalesDataButtonRenderer,
      width: 108,
      cellStyle: {
        textAlign: 'center',
      },
      resizable: false
    },
  ];
  
  export const salesColDefs = [
    {
      headerName: 'Week',
      field: 'week',
      cellRenderer: DefaultCellRenderer,
      width: 120,
      cellStyle: {
        textAlign: 'center',
        overflow: 'visible',
      },
    },
    {
      headerName: 'Week of',
      field: 'weekOf',
      cellRenderer: DateColumnRenderer,
      width: 120,
      cellStyle: {
        textAlign: 'center',
        overflow: 'visible',
      },
    },
    {
      headerName: 'Seat Sold No.',
      field: 'seatsSold',
      cellRenderer: DefaultCellRenderer,
      width: 120,
      cellStyle: {
        textAlign: 'center',
        overflow: 'visible',
      },
    },
    {
      headerName: 'Seats Sold %',
      field: 'seatsSalePercentage',
      cellRenderer: DefaultCellRenderer,
      width: 120,
      cellStyle: {
        textAlign: 'center',
        overflow: 'visible',
      },
    },
    {
      headerName: 'Reserved No',
      field: 'reserved',
      cellRenderer: DefaultCellRenderer,
      width: 120,
      cellStyle: {
        textAlign: 'center',
        overflow: 'visible',
      },
    },
    {
      headerName: 'Reserved %',
      field: 'reservedPercentage',
      cellRenderer: DefaultCellRenderer,
      width: 120,
      cellStyle: {
        textAlign: 'center',
        overflow: 'visible',
      },
    },
    {
      headerName: 'Total Value',
      field: 'totalValue',
      cellRenderer: DefaultCellRenderer,
      width: 120,
      cellStyle: {
        textAlign: 'center',
        overflow: 'visible',
      },
    },
    {
      headerName: 'Value Change',
      field: 'valueChange',
      cellRenderer: DefaultCellRenderer,
      width: 120,
      cellStyle: {
        textAlign: 'center',
        overflow: 'visible',
      },
    },
    {
      headerName: 'Seats Change',
      field: 'seatsChange',
      cellRenderer: DefaultCellRenderer,
      width: 120,
      cellStyle: {
        textAlign: 'center',
        overflow: 'visible',
      },
    },
    {
      headerName: 'Total Holds',
      field: 'totalHolds',
      cellRenderer: DefaultCellRenderer,
      width: 120,
      cellStyle: {
        textAlign: 'center',
        overflow: 'visible',
      },
    },
  ]