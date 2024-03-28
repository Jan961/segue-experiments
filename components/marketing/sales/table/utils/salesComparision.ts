import { SalesComp } from 'components/bookings/modal/VenueHistory';
import DefaultCellRenderer from 'components/bookings/table/DefaultCellRenderer';
import formatInputDate from 'utils/dateInputFormat';

const salesComparison = async (data: SalesComp) => {
  const tempRowData = [];
  const tempColDef = [];

  const weekColumn = {
    headerName: 'Wk', // Empty header name
    field: 'week',
    cellRenderer: DefaultCellRenderer,
    suppressMovable: true,
    headerClass: 'custom-pinned-header', // Make header transparent
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
      headerName: booking.prodName + ' ' + booking.prodCode,
      headerGroupComponent: 'AGGridHeaderGroupComponent',
      headerClass: 'justify-center font-bold text-base ' + borderClasses,
      sortable: false,
      children: [
        {
          headerName: 'No. of Performances: ' + booking.numPerfs,
          headerClass: 'justify-center font-bold text-base ' + borderClasses,
          marryChildren: true,
          children: [
            {
              headerName: 'Date',
              field: 'weekOf',
              cellRenderer: DefaultCellRenderer,
              suppressMovable: true,
              headerClass: 'border-r-[1px] border-white',
              width: 100,
              resizable: false,
              sortable: false,
            },
            {
              headerName: 'Seats Sold',
              field: booking.prodCode + '_seats',
              cellRenderer: DefaultCellRenderer,
              suppressMovable: true,
              headerClass: 'border-r-[1px] border-white text-center',
              width: 80,
              resizable: false,
              sortable: false,
            },
            {
              headerName: 'Sales Value',
              field: booking.prodCode + '_saleValue',
              cellRenderer: DefaultCellRenderer,
              suppressMovable: true,
              headerClass: 'text-center' + (index < data.bookingIds.length - 1 ? ' border-r-4 border-white' : ''),
              width: 120,
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
      weekOf: formatInputDate(sale.SetProductionWeekDate),
      ...(function processData(seatInfo) {
        let obj = {};
        seatInfo.forEach((bookSale) => {
          const prodCode = data.bookingIds.find(
            (booking) => parseInt(booking.bookingId) === bookSale.BookingId,
          ).prodCode;
          const seats = bookSale.Seats === null ? 0 : bookSale.Seats;
          const value = bookSale.ValueWithCurrencySymbol === '' ? 'No Sales' : bookSale.ValueWithCurrencySymbol;
          obj = { ...obj, [prodCode + '_seats']: seats, [prodCode + '_saleValue']: value };
        });
        return obj;
      })(sale.data),
    });
  });

  // return the column definations and the rowData to be displayed
  return { columnDef: tempColDef, rowData: tempRowData };
};

export default salesComparison;
