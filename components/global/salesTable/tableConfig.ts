import getNumericalOptions from 'utils/getNumericalOptions';
import SelectOrderRenderer from './renderers/SelectOrderRenderer';
import ButtonSalesRenderer from './renderers/ButtonSalesRenderer';
import DefaultCellRenderer from 'components/core-ui-lib/Table/renderers/DefaultCellRenderer';
import formatInputDate from 'utils/dateInputFormat';
import IconRowRenderer from './renderers/IconRowRenderer';
import { isNullOrEmpty } from 'utils';

const reverseDate = (inputDt) => {
  return new Date(inputDt.split('/').reverse().join('/')).getTime();
};
const getCellColor = (data, ignoreMonday, school) => {
  const saleDt = reverseDate(formatInputDate(data.weekOf));
  const isMonday = new Date(saleDt).getDay() === 1;
  const showMondayBorder = isMonday && !ignoreMonday;

  if (data.isBrochureReleased) {
    return {
      backgroundColor: '#FFE606',
      color: '#617293',
      borderRightColor: school && showMondayBorder ? '#FDCE74' : 'transparent',
      borderRightWidth: school && showMondayBorder ? 15 : 0,
    };
  } else if (data.isSingleSeats) {
    return {
      backgroundColor: '#10841C',
      color: 'white',
      borderRightColor: school && showMondayBorder ? '#FDCE74' : 'transparent',
      borderRightWidth: school && showMondayBorder ? 15 : 0,
    };
  } else if (data.isNotOnSale) {
    return {
      backgroundColor: '#ED1111',
      color: 'white',
      borderRightColor: school && showMondayBorder ? '#FDCE74' : 'transparent',
      borderRightWidth: showMondayBorder ? 15 : 0,
    };
  } else {
    return isMonday && school ? { backgroundColor: '#FDCE74', color: '#617293' } : {};
  }
};

const stripSymbolAndRound = (valueInput: string, decimalPlaces = 2) => {
  const tempValue: number = parseFloat(valueInput.slice(1));
  if (isNaN(tempValue)) {
    return '0.00';
  }
  return tempValue.toFixed(decimalPlaces);
};

const valueWithCurrency = (inputText: string) => {
  const currencySymbol = inputText.slice(0, 1);
  const profit: string = stripSymbolAndRound(inputText);
  return currencySymbol + profit;
};

const integerFormatter: (inputSeats: string) => number = (inputSeats: string) => {
  return parseInt(inputSeats) || 0;
};

const floatFormatter: (inputValue: string) => number = (inputValue: string) => {
  return parseFloat(inputValue) || 0;
};

export const prodComparisionColDefs = (optionsLength = 0, selectForComparison, selectedBookings) => [
  {
    headerName: 'Order for Comparison',
    field: 'compOrder',
    cellRenderer: SelectOrderRenderer,
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
      hasSalesData: params.data.hasSalesData,
    }),
    width: 120,
    cellStyle: {
      textAlign: 'center',
      overflow: 'visible',
    },
    headerClass: 'right-border-full',
    suppressMovable: true,
    sortable: false,
    resizable: false,
  },
  {
    headerName: 'Production',
    field: 'prodName',
    cellRenderer: DefaultCellRenderer,
    width: 330,
    headerClass: 'right-border-full',
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
    headerClass: 'right-border-full',
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
    headerClass: 'right-border-full',
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
    headerClass: 'right-border-full',
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
    cellRenderer: ButtonSalesRenderer,
    width: 125,
    cellStyle: {
      textAlign: 'center',
    },
    suppressMovable: true,
    sortable: false,
    resizable: false,
  },
];

export const prodCompArchColDefs = (optionsLength = 0, selectForComparison, selectedBookings) => [
  {
    headerName: 'Order for Comparison',
    field: 'compOrder',
    cellRenderer: SelectOrderRenderer,
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
      hasSalesData: params.data.hasSalesData,
    }),
    width: 120,
    cellStyle: {
      textAlign: 'center',
      overflow: 'visible',
    },
    headerClass: 'right-border-full',
    suppressMovable: true,
    sortable: false,
    resizable: false,
  },
  {
    headerName: 'Production Code',
    field: 'prodCode',
    cellRenderer: DefaultCellRenderer,
    width: 110,
    headerClass: 'right-border-full',
    suppressMovable: true,
    sortable: false,
    resizable: false,
  },
  {
    headerName: 'Duration of Production',
    field: 'prodWks',
    cellRenderer: DefaultCellRenderer,
    width: 110,
    cellStyle: {
      textAlign: 'center',
    },
    headerClass: 'right-border-full',
    suppressMovable: true,
    sortable: false,
    resizable: false,
  },
];

