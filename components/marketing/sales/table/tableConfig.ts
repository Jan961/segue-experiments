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

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
const getCellColor = (data) => {
  if(data.isNotOnSale){
    return { backgroundColor: '#ED1111', color: 'white'}
  }  else if (data.isBrochureReleased) {
    return { backgroundColor: '#FFE606', color: 'white'}
  } else if (data.isSingleSeats) {
    return { backgroundColor: '#10841C', color: 'white'}
  } else {
    return {}; 
  }
}

export const prodComparisionColDefs = (optionsLength = 0, selectForComparison, selectedBookings) => [
=======
export const prodComparisionColDefs = (optionsLength = 0, selectForComparison) => [
>>>>>>> 9e52513 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
export const prodComparisionColDefs = (optionsLength = 0, selectForComparison) => [
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
export const prodComparisionColDefs = (optionsLength = 0, selectForComparison) => [
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
    {
      headerName: 'Order for Comparison',
      field: 'compOrder',
      cellRenderer: SelectCompOrderRender,
      cellRendererParams: {
        optionsLength,
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
      cellStyle: {
        textAlign: 'center',
        overflow: 'visible',
      },
    },
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
    },
  ]