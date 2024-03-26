import DefaultCellRenderer from "components/bookings/table/DefaultCellRenderer";
import DateColumnRenderer from "components/bookings/table/DateColumnRenderer";
import { getNumericalOptions } from "utils/getNumericalOptions";
import SelectRenderer from "components/core-ui-lib/Table/renderers/SelectRenderer";
import ButtonRenderer from "components/core-ui-lib/Table/renderers/ButtonRenderer";

const getCellColor = (data) => {
  if (data.isNotOnSale) {
    return { backgroundColor: '#ED1111', color: 'white' }
  } else if (data.isBrochureReleased) {
    return { backgroundColor: '#FFE606', color: '#617293' }
  } else if (data.isSingleSeats) {
    return { backgroundColor: '#10841C', color: 'white' }
  } else {
    return {};
  }
}

export const prodComparisionColDefs = (optionsLength = 0, selectForComparison, selectedBookings) => [
  {
    headerName: 'Order for Comparison',
    field: 'compOrder',
    cellRenderer: SelectRenderer,
    cellRendererParams: (params) => ({
      options: getNumericalOptions(optionsLength, selectedBookings !== undefined ? selectedBookings.map(booking => booking.order) : []),
      selectForComparison,
      selectedBookings,
      placeholder: '-',
      inline: true,
      className: 'mt-1 w-[112px]',
      onChange: (value) => {
        selectForComparison({
          order: parseInt(value),
          BookingId: params.data.BookingId,
          prodCode: params.data.prodCode,
          prodName: params.data.prodName,
          numPerfs: params.data.numPerfs
        });
      }
    }),
    width: 120,
    cellStyle: {
      textAlign: 'center',
      overflow: 'visible',
    },
    headerClass: 'border-r-[1px] border-white',
    suppressMovable: true,
    sortable: false,
    resizable: false,
  },
  {
    headerName: 'Production',
    field: 'prodName',
    cellRenderer: DefaultCellRenderer,
    width: 345,
    headerClass: 'border-r-[1px] border-white',
    suppressMovable: true,
    sortable: false,
    resizable: false,
  },
  {
    headerName: 'Date of First Performance',
    field: 'firstPerfDt',
    cellRenderer: DateColumnRenderer,
    width: 130,
    cellStyle: {
      textAlign: 'center',
    },
    headerClass: 'border-r-[1px] border-white',
    suppressMovable: true,
    sortable: false,
    resizable: false,
  },
  {
    headerName: 'No. Perfs',
    field: 'numPerfs',
    cellRenderer: DefaultCellRenderer,
    width: 70,
    cellStyle: {
      textAlign: 'center',
    },
    headerClass: 'border-r-[1px] border-white',
    suppressMovable: true,
    sortable: false,
    resizable: false,
  },
  {
    headerName: 'Production Duration (Wks)',
    field: 'prodWks',
    cellRenderer: DefaultCellRenderer,
    width: 140,
    cellStyle: {
      textAlign: 'center',
    },
    headerClass: 'border-r-[1px] border-white',
    suppressMovable: true,
    sortable: false,
    resizable: false,
  },
  {
    field: 'salesBtn',
    headerName: 'Sales Data',
    cellRendererParams: {
      text: 'Sales Data'
    },
    cellRenderer: ButtonRenderer,
    width: 108,
    cellStyle: {
      textAlign: 'center',
    },
    suppressMovable: true,
    sortable: false,
    resizable: false,
  },
];

