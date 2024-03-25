import DefaultCellRenderer from "components/bookings/table/DefaultCellRenderer";
import DateColumnRenderer from "components/bookings/table/DateColumnRenderer";
import SalesDataButtonRenderer from "./SalesDataButtonRenderer";
import SelectRenderer from "components/core-ui-lib/Table/renderers/SelectRenderer";
import { getNumericalOptions } from "utils/getNumericalOptions";

export const gridOptions = {
  autoSizeStrategy: {
    type: 'fitGridWidth',
    defaultMinWidth: 50,
    wrapHeaderText: true,
  }
}

<<<<<<< Updated upstream
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 8a88ade007900e868d3fa39b3cd647ad1df005b7
=======
>>>>>>> Stashed changes
const getCellColor = (data) => {
  if (data.isNotOnSale) {
    return { backgroundColor: '#ED1111', color: 'white' }
  } else if (data.isBrochureReleased) {
    return { backgroundColor: '#FFE606', color: 'white' }
  } else if (data.isSingleSeats) {
    return { backgroundColor: '#10841C', color: 'white' }
  } else {
    return {};
  }
}


export const prodComparisionColDefs = (optionsLength = 0, selectForComparison, selectedBookings) => [
<<<<<<< Updated upstream
<<<<<<< HEAD
=======
export const prodComparisionColDefs = (optionsLength = 0, selectForComparison) => [
>>>>>>> 9e52513 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
export const prodComparisionColDefs = (optionsLength = 0, selectForComparison) => [
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
export const prodComparisionColDefs = (optionsLength = 0, selectForComparison) => [
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> 8a88ade007900e868d3fa39b3cd647ad1df005b7
    {
      headerName: 'Order for Comparison',
      field: 'compOrder',
      cellRenderer: SelectCompOrderRender,
      cellRendererParams: {
        optionsLength,
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        selectForComparison,
        selectedBookings
=======
        selectForComparison
>>>>>>> 9e52513 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
        selectForComparison
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
        selectForComparison
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
        selectForComparison,
        selectedBookings
>>>>>>> 8a88ade007900e868d3fa39b3cd647ad1df005b7
      },
=======
    {
      headerName: 'Order for Comparison',
      field: 'compOrder',
      cellRenderer: SelectRenderer,
      cellRendererParams: (params) => ({
        options:  getNumericalOptions(optionsLength, selectedBookings !== undefined ? selectedBookings.map(booking => booking.order) : []),
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
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
      field: 'salesBtn',
=======
>>>>>>> 9e52513 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
      field: 'salesBtn',
>>>>>>> dae467b (logic from Fri 8th for venue history merged with branch which was rebased with main yesterday)
=======
      field: 'salesBtn',
>>>>>>> 8a88ade007900e868d3fa39b3cd647ad1df005b7
=======
      field: 'salesBtn',
>>>>>>> Stashed changes
      headerName: 'Sales Data',
      cellRenderer: SalesDataButtonRenderer,
      width: 108,
      cellStyle: {
        textAlign: 'center',
      },
      resizable: false
    },
  ];
<<<<<<< Updated upstream
  
  export const salesColDefs = [
    {
      headerName: 'Week',
      field: 'week',
      cellRenderer: DefaultCellRenderer,
      width: 120,
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 8a88ade007900e868d3fa39b3cd647ad1df005b7
      cellStyle: (params) => {
        return {  
          ...getCellColor(params.data),
          textAlign: 'center',
          overflow: 'visible',
        }
      },
    },
    {
      headerName: 'Date',
<<<<<<< HEAD
=======
=======
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
      cellStyle: {
=======


export const salesColDefs = (currencySymbol) => [
  {
    headerName: 'Week',
    field: 'week',
    cellRenderer: DefaultCellRenderer,
    width: 120,
    cellStyle: (params) => {
      return {
        ...getCellColor(params.data),
>>>>>>> Stashed changes
        textAlign: 'center',
        overflow: 'visible',
      }
    },
<<<<<<< Updated upstream
    {
<<<<<<< HEAD
      headerName: 'Week of',
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 9e52513 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
      headerName: 'Date',
>>>>>>> dae467b (logic from Fri 8th for venue history merged with branch which was rebased with main yesterday)
=======
>>>>>>> 8a88ade007900e868d3fa39b3cd647ad1df005b7
      field: 'weekOf',
      cellRenderer: DateColumnRenderer,
      width: 120,
      cellStyle: {
        textAlign: 'center',
        overflow: 'visible',
      },
=======
  },
  {
    headerName: 'Date',
    field: 'weekOf',
    cellRenderer: DateColumnRenderer,
    width: 120,
    cellStyle: {
      textAlign: 'center',
      overflow: 'visible',
>>>>>>> Stashed changes
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
    headerName: 'Seats Sold ' + currencySymbol,
    field: 'seatsSaleChange',
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
<<<<<<< Updated upstream
    {
      headerName: 'Total Holds',
      field: 'totalHolds',
      cellRenderer: DefaultCellRenderer,
      width: 120,
      cellStyle: {
        textAlign: 'center',
        overflow: 'visible',
      },
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
      resizable: false
=======
>>>>>>> 9e52513 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
      resizable: false
>>>>>>> 8a88ade007900e868d3fa39b3cd647ad1df005b7
=======
  },
  {
    headerName: 'Total Holds',
    field: 'totalHolds',
    cellRenderer: DefaultCellRenderer,
    width: 120,
    cellStyle: {
      textAlign: 'center',
      overflow: 'visible',
>>>>>>> Stashed changes
    },
    resizable: false
  },
]