import getNumericalOptions from 'utils/getNumericalOptions';
import SelectRenderer from 'components/core-ui-lib/Table/renderers/SelectRenderer';
import ButtonRenderer from 'components/core-ui-lib/Table/renderers/ButtonRenderer';
import DefaultCellRenderer from 'components/core-ui-lib/Table/renderers/DefaultCellRenderer';
import formatInputDate from 'utils/dateInputFormat';

const getCellColor = (data) => {
  if (data.isNotOnSale) {
    return { backgroundColor: '#ED1111', color: 'white' };
  } else if (data.isBrochureReleased) {
    return { backgroundColor: '#FFE606', color: '#617293' };
  } else if (data.isSingleSeats) {
    return { backgroundColor: '#10841C', color: 'white' };
  } else {
    return {};
  }
};

export const prodComparisionColDefs = (optionsLength = 0, selectForComparison, selectedBookings) => [
  {
    headerName: 'Order for Comparison',
    field: 'compOrder',
    cellRenderer: SelectRenderer,
    cellRendererParams: (params) => ({
      options: getNumericalOptions(
        optionsLength,
        [],
        // selectedBookings !== undefined ? selectedBookings.map((booking) => booking.order) : [],
      ),
      selectForComparison,
      selectedBookings,
      placeholder: '',
      inline: true,
      className: 'mt-1 w-[112px]',
      onChange: (value) => {
        selectForComparison({
          order: parseInt(value),
          bookingId: params.data.bookingId,
          prodCode: params.data.prodCode,
          prodName: params.data.prodName,
          numPerfs: params.data.numPerfs,
        });
      },
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
    width: 330,
    headerClass: 'border-r-[1px] border-white',
    suppressMovable: true,
    sortable: false,
    resizable: false,
  },
  {
    headerName: 'Date of First Performance',
    field: 'firstPerfDt',
    cellRenderer: DefaultCellRenderer,
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
      buttonText: 'Sales Data',
      className: 'w-24',
    },
    cellRenderer: ButtonRenderer,
    width: 125,
    cellStyle: {
      textAlign: 'center',
    },
    suppressMovable: true,
    sortable: false,
    resizable: false,
  },
];

export const salesColDefs = (currencySymbol) => {
  return [
    {
      headerName: 'Week',
      field: 'week',
      cellRenderer: DefaultCellRenderer,
      cellStyle: (params) => {
        return {
          ...getCellColor(params.data),
          textAlign: 'center',
          overflow: 'visible',
        };
      },
      suppressMovable: true,
      headerClass: 'custom-header-3rb',
      pinned: 'left',
      lockPinned: true,
      width: 120,
      resizable: false,
      sortable: false,
    },
    {
      headerName: 'Date',
      field: 'weekOf',
      cellRenderer: function (params) {
        return formatInputDate(params.data.weekOf);
      },
      cellStyle: (params) => {
        return {
          ...getCellColor(params.data),
          textAlign: 'center',
          overflow: 'visible',
        };
      },
      suppressMovable: true,
      headerClass: 'custom-header-4rb',
      pinned: 'left',
      lockPinned: true,
      width: 120,
      resizable: false,
      sortable: false,
    },
    {
      headerName: 'General Sales',
      headerClass: 'justify-center font-bold text-base thick-border-b thick-border-r',
      marryChildren: true,
      children: [
        {
          headerName: 'Seat Sold No.',
          field: 'genSeatsSold',
          cellRenderer: function (params) {
            if (params.data.saleType === 'general') {
              return params.data.genSeatsSold === '' ? '-' : params.data.genSeatsSold;
            } else {
              const prevSeats = params.api.getDisplayedRowAtIndex(params.node.rowIndex - 1)?.data.genSeatsSold;
              return prevSeats === '' || prevSeats === undefined ? '-' : prevSeats;
            }
          },
          width: 90,
          cellStyle: {
            textAlign: 'center',
            overflow: 'visible',
          },
          headerClass: 'border-r-[1px] border-white ',
          suppressMovable: true,
          sortable: false,
          resizable: false,
        },
        {
          headerName: 'Seats Sold ' + currencySymbol,
          field: 'seatsSaleChange',
          cellRenderer: function (params) {
            if (params.data.saleType === 'general') {
              if (params.data.genTotalValue === 0 || params.data.genTotalValue === '') {
                return 0;
              } else {
                return currencySymbol + parseInt(params.data.genTotalValue).toFixed(2);
              }
            } else {
              const prevTotal = params.api.getDisplayedRowAtIndex(params.node.rowIndex - 1)?.data.genTotalValue;
              return prevTotal === '' || prevTotal === undefined
                ? '-'
                : currencySymbol + parseInt(prevTotal).toFixed(2);
            }
          },
          width: 90,
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
          headerName: 'Reserved No',
          field: 'genReserved',
          cellRenderer: function (params) {
            if (params.data.saleType === 'general') {
              return params.data.genReserved === '' ? 0 : params.data.genReserved;
            } else {
              const prevRevVal = params.api.getDisplayedRowAtIndex(params.node.rowIndex - 1)?.data.genReserved;
              return prevRevVal === '' || prevRevVal === undefined ? '-' : prevRevVal;
            }
          },
          width: 100,
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
          headerName: 'Reserved ' + currencySymbol,
          field: 'genReservations',
          cellRenderer: function (params) {
            if (params.data.saleType === 'general') {
              return currencySymbol + (params.data.genReservations === '' ? '0.00' : params.data.genReservations);
            } else {
              const prevRev = params.api.getDisplayedRowAtIndex(params.node.rowIndex - 1)?.data.genReservations;
              return prevRev === '' || prevRev === undefined ? '-' : currencySymbol + parseFloat(prevRev).toFixed(2);
            }
          },
          width: 100,
          cellStyle: {
            textAlign: 'center',
            overflow: 'visible',
          },
          headerClass: 'border-r-[4px] border-white',
          suppressMovable: true,
          sortable: false,
          resizable: false,
        },
      ],
    },
    {
      headerName: 'School Sales',
      headerClass: 'justify-center font-bold text-base thick-border-b',
      marryChildren: true,
      children: [
        {
          headerName: 'Seat Sold No.',
          field: 'schSeatsSold',
          cellRenderer: function (params) {
            if (params.data.saleType === 'school') {
              return params.data.schSeatsSold === '' ? '-' : params.data.schSeatsSold;
            } else {
              const prevSeatsSold = params.api.getDisplayedRowAtIndex(params.node.rowIndex - 1).data.schSeatsSold;
              return prevSeatsSold === '' || prevSeatsSold === undefined ? '-' : prevSeatsSold;
            }
          },
          width: 90,
          cellStyle: {
            textAlign: 'center',
            overflow: 'visible',
          },
          headerClass: 'border-r-[1px] border-white ',
          suppressMovable: true,
          sortable: false,
          resizable: false,
        },
        {
          headerName: 'Seats Sold ' + currencySymbol,
          field: 'seatsSaleChange',
          cellRenderer: function (params) {
            if (params.data.saleType === 'school') {
              return params.data.schTotalValue !== ''
                ? currencySymbol + parseInt(params.data.schTotalValue).toFixed(2)
                : '-';
            } else {
              const prevTotal = params.api.getDisplayedRowAtIndex(params.node.rowIndex - 1).data.schTotalValue;
              return prevTotal === '' || prevTotal === undefined
                ? '-'
                : currencySymbol + parseInt(prevTotal).toFixed(2);
            }
          },
          width: 90,
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
          headerName: 'Reserved No',
          field: 'schReserved',
          cellRenderer: function (params) {
            if (params.data.saleType === 'school') {
              return params.data.schReserved === '' ? 0 : params.data.schReserved;
            } else {
              const previousRevNo = params.api.getDisplayedRowAtIndex(params.node.rowIndex - 1).data.schReserved;
              return previousRevNo;
            }
          },
          width: 100,
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
          headerName: 'Reserved ' + currencySymbol,
          field: 'schReservations',
          cellRenderer: function (params) {
            if (params.data.saleType === 'school') {
              return currencySymbol + (params.data.schReservations === '' ? '0.00' : params.data.schReservations);
            } else {
              const previousRev = params.api.getDisplayedRowAtIndex(params.node.rowIndex - 1).data.schReservations;
              return currencySymbol + previousRev;
            }
          },
          width: 100,
          cellStyle: {
            textAlign: 'center',
            overflow: 'visible',
          },
          headerClass: 'border-r-[4px] border-white',
          suppressMovable: true,
          sortable: false,
          resizable: false,
        },
      ],
    },
    {
      headerName: 'Total Value',
      field: 'totalValue',
      cellRenderer: function (params) {
        const currReserveValue = params.data.totalValue === '' ? 0 : parseFloat(params.data.totalValue);
        const totalVal = params.data.totalValue === '' ? 0 : params.data.totalValue;
        const currentValue = currReserveValue + totalVal;
        return currentValue === 0 ? '-' : currencySymbol + currentValue.toFixed(2).toString();
      },
      width: 75,
      cellStyle: {
        textAlign: 'center',
        overflow: 'visible',
      },
      headerClass: 'custom-header-1rb',
      suppressMovable: true,
      sortable: false,
      resizable: false,
    },
    {
      headerName: 'Value Change',
      field: 'valueChange',
      cellRenderer: function (params) {
        const rowIndex = params.node.rowIndex;
        const currReserveValue = params.data.reservations === '' ? 0 : parseFloat(params.data.reservations);
        const currentValue = params.data.totalValue + currReserveValue;
        let valueChange;
        if (rowIndex === 0) {
          valueChange = currentValue;
        } else {
          const previousRowData = params.api.getDisplayedRowAtIndex(rowIndex - 1).data;
          const prevReservations = previousRowData.reservations === '' ? 0 : parseFloat(previousRowData.reservations);
          const previousTotalValue = previousRowData.totalValue + prevReservations;
          valueChange = currentValue - previousTotalValue;
        }

        // if negative display the minus sign before the currencySymbol
        if (valueChange < 0) {
          return '-' + currencySymbol + (valueChange * -1).toFixed(2).toString();
        } else if (valueChange > 0) {
          return currencySymbol + parseInt(valueChange).toFixed(2).toString();
        } else {
          return currencySymbol + '0.00';
        }
      },
      width: 85,
      cellStyle: {
        textAlign: 'center',
        overflow: 'visible',
      },
      headerClass: 'custom-header-1rb',
      suppressMovable: true,
      sortable: false,
      resizable: false,
    },
    {
      headerName: 'Seats Change',
      field: 'seatsChange',
      cellRenderer: function (params) {
        const rowIndex = params.node.rowIndex;
        const seatsSold = parseInt(params.data.seatsSold);
        const reserved = params.data.reserved === '' ? 0 : parseInt(params.data.reserved);
        const currentValue = seatsSold + reserved;
        let seatsChange;
        if (rowIndex === 0) {
          seatsChange = currentValue;
        } else {
          const previousRowData = params.api.getDisplayedRowAtIndex(rowIndex - 1).data;
          const prevSeatsSold = parseInt(previousRowData.seatsSold);
          const prevReserved = previousRowData.reserved === '' ? 0 : parseInt(previousRowData.reserved);
          const prevSeats = prevSeatsSold + prevReserved;
          seatsChange = currentValue - prevSeats;
        }
        return seatsChange.toString();
      },
      width: 85,
      cellStyle: {
        textAlign: 'center',
        overflow: 'visible',
      },
      headerClass: 'custom-header-1rb',
      suppressMovable: true,
      sortable: false,
      resizable: false,
    },
    {
      headerName: 'Total Holds',
      field: 'totalHolds',
      cellRenderer: function (params) {
        return params.data.totalHolds === null ? 0 : params.data.totalHolds;
      },
      width: 70,
      cellStyle: {
        textAlign: 'center',
        overflow: 'visible',
      },
      headerClass: 'custom-header-end',
      suppressMovable: true,
      sortable: false,
      resizable: false,
    },
  ];
};