export const salesColDefs = (currencySymbol) => [
  {
    headerName: 'Week',
    field: 'week',
    cellRenderer: DefaultCellRenderer,
    width: 120,
    cellStyle: (params) => {
      return {
        ...getCellColor(params.data),
        textAlign: 'center',
        overflow: 'visible',
      };
    },
    headerClass: 'border-r-[1px] border-white',
    suppressMovable: true,
    sortable: false,
    resizable: false,
  },
  {
    headerName: 'Date',
    field: 'weekOf',
    cellRenderer: DateColumnRenderer,
    width: 120,
    cellStyle: {
      textAlign: 'center',
      overflow: 'visible',
    },
    headerClass: 'border-r-[1px] border-white',
    suppressMovable: true,
    sortable: false,
    resizable: false
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
    headerClass: 'border-r-[1px] border-white',
    suppressMovable: true,
    sortable: false,
    resizable: false
  },
  {
    headerName: 'Seats Sold ' + currencySymbol,
    field: 'seatsSaleChange',
    cellRenderer: function (params) {
      return currencySymbol + params.data.totalValue.toFixed(2);
    },
    width: 120,
    cellStyle: {
      textAlign: 'center',
      overflow: 'visible',
    },
    headerClass: 'border-r-[1px] border-white',
    suppressMovable: true,
    sortable: false,
    resizable: false
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
    headerClass: 'border-r-[1px] border-white',
    suppressMovable: true,
    sortable: false,
    resizable: false
  },
  {
    headerName: 'Reserved ' + currencySymbol,
    field: 'reservations',
    cellRenderer: function (params) {
      return currencySymbol + (params.data.reservations === '' ? '0.00' : params.data.reservations);
    },
    width: 120,
    cellStyle: {
      textAlign: 'center',
      overflow: 'visible',
    },
    headerClass: 'border-r-[1px] border-white',
    suppressMovable: true,
    sortable: false,
    resizable: false
  },
  {
    headerName: 'Total Value',
    field: 'totalValue',
    cellRenderer: function (params) {
      let currReserveValue = params.data.reservations === '' ? 0 : parseFloat(params.data.reservations);
      let currentValue = params.data.totalValue + currReserveValue;
      return currencySymbol + currentValue.toFixed(2).toString();
    },
    width: 120,
    cellStyle: {
      textAlign: 'center',
      overflow: 'visible',
    },
    headerClass: 'border-r-[1px] border-white',
    suppressMovable: true,
    sortable: false,
    resizable: false
  },
  {
    headerName: 'Value Change',
    field: 'valueChange',
    cellRenderer: function (params) {
      let rowIndex = params.node.rowIndex;
      let currReserveValue = params.data.reservations === '' ? 0 : parseFloat(params.data.reservations);
      let currentValue = params.data.totalValue + currReserveValue;
      let valueChange;
      if (rowIndex === 0) {
        valueChange = currentValue;
      } else {
        let previousRowData = params.api.getDisplayedRowAtIndex(rowIndex - 1).data;
        let prevReservations = previousRowData.reservations === '' ? 0 : parseFloat(previousRowData.reservations);
        let previousTotalValue = previousRowData.totalValue + prevReservations;
        valueChange = currentValue - previousTotalValue;
      }
      return currencySymbol + valueChange.toFixed(2).toString();
    },
    width: 120,
    cellStyle: {
      textAlign: 'center',
      overflow: 'visible',
    },
    headerClass: 'border-r-[1px] border-white',
    suppressMovable: true,
    sortable: false,
    resizable: false
  },
  {
    headerName: 'Seats Change',
    field: 'seatsChange',
    cellRenderer: function (params) {
      let rowIndex = params.node.rowIndex;
      let currentValue = parseInt(params.data.seatsSold) + parseInt(params.data.reserved);
      let seatsChange;
      if (rowIndex === 0) {
        seatsChange = currentValue;
      } else {
        let previousRowData = params.api.getDisplayedRowAtIndex(rowIndex - 1).data;
        let prevSeats = parseInt(previousRowData.seatsSold) + parseInt(previousRowData.reserved);
        seatsChange = currentValue - prevSeats;
      }
      return seatsChange.toString();
    },
    width: 120,
    cellStyle: {
      textAlign: 'center',
      overflow: 'visible',
    },
    headerClass: 'border-r-[1px] border-white',
    suppressMovable: true,
    sortable: false,
    resizable: false
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
    suppressMovable: true,
    sortable: false,
    resizable: false
  },
]