export const salesColDefs = (
  schoolDataAvail: boolean,
  isMarketing: boolean,
  setSalesActivity: (type: string, sale: any) => void,
  canEditFlags: boolean,
) => {
  return [
    {
      headerName: 'Week',
      field: 'week',
      cellRenderer: function (params) {
        return params.data.isFinal ? 'Final' : params.data.week;
      },
      cellStyle: (params) => {
        return {
          ...getCellColor(params.data, true, schoolDataAvail),
          textAlign: 'center',
          overflow: 'visible',
        };
      },
      suppressMovable: true,
      headerClass: 'group-header-normal',
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
          ...getCellColor(params.data, false, schoolDataAvail),
          textAlign: 'center',
          overflow: 'visible',
          borderRight: '1px solid',
        };
      },
      suppressMovable: true,
      headerClass: 'custom-pinned-header',
      pinned: 'left',
      lockPinned: true,
      width: 120,
      resizable: false,
      sortable: false,
    },
    {
      headerName: 'General Sales',
      headerClass: 'group-header-parent',
      marryChildren: true,
      children: [
        {
          headerName: 'Seat Sold No.',
          field: 'genSeatsSold',
          cellRenderer: function (params) {
            // if final sales are 0, they have bene deleted off - return blank
            if (params.data.isFinal && parseInt(params.data.genSeatsSold) === 0) {
              return '';
            } else {
              if (params.data.genSeatsSold === '') {
                const prevSeats = params.api.getDisplayedRowAtIndex(params.node.rowIndex - 1)?.data.genSeatsSold;
                return prevSeats === '' || prevSeats === undefined ? '-' : prevSeats;
              } else {
                return params.data.genSeatsSold;
              }
            }
          },
          width: 90,
          cellStyle: {
            textAlign: 'center',
            overflow: 'visible',
          },
          headerClass: 'group-header-child',
          suppressMovable: true,
          sortable: false,
          resizable: false,
        },
        {
          headerName: 'Seats Sold',
          field: 'seatsSaleChange',
          cellRenderer: function (params) {
            // if final sales value is 0, they have bene deleted off - return blank
            // remove symbol for check
            const salesValue = stripSymbolAndRound(params.data.genTotalValue);
            if (params.data.isFinal && parseInt(salesValue) === 0) {
              return '';
            } else {
              if (params.data.genTotalValue === 0 || params.data.genTotalValue === '') {
                const prevTotal = params.api.getDisplayedRowAtIndex(params.node.rowIndex - 1)?.data.genTotalValue;
                if (prevTotal) return !prevTotal ? '-' : stripSymbolAndRound(prevTotal.toString());
              } else {
                return valueWithCurrency(params.data.genTotalValue);
              }
            }
          },
          width: 90,
          cellStyle: {
            textAlign: 'center',
            overflow: 'visible',
          },
          headerClass: 'group-header-child',
          suppressMovable: true,
          sortable: false,
          resizable: false,
        },
        {
          headerName: 'Reserved No',
          field: 'genReserved',
          cellRenderer: function (params) {
            return params.data.genReserved === '' ? '-' : params.data.genReserved;
          },
          width: 100,
          cellStyle: {
            textAlign: 'center',
            overflow: 'visible',
          },
          headerClass: 'group-header-child',
          suppressMovable: true,
          sortable: false,
          resizable: false,
        },
        {
          headerName: 'Reserved ',
          field: 'genReservations',
          cellRenderer: function (params) {
            // if final week reserved values are not displayed
            if (params.data.isFinal) {
              return '-';
            } else {
              const currencySymbol = params.data.genReservations.charAt(0);
              return params.data.genReservations === ''
                ? '-'
                : currencySymbol + stripSymbolAndRound(params.data.genReservations);
            }
          },
          width: 100,
          cellStyle: {
            textAlign: 'center',
            overflow: 'visible',
          },
          headerClass: 'group-header-child',
          suppressMovable: true,
          sortable: false,
          resizable: false,
        },
      ],
    },
    {
      headerName: 'School Sales',
      headerClass: 'group-header-parent',
      marryChildren: true,
      children: [
        {
          headerName: 'Seat Sold No.',
          field: 'schSeatsSold',
          cellRenderer: function (params) {
            // if final sales are 0, they have bene deleted off - return blank
            if (params.data.isFinal && parseInt(params.data.schSeatsSold) === 0) {
              return '';
            } else {
              if (params.data.schSeatsSold === '') {
                const prevSeats = params.api.getDisplayedRowAtIndex(params.node.rowIndex - 1)?.data.schSeatsSold;
                return prevSeats === '' || prevSeats === undefined ? '-' : prevSeats;
              } else {
                return params.data.schSeatsSold;
              }
            }
          },
          width: 90,
          cellStyle: {
            textAlign: 'center',
            overflow: 'visible',
          },
          headerClass: 'group-header-child',
          suppressMovable: true,
          sortable: false,
          resizable: false,
        },
        {
          headerName: 'Seats Sold',
          field: 'seatsSaleChange',
          cellRenderer: function (params) {
            // if final sales value is 0, they have bene deleted off - return blank
            // remove symbol for check
            const salesValue = stripSymbolAndRound(params.data.schTotalValue);
            if (params.data.isFinal && parseInt(salesValue) === 0) {
              return '';
            } else {
              if (isNullOrEmpty(params.data.schTotalValue)) {
                const prevTotal = params.api.getDisplayedRowAtIndex(params.node.rowIndex - 1)?.data.schTotalValue;
                if (prevTotal) return !prevTotal ? '-' : stripSymbolAndRound(prevTotal.toString());
              } else {
                return valueWithCurrency(params.data.schTotalValue);
              }
            }
          },
          width: 90,
          cellStyle: {
            textAlign: 'center',
            overflow: 'visible',
          },
          headerClass: 'group-header-child',
          suppressMovable: true,
          sortable: false,
          resizable: false,
        },
        {
          headerName: 'Reserved No',
          field: 'schReserved',
          cellRenderer: function (params) {
            // if final week reserved values are not displayed
            if (params.data.isFinal) {
              return '-';
            } else {
              return params.data.schReserved || 0;
            }
          },
          width: 100,
          cellStyle: {
            textAlign: 'center',
            overflow: 'visible',
          },
          headerClass: 'group-header-child',
          suppressMovable: true,
          sortable: false,
          resizable: false,
        },
        {
          headerName: 'Reserved ',
          field: 'schReservations',
          cellRenderer: function (params) {
            // if final week reserved values are not displayed
            if (params.data.isFinal) {
              return '-';
            } else {
              if (params.data.schReservations === '') {
                const previousRev = params.api.getDisplayedRowAtIndex(params.node.rowIndex - 1)?.data.schReservations;
                if (previousRev) return !previousRev ? '-' : valueWithCurrency(previousRev);
              } else {
                return params.data.schReservations === ''
                  ? valueWithCurrency('00.00')
                  : valueWithCurrency(params.data.schReservations);
              }
            }
          },
          width: 100,
          cellStyle: {
            textAlign: 'center',
            overflow: 'visible',
          },
          headerClass: 'group-header-child',
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
        const currSchResValue =
          params.data.schReservations === '' ? 0 : parseFloat(stripSymbolAndRound(params.data.schReservations));
        const currGenResValue =
          params.data.genReservations === '' ? 0 : parseFloat(stripSymbolAndRound(params.data.genReservations));
        const totalReserve = currSchResValue + currGenResValue;
        const currSchSoldVal =
          params.data.schTotalValue === '' ? 0 : parseFloat(stripSymbolAndRound(params.data.schTotalValue));
        const currGenSoldVal =
          params.data.genTotalValue === '' ? 0 : parseFloat(stripSymbolAndRound(params.data.genTotalValue));
        const totalSold = currSchSoldVal + currGenSoldVal;

        const currencySymbol = params.data.genTotalValue.charAt(0);
        const currentValue = totalReserve + totalSold;

        return currentValue === 0 ? '-' : currencySymbol + currentValue.toFixed(2).toString();
      },
      width: 100,
      cellStyle: {
        textAlign: 'center',
        overflow: 'visible',
      },
      headerClass: 'group-header-normal',
      suppressMovable: true,
      sortable: false,
      resizable: false,
    },
    {
      headerName: 'Value Change',
      field: 'valueChange',
      cellRenderer: function (params) {
        const rowIndex = params.node.rowIndex;
        const currSchResValue = params.data.schReservations === '' ? 0 : params.data.schReservations.slice(1);
        const currGenResValue = params.data.genReservations === '' ? 0 : params.data.genReservations.slice(1);
        const totalReserve = floatFormatter(currSchResValue) + floatFormatter(currGenResValue);
        const currSchSoldVal = params.data.schTotalValue === '' ? 0 : params.data.schTotalValue.slice(1);
        const currGenSoldVal = params.data.genTotalValue === '' ? 0 : params.data.genTotalValue.slice(1);

        const totalSold = floatFormatter(currSchSoldVal) + floatFormatter(currGenSoldVal);
        const currentValue = totalReserve + totalSold;
        const currencySymbol = params.data.genTotalValue.charAt(0);
        let valueChange;
        if (rowIndex === 0) {
          valueChange = currentValue;
        } else {
          const previousRowData = params.api.getDisplayedRowAtIndex(rowIndex - 1).data;
          const prevSchResValue = previousRowData.schReservations === '' ? 0 : previousRowData.schReservations.slice(1);
          const prevGenResValue = previousRowData.genReservations === '' ? 0 : previousRowData.genReservations.slice(1);

          const totalPrevReserve = floatFormatter(prevSchResValue) + floatFormatter(prevGenResValue);
          const prevSchSoldVal = previousRowData.schTotalValue === '' ? 0 : previousRowData.schTotalValue.slice(1);
          const prevGenSoldVal = previousRowData.genTotalValue === '' ? 0 : previousRowData.genTotalValue.slice(1);

          const totalPrevSold = floatFormatter(prevSchSoldVal) + floatFormatter(prevGenSoldVal);
          const prevValueTotal = totalPrevReserve + totalPrevSold;
          valueChange = currentValue - prevValueTotal;
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
      headerClass: 'group-header-normal',
      suppressMovable: true,
      sortable: false,
      resizable: false,
    },
    {
      headerName: 'Seats Change',
      field: 'seatsChange',
      cellRenderer: function (params) {
        const rowIndex = params.node.rowIndex;
        const schSeatsSold = integerFormatter(params.data.schSeatsSold);
        const genSeatsSold = integerFormatter(params.data.genSeatsSold);
        const schReserved = integerFormatter(params.data.schReserved);
        const genReserved = integerFormatter(params.data.genReserved);
        const currentValue = schSeatsSold + genSeatsSold + schReserved + genReserved;

        let seatsChange;
        if (rowIndex === 0) {
          seatsChange = currentValue;
        } else {
          const previousRowData = params.api.getDisplayedRowAtIndex(rowIndex - 1).data;
          const prevSchSeatsSold = parseInt(previousRowData.schSeatsSold) || 0;
          const prevGenSeatsSold = parseInt(previousRowData.genSeatsSold) || 0;
          const prevSchReserved = parseInt(previousRowData.schReserved) || 0;
          const prevGenReserved = parseInt(previousRowData.genReserved) || 0;

          const prevSeats = prevSchSeatsSold + prevGenSeatsSold + prevSchReserved + prevGenReserved;
          seatsChange = currentValue - prevSeats;
        }
        return seatsChange.toString();
      },
      width: 85,
      cellStyle: {
        textAlign: 'center',
        overflow: 'visible',
      },
      headerClass: 'group-header-normal',
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
      width: 75,
      cellStyle: {
        textAlign: 'center',
        overflow: 'visible',
      },
      headerClass: 'group-header-normal',
      suppressMovable: true,
      sortable: false,
      resizable: false,
    },
    isMarketing && {
      headerName: 'Activity',
      field: 'activity',
      cellRenderer: IconRowRenderer,
      cellRendererParams: (params) => ({
        iconList: [
          {
            name: 'user-solid',
            color: params.data.isSingleSeats ? '#10841C' : '#ddd',
            onClick: () => (canEditFlags ? setSalesActivity('SetSingleSeats', params.data) : null),
          },
          {
            name: 'book-solid',
            color: params.data.isBrochureReleased ? '#FFE606' : '#ddd',
            onClick: () => (canEditFlags ? setSalesActivity('SetBrochureReleased', params.data) : null),
          },
          {
            name: 'square-cross',
            color: params.data.isNotOnSale ? '#ED1111' : '#ddd',
            onClick: () => (canEditFlags ? setSalesActivity('SetNotOnSale', params.data) : null),
          },
        ],
      }),
      width: 120,
      cellStyle: {
        textAlign: 'center',
        overflow: 'visible',
      },
      headerClass: 'group-header-normal',
      suppressMovable: true,
      sortable: false,
      resizable: false,
    },
  ];
};
