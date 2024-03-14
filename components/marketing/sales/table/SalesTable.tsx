import classNames from 'classnames';
import DefaultCellRenderer from 'components/bookings/table/DefaultCellRenderer';
import Table from 'components/core-ui-lib/Table';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { tileColors } from 'config/global';
=======
import { Spinner } from 'components/global/Spinner';
=======
>>>>>>> cb179e0 (restructed SalesTable component so its only used for processing the UI and does not complete any API request)
import { tileColors } from 'config/global';
import useAxios from 'hooks/useAxios';
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
import { Spinner } from 'components/global/Spinner';
import { tileColors } from 'config/global';
import useAxios from 'hooks/useAxios';
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
import { useEffect, useState } from 'react';
import formatInputDate from 'utils/dateInputFormat';
import { gridOptions, prodComparisionColDefs, salesColDefs } from './tableConfig';
import { useRecoilValue } from 'recoil';
<<<<<<< HEAD
<<<<<<< HEAD
=======
import { venueState } from 'state/booking/venueState';
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
import { venueState } from 'state/booking/venueState';
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
import { productionJumpState } from 'state/booking/productionJumpState';
import Button from 'components/core-ui-lib/Button';

type Booking = {
  BookingId: number;
  order: number;
  prodCode: string;
  prodName: string;
  numPerfs: number;
}

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
export type SalesTableVariant = 'prodComparision' | 'salesSnapshot' | 'salesComparison' | 'venue' | '';

=======
>>>>>>> dae467b (logic from Fri 8th for venue history merged with branch which was rebased with main yesterday)
=======
export type SalesTableVariant = 'prodComparision' | 'salesSnapshot' | 'salesComparison' | 'venue' | '';

>>>>>>> cb179e0 (restructed SalesTable component so its only used for processing the UI and does not complete any API request)
type Submit = {
  data: any;
  type: SalesTableVariant;
}

<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> dae467b (logic from Fri 8th for venue history merged with branch which was rebased with main yesterday)
=======

>>>>>>> cb179e0 (restructed SalesTable component so its only used for processing the UI and does not complete any API request)
export type ProdComp = {
  venueId: number;
  showCode: string;
}

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> cb179e0 (restructed SalesTable component so its only used for processing the UI and does not complete any API request)
export type SalesSubmit = {
  type: SalesTableVariant,
  data: any;
}

<<<<<<< HEAD
=======
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> cb179e0 (restructed SalesTable component so its only used for processing the UI and does not complete any API request)
interface SalesTableProps {
  module: string;
  containerWidth: string;
  containerHeight: string;
  variant: SalesTableVariant;
  data?: Array<Booking> | number | ProdComp;
  handleError?: () => void;
  primaryBtnTxt?: string;
  showPrimaryBtn?: boolean;
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  handlePrimaryBtnClick?: (data: Submit) => void;
=======
  handlePrimaryBtnClick?: (data: any) => void;
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
  handlePrimaryBtnClick?: (data: any) => void;
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
  handlePrimaryBtnClick?: (data: Submit) => void;
>>>>>>> dae467b (logic from Fri 8th for venue history merged with branch which was rebased with main yesterday)
  secondaryBtnText?: string;
  showSecondaryBtn?: boolean;
  handleSecondaryBtnClick?: () => void;
  showExportBtn?: boolean;
  backBtnTxt?: string;
  showBackBtn?: boolean;
  handleBackBtnClick?: () => void;
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  handleCellClick?: (e: any) => void;
  handleCellValChange?: (e: any) => void;
<<<<<<< HEAD
  cellRenderParams?: any;
}


