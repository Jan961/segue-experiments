import classNames from 'classnames';
import DefaultCellRenderer from 'components/bookings/table/DefaultCellRenderer';
import Table from 'components/core-ui-lib/Table';
import { tileColors } from 'config/global';
import { useEffect, useState } from 'react';
import formatInputDate from 'utils/dateInputFormat';
import { gridOptions, prodComparisionColDefs, salesColDefs } from './tableConfig';
import { useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import Button from 'components/core-ui-lib/Button';

type Booking = {
  BookingId: number;
  order: number;
  prodCode: string;
  prodName: string;
  numPerfs: number;
}

export type SalesTableVariant = 'prodComparision' | 'salesSnapshot' | 'salesComparison' | 'venue' | '';

type Submit = {
  data: any;
  type: SalesTableVariant;
}


export type ProdComp = {
  venueId: number;
  showCode: string;
}

export type SalesSubmit = {
  type: SalesTableVariant,
  data: any;
}

interface SalesTableProps {
  module: string;
  containerWidth: string;
  containerHeight: string;
  variant: SalesTableVariant;
  data?: Array<Booking> | number | ProdComp;
  handleError?: () => void;
  primaryBtnTxt?: string;
  showPrimaryBtn?: boolean;
  handlePrimaryBtnClick?: (data: Submit) => void;
  secondaryBtnText?: string;
  showSecondaryBtn?: boolean;
  handleSecondaryBtnClick?: () => void;
  showExportBtn?: boolean;
  backBtnTxt?: string;
  showBackBtn?: boolean;
  handleBackBtnClick?: () => void;
  handleCellClick?: (e: any) => void;
  handleCellValChange?: (e: any) => void;
  cellRenderParams?: any;
}


export default function SalesTable({

  module = 'bookings',
  containerHeight,
  containerWidth,
  variant,
  data,
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

  // set table style props based on module
  const styleProps = { headerColor: tileColors[module] }

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
        salesSnapshot(data);
        break;

      case 'prodComparision':
        productionComparision(data);
        break;
    }
  }

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

