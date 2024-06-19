import DefaultCellRenderer from 'components/core-ui-lib/Table/renderers/DefaultCellRenderer';
import { SalesComparison } from 'types/MarketingTypes';
import formatInputDate from 'utils/dateInputFormat';
import { tileColors } from 'config/global';

export type SelectedBooking = {
  bookingId: string;
  order: number;
  prodCode: string;
  prodName: string;
  numPerfs: number;
};

export interface SalesComp {
  tableData: Array<SalesComparison>;
  bookingIds: Array<SelectedBooking>;
}

const salesComparison = async (data: SalesComp) => {
  const tempRowData = [];
  const tempColDef = [];
  const excelStyles = [
    {
      id: 'headerStyles',
      interior: {
        color: tileColors.bookings,
        pattern: 'Solid',
      },
      font: {
        color: '#FFFFFF',
      },
      alignment: {
        horizontal: 'center',
      },
    },
  ];
  const weekColumn = {
    headerName: 'Wk',
    field: 'week',
    cellRenderer: DefaultCellRenderer,
    suppressMovable: true,
    headerClass: ['custom-sm-pinned-header', 'headerStyles'],
    cellStyle: {
      borderRight: '1px solid',
    },
    pinned: 'left',
    lockPinned: true,
    width: 80,
    resizable: false,
    sortable: false,
  };

  // Add the 'Week' column as a pinned column on the left
  tempColDef.push(weekColumn);

  // Prepare the rest of the column definitions based on bookings
  data.bookingIds.forEach((booking, index) => {
    let borderClasses = 'border-b-2 border-white';
    if (index < data.bookingIds.length - 1) {
      borderClasses += ' border-r-4';
    }

    // Define the main column group for each booking
    const mainColGroup = {
      headerName: booking.prodName,
      headerGroupComponent: 'AGGridHeaderGroupComponent',
      headerClass: ['justify-center', 'font-bold', 'text-base', borderClasses, 'headerStyles'],
      sortable: false,
      children: [
        {
          headerName: 'No. of Performances: ' + booking.numPerfs,
          headerClass: ['justify-center', 'font-bold', 'text-base', borderClasses, 'headerStyles'],
          marryChildren: true,
          children: [
            {
              headerName: 'Date',
              field: booking.prodCode + '_date',
              cellRenderer: DefaultCellRenderer,
              suppressMovable: true,
              headerClass: ['group-header-child', 'headerStyles'],
              width: 100,
              resizable: false,
              sortable: false,
            },
            {
              headerName: 'Seats Sold',
              field: booking.prodCode + '_seats',
              cellRenderer: DefaultCellRenderer,
              suppressMovable: true,
              headerClass: ['group-header-child', 'headerStyles'],
              width: 80,
              resizable: false,
              sortable: false,
            },
            {
              headerName: 'Sales Value',
              field: booking.prodCode + '_saleValue',
              cellRenderer: DefaultCellRenderer,
              suppressMovable: true,
              headerClass: ['group-header-child', 'headerStyles'],
              width: 122,
              resizable: false,
              sortable: false,
            },
          ],
        },
      ],
    };

    // Push the main column group onto the tempColDef array
    tempColDef.push(mainColGroup);
  });
  // Processing the row data
  data.tableData.forEach((sale) => {
    tempRowData.push({
      week: sale.SetBookingWeekNum,
      ...(function processData(seatInfo) {
        let obj = {};
        seatInfo.forEach((bookSale) => {
          const prodCode = data.bookingIds.find(
            (booking) => parseInt(booking.bookingId) === bookSale.BookingId,
          ).prodCode;
          const seats = bookSale.Seats === null ? 0 : bookSale.Seats;
          const value = bookSale.ValueWithCurrencySymbol === '' ? 'No Sales' : bookSale.ValueWithCurrencySymbol;
          const date = bookSale.SetSalesFiguresDate === '' ? '-' : formatInputDate(bookSale.SetSalesFiguresDate);
          obj = {
            ...obj,
            [prodCode + '_seats']: seats,
            [prodCode + '_saleValue']: value,
            [prodCode + '_date']: date,
          };
        });
        return obj;
      })(sale.data),
    });
  });

  // set final week number to the word Final
  tempRowData[tempRowData.length - 1].week = 'Final';

  // return the column definations and the rowData to be displayed
  return { columnDef: tempColDef, rowData: tempRowData, excelStyles };
};

export default salesComparison;