export default function SalesTable({

=======
=======
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
  handleCellClick?: (e: any) => void;
>>>>>>> dae467b (logic from Fri 8th for venue history merged with branch which was rebased with main yesterday)
=======
>>>>>>> 442b778 (flow complete - ready for partial PR)
}


export default function SalesTable({
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======

>>>>>>> cb179e0 (restructed SalesTable component so its only used for processing the UI and does not complete any API request)
  module = 'bookings',
  containerHeight,
  containerWidth,
  variant,
  data,
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  primaryBtnTxt,
  showPrimaryBtn = false,
  handlePrimaryBtnClick,
  secondaryBtnText,
  showSecondaryBtn = false,
  handleSecondaryBtnClick,
  showExportBtn = false,
  backBtnTxt,
  showBackBtn,
  handleBackBtnClick,
  handleCellClick,
  handleCellValChange,
  cellRenderParams,
}: Partial<SalesTableProps>,
) {

  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [response, setResponse] = useState<Submit>({ type: '', data: [] });
  const { productions } = useRecoilValue(productionJumpState);
=======
=======
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
  handleError,
=======
>>>>>>> cb179e0 (restructed SalesTable component so its only used for processing the UI and does not complete any API request)
  primaryBtnTxt,
  showPrimaryBtn = false,
  handlePrimaryBtnClick,
  secondaryBtnText,
  showSecondaryBtn = false,
  handleSecondaryBtnClick,
  showExportBtn = false,
  backBtnTxt,
  showBackBtn,
  handleBackBtnClick,
  handleCellClick,
  handleCellValChange,
}: Partial<SalesTableProps>,
) {

  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [response, setResponse] = useState<Submit>({ type: '', data: [] });
  const { productions } = useRecoilValue(productionJumpState);
<<<<<<< HEAD
  const [errorMessage, setErrorMessage] = useState('');
<<<<<<< HEAD

  const [response, setResponse] = useState([]);
<<<<<<< HEAD
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
  const [response, setResponse] = useState<Submit>();
>>>>>>> dae467b (logic from Fri 8th for venue history merged with branch which was rebased with main yesterday)
=======
>>>>>>> cb179e0 (restructed SalesTable component so its only used for processing the UI and does not complete any API request)

  // set table style props based on module
  const styleProps = { headerColor: tileColors[module] }

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  const salesSnapshot = (data: any) => {

    let tempRowData = [];

    data.forEach(week => {
      tempRowData.push({
        week: week.week,
        weekOf: formatInputDate(week.weekOf),
        seatsSold: week.seatsSold,
        seatsSalePercentage: (week.seatsSalePercentage).toFixed(2) + '%',
        reserved: week.reserved === '' ? 0 : week.reserved,
        reservedPercentage: week.reserved === '' ? '0.00%' : ((parseInt(week.reserved) / week.capacity) * 100).toFixed(2) + '%',
        totalValue: week.venueCurrencySymbol + (week.totalValue).toFixed(2),
        valueChange: week.venueCurrencySymbol + (parseInt(week.valueChange)).toFixed(2),
        seatsChange: week.seatsChange,
        totalHolds: week.totalHolds === null ? 0 : week.totalHolds,
        isSingleSeats: week.isSingleSeats,
        isNotOnSale: week.isNotOnSale,
        isBrochureReleased: week.isBrochureReleased
      })
    });

    setRowData(tempRowData);
    setColumnDefs(salesColDefs);
  }


  const salesComparison = (data: any, bookings) => {
    let tempRowData = [];
    let tempColDef = [];

const weekColumn = {
  headerName: 'Wk', // Empty header name
  field: 'week',
  cellRenderer: DefaultCellRenderer,
  suppressMovable: true,
  headerClass: 'custom-pinned-header', // Make header transparent
  pinned: 'left',
  lockPinned: true,
  width: 80,
  resizable: false
};

// Add the 'Week' column as a pinned column on the left
tempColDef.push(weekColumn);

// Prepare the rest of the column definitions based on bookings
bookings.forEach((booking, index) => {
  let borderClasses = 'border-b-2 border-white';
  if (index < bookings.length - 1) {
    borderClasses += ' border-r-4';
  }

  // Define the main column group for each booking
  let mainColGroup = {
    headerName: booking.prodName + ' ' + booking.prodCode,
    headerGroupComponent: 'AGGridHeaderGroupComponent',
    headerClass: 'justify-center font-bold text-base ' + borderClasses,
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
            resizable: false
          },
          {
            headerName: 'Seats Sold',
            field: booking.prodCode + '_seats',
            cellRenderer: DefaultCellRenderer,
            suppressMovable: true,
            headerClass: 'border-r-[1px] border-white text-center',
            width: 80,
            resizable: false
          },
          {
            headerName: 'Sales Value',
            field: booking.prodCode + '_saleValue',
            cellRenderer: DefaultCellRenderer,
            suppressMovable: true,
            headerClass: 'text-center' + (index < bookings.length - 1 ? ' border-r-4 border-white' : ''),
            width: 120,
            resizable: false
          },
        ],
      },
    ],
  };

  // Push the main column group onto the tempColDef array
  tempColDef.push(mainColGroup);
});
  
    // Processing the row data
    data.forEach(sale => {
      tempRowData.push({
        week: sale.SetBookingWeekNum,
        weekOf: formatInputDate(sale.SetProductionWeekDate),
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
    });
  
    // Set the columnDefs and rowData in your state or whatever you use to update the AG Grid
    setColumnDefs(tempColDef);
    setRowData(tempRowData);
  }
  

  const productionComparision = (data: any) => {

    const processedBookings = [];
    data.forEach(booking => {
      const production = productions.find(production => production.Id === booking.ProductionId);

      processedBookings.push({
        BookingId: booking.BookingId,
        prodName: production.ShowCode + production.Code + ' ' + production.ShowName,
        firstPerfDt: formatInputDate(booking.BookingFirstDate),
        numPerfs: booking.performanceCount,
        prodWks: booking.ProductionLengthWeeks,
        prodCode: booking.FullProductionCode
      });
    });

    setRowData(processedBookings);
    setColumnDefs(prodComparisionColDefs(data.length, handleCellValChange, cellRenderParams.selected));
    setResponse({ type: 'prodComparision', data: [] })

  }

  useEffect(() => {
    exec(variant, data);
  }, [variant]);

  const exec = (variant: string, data) => {

   

    switch (variant) {
      case 'salesComparison':
        salesComparison(data.tableData, data.bookingIds)
        break;

      case 'salesSnapshot':
=======
=======
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
  const onSubmit = () => {
    switch (response.type) {
      // case 'prodComparision':
      //   if (response.data.length < 2) {
      //     setErrorMessage('Please select at least 2 venues for comparison.')
      //   } else {
      //     handlePrimaryBtnClick(response);
      //   }
      default:
        handlePrimaryBtnClick(response);
    }
  }

  const salesSnapshot = (data: any) => {

    console.log('make it to salesTable')
    console.log(data)

    let tempRowData = [];

    data.forEach(week => {
      tempRowData.push({
        week: week.week,
        weekOf: formatInputDate(week.weekOf),
        seatsSold: week.seatsSold,
        seatsSalePercentage: (week.seatsSalePercentage).toFixed(2) + '%',
        reserved: week.reserved === '' ? 0 : week.reserved,
        reservedPercentage: week.reserved === '' ? '0.00%' : ((parseInt(week.reserved) / week.capacity) * 100).toFixed(2) + '%',
        totalValue: week.venueCurrencySymbol + (week.totalValue).toFixed(2),
        valueChange: week.venueCurrencySymbol + (parseInt(week.valueChange)).toFixed(2),
        seatsChange: week.seatsChange,
        totalHolds: week.totalHolds === null ? 0 : week.totalHolds
      })
    });

    setRowData(tempRowData);
    setColumnDefs(salesColDefs);
  }



  const salesComparison = (data: any, bookings) => {
    let tempRowData = [];
    let tempColDef = [];

    data.forEach(sale => {
        tempRowData.push({
          week: sale.SetBookingWeekNum,
          weekOf: formatInputDate(sale.SetProductionWeekDate),
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
    });

    /// prepare column definations
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
              { headerName: 'Week', field: 'week', resizable: false, cellRenderer: DefaultCellRenderer, suppressMovable: true, headerClass: 'border-r-[1px] border-white text-center' },
              { headerName: 'Date', field: 'weekOf', resizable: false, cellRenderer: DefaultCellRenderer, suppressMovable: true, headerClass: 'border-r-[1px] border-white' },
              { headerName: 'Seats Sold', field: booking.prodCode + '_seats', resizable: false, cellRenderer: DefaultCellRenderer, suppressMovable: true, headerClass: 'border-r-[1px] border-white text-center' },
              { headerName: 'Sales Value', field: booking.prodCode + '_saleValue', resizable: false, cellRenderer: DefaultCellRenderer, suppressMovable: true, headerClass: index < bookings.length - 1 && 'border-r-4 border-white text-center' },
            ],
          },
          ]
        },
      )
    });

    // set the values and display the 
    setColumnDefs(tempColDef);
    setRowData(tempRowData);
  }

  const productionComparision = (data: any) => {

    const processedBookings = [];
    data.forEach(booking => {
      const production = productions.find(production => production.Id === booking.ProductionId);

      processedBookings.push({
        BookingId: booking.BookingId,
        prodName: production.ShowCode + production.Code + ' ' + production.ShowName,
        firstPerfDt: formatInputDate(booking.BookingFirstDate),
        numPerfs: booking.performanceCount,
        prodWks: booking.ProductionLengthWeeks,
        prodCode: booking.FullProductionCode
      });
    });

<<<<<<< HEAD
  const exec = (variant: string, data: any) => {
    switch (variant) {
      case 'salesComparison':
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
        console.log({ function: 'salesComparison', data: data })
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> b3eedf3 (a few fixes to ensure vercel can successfully build when merging)
=======
        console.log({ function: 'salesComparison', data: data })
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
        salesComparison(data);
        break;

      case 'salesSnapshot':
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        console.log({ function: 'salesSnapshot', data: data })
>>>>>>> 9e52513 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> c4ebbe1 (a few fixes to ensure vercel can successfully build when merging)
=======
        console.log({ function: 'salesSnapshot', data: data })
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> b3eedf3 (a few fixes to ensure vercel can successfully build when merging)
=======
        console.log({ function: 'salesSnapshot', data: data })
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
        salesSnapshot(data);
        break;

      case 'prodComparision':
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
        console.log({ function: 'prodComparision', data: data })
>>>>>>> 9e52513 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> c4ebbe1 (a few fixes to ensure vercel can successfully build when merging)
=======
        console.log({ function: 'prodComparision', data: data })
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> b3eedf3 (a few fixes to ensure vercel can successfully build when merging)
=======
        console.log({ function: 'prodComparision', data: data })
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
        productionComparision(data);
        break;
    }
=======
    setRowData(processedBookings);
    setColumnDefs(prodComparisionColDefs(data.length, handleCellValChange));
    setResponse({ type: 'prodComparision', data: [] })

>>>>>>> cb179e0 (restructed SalesTable component so its only used for processing the UI and does not complete any API request)
  }

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  return (
    <div className={classNames(containerWidth, containerHeight)}>
      <div>
        <Table
          columnDefs={columnDefs}
          rowData={rowData}
          styleProps={styleProps}
          gridOptions={gridOptions}
          onCellClicked={handleCellClick}
          onCellValueChange={handleCellValChange}
        />

        {/* <div className='float-left flex flex-row mt-5 text-primary-red'>
        {errorMessage}
      </div> */}

        <div className='float-right flex flex-row mt-5'>
          {showBackBtn && (
            <div>
              <Button
                className="w-32"
                variant='secondary'
                text={backBtnTxt}
                onClick={handleBackBtnClick}
              />
            </div>
          )}

          {showSecondaryBtn && (
            <div>
              <Button
                className="ml-4 w-32"
                onClick={handleSecondaryBtnClick}
                variant={showExportBtn ? 'primary' : 'secondary'}
                text={secondaryBtnText}
                iconProps={showExportBtn && { className: 'h-4 w-3' }}
                sufixIconName={showExportBtn && 'excel'}
              />
            </div>
          )}

          {showPrimaryBtn && (
            <div>
              <Button
                className="ml-4 w-32"
                variant='primary'
                text={primaryBtnTxt}
                onClick={() => handlePrimaryBtnClick(response)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

=======
=======
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
  useEffect(() => {
    exec(variant, data);
  }, [variant]);

const exec = (variant: string, data) => {

  console.log(variant)
  console.log(data)

  switch (variant) {
    case 'salesComparison':
      salesComparison(data.tableData, data.bookingIds)
      break;

    case 'salesSnapshot':
      salesSnapshot(data);
      break;

    case 'prodComparision':
      productionComparision(data);
      break;
  }
}
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 9e52513 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======

return (
  <div className={classNames(containerWidth, containerHeight)}>
    <div>
      <Table
        columnDefs={columnDefs}
        rowData={rowData}
        styleProps={styleProps}
        gridOptions={[gridOptions,]}
        onCellClicked={handleCellClick}
        onCellValueChange={handleCellValChange}
      />

      {/* <div className='float-left flex flex-row mt-5 text-primary-red'>
        {errorMessage}
      </div> */}

      <div className='float-right flex flex-row mt-5'>
        {showBackBtn && (
          <div>
            <Button
              className="w-32"
              variant='secondary'
              text={backBtnTxt}
              onClick={handleBackBtnClick}
            />
          </div>
        )}

        {showSecondaryBtn && (
          <div>
            <Button
              className="ml-4 w-32"
              onClick={handleSecondaryBtnClick}
              variant={showExportBtn ? 'primary' : 'secondary'}
              text={secondaryBtnText}
              iconProps={showExportBtn && { className: 'h-4 w-3' }}
              sufixIconName={showExportBtn && 'excel'}
            />
          </div>
        )}

        {showPrimaryBtn && (
          <div>
            <Button
              className="ml-4 w-32"
              variant='primary'
              text={primaryBtnTxt}
              onClick={onSubmit}
            />
          </div>
        )}
      </div>
    </div>
  </div>
);
}

>>>>>>> cb179e0 (restructed SalesTable component so its only used for processing the UI and does not complete any API request)
