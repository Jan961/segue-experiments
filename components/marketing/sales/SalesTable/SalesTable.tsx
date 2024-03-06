import classNames from 'classnames';
import DefaultCellRenderer from 'components/bookings/table/DefaultCellRenderer';
import Table from 'components/core-ui-lib/Table';
import { Spinner } from 'components/global/Spinner';
import { tileColors } from 'config/global';
import useAxios from 'hooks/useAxios';
import { useEffect, useState } from 'react';
import formatInputDate from 'utils/dateInputFormat';

type Booking = {
  BookingId: number;
  order: number;
  prodCode: string;
  prodName: string;
  numPerfs: number;
}

interface SalesTableProps {
  module: string;
  containerWidth: string;
  containerHeight: string;
  bookings: Array<Booking>
}

export default function SalesTable({
  module = 'bookings',
  containerHeight,
  containerWidth,
  bookings
}: Partial<SalesTableProps>) {

  const { fetchData } = useAxios();

  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);


  // set table style props based on module
  const styleProps = { headerColor: tileColors[module] }

  const gridOptions = {
    autoSizeStrategy: {
      type: 'fitGridWidth',
      defaultMinWidth: 50,
      wrapHeaderText: true,
    }
  }

  const bookingComparison = async (bookings: Array<Booking>) => {

    let tempRowData = [];
    let tempColDef = [];

    setLoading(true);

    fetchData({
      url: '/api/marketing/sales/read/archived',
      method: 'POST',
      data: { bookingIds: bookings.map(obj => obj.BookingId) },
    }).then((data: any) => {
      // prepare row data
      data.response.forEach(sale => {
        const dataIndex = tempRowData.findIndex(data => data.week === sale.SetBookingWeekNum);
        if (dataIndex === -1) {
          tempRowData.push({
            week: sale.SetBookingWeekNum,
            weekOf: formatInputDate(sale.SetProductionWeekDate, '/'),
            ...(function processData(data) {
              let obj = {};
              data.forEach(bookSale => {
                const prodCode = bookings.find(booking => booking.BookingId === bookSale.BookingId).prodCode;
                const seats = bookSale.Seats === null ? 0 : bookSale.Seats;
                const value = bookSale.ValueWithCurrencySymbol === '' ? 'No Sales' : bookSale.ValueWithCurrencySymbol;
                obj = { ...obj, [prodCode + '_seats']: seats, [prodCode + '_saleValue']: value };
              });
              return obj;
            })(sale.data)
          });
        }
      });

      // prepare column definations
      bookings.forEach((booking, index) => {

        let parentBorderClass = 'border-b-2 border-white '
        if (index < bookings.length - 1) {
          parentBorderClass = parentBorderClass + 'border-r-4'
        }

        tempColDef.push(
          {
            sortingOrder: booking.order,
            headerName: booking.prodName,
            suppressResize: true,
            suppressMovable: true,
            resizable: false,
            headerClass: 'justify-center font-bold text-base ' + parentBorderClass,
            children: [{
              headerName: 'No. of Performances: ' + booking.numPerfs,
              suppressResize: true,
              suppressMovable: true,
              resizable: false,
              headerClass: 'justify-center font-bold text-base ' + parentBorderClass,
              children: [
                { headerName: 'Week', field: 'week', resizable: false, cellRenderer: DefaultCellRenderer, suppressMovable: true, headerClass: 'border-r-2 border-white text-center' },
                { headerName: 'Week Of', field: 'weekOf', resizable: false, cellRenderer: DefaultCellRenderer, suppressMovable: true, headerClass: 'border-r-2 border-white' },
                { headerName: 'Seats Sold', field: booking.prodCode + '_seats', resizable: false, cellRenderer: DefaultCellRenderer, suppressMovable: true, headerClass: 'border-r-2 border-white text-center' },
                { headerName: 'Sales Value', field: booking.prodCode + '_saleValue', resizable: false, cellRenderer: DefaultCellRenderer, suppressMovable: true, headerClass: index < bookings.length - 1 && 'border-r-2 border-white text-center' },
              ],
            },
            ]
          },
        )
      });

      // set the values and display the 
      setColumnDefs(tempColDef);
      setRowData(tempRowData);
      setLoading(false);

    }).catch((error) => console.log(error));

  }

  useEffect(() => {
    bookingComparison(bookings);
  }, [bookings])

  return (
    <div className={classNames(containerWidth, containerHeight)}>
      {loading ? (
        <div className="w-full h-full absolute left-0 top-0 bg-white flex items-center opacity-95">
          <Spinner className="w-full" size="lg" />
        </div>
      ) : (
        <div>
          <Table
            columnDefs={columnDefs}
            rowData={rowData}
            styleProps={styleProps}
            gridOptions={gridOptions}
          />
        </div>
      )}
    </div>
  );
}
