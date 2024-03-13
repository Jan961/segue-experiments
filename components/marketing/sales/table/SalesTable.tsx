import classNames from 'classnames';
import DefaultCellRenderer from 'components/bookings/table/DefaultCellRenderer';
import Table from 'components/core-ui-lib/Table';
import { Spinner } from 'components/global/Spinner';
import { tileColors } from 'config/global';
import useAxios from 'hooks/useAxios';
import { useEffect, useState } from 'react';
import formatInputDate from 'utils/dateInputFormat';
import { gridOptions, prodComparisionColDefs, salesColDefs } from './tableConfig';
import { useRecoilValue } from 'recoil';
import { venueState } from 'state/booking/venueState';
import { productionJumpState } from 'state/booking/productionJumpState';
import Button from 'components/core-ui-lib/Button';

type Booking = {
  BookingId: number;
  order: number;
  prodCode: string;
  prodName: string;
  numPerfs: number;
}

type Submit = {
  data: any;
  type: SalesTableVariant;
}

export type ProdComp = {
  venueId: number;
  showCode: string;
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
}

type SalesTableVariant = 'prodComparision' | 'salesSnapshot' | 'salesComparison' | '';


export default function SalesTable({
  module = 'bookings',
  containerHeight,
  containerWidth,
  variant,
  data,
  handleError,
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
  handleCellValChange
}: Partial<SalesTableProps>) {

  const { fetchData } = useAxios();
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const venueDict = useRecoilValue(venueState);
  const { productions } = useRecoilValue(productionJumpState);
  const [errorMessage, setErrorMessage] = useState('');
  const [response, setResponse] = useState<Submit>();

  // set table style props based on module
  const styleProps = { headerColor: tileColors[module] }

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

  const salesSnapshot = (bookingId) => {
    let tempRowData = [];
    fetchData({
      url: '/api/marketing/sales/read/' + bookingId.toString(),
      method: 'GET'
    }).then((data: any) => {
      //I need some kind of wait function to ensure data is not undefined
      if (data !== undefined) {
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
        setResponse({type: 'salesSnapshot', data: []})
      }
    }).catch(error => console.log(error));
  }

  const salesComparison = async (bookings: Array<Booking>) => {
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
           // headerClass: 'justify-center font-bold text-base ', // + parentBorderClass,
            children: [{
              headerName: 'No. of Performances: ' + booking.numPerfs,
              suppressResize: true,
              suppressMovable: true,
              resizable: false,
              flex: 1,
              //headerClass: 'justify-center font-bold text-base ', //+ parentBorderClass,
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

    }).catch((error) => console.log(error));

  }

  const productionComparision = (prodComp: ProdComp) => {
    try {
      const venue = venueDict[prodComp.venueId];
      fetchData({
        url: '/api/marketing/archivedSales/bookingSelection',
        method: 'POST',
        data: {
          salesByType: 'venue',
          venueCode: venue.Code,
          showCode: prodComp.showCode
        },
      }).then((data: any) => {
        if (data.length > 0) {
          const processedBookings = [];
          data.forEach(booking => {
            const production = productions.find(production => production.Id === booking.ProductionId)

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
          setColumnDefs(prodComparisionColDefs(data.length, handleCellValChange));
          setResponse({type: 'prodComparision', data: []})

        } else {
          if (handleError) {
            handleError()
          }
        }
      });
    } catch (error: any) {
      console.error(error);
    }
  }

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
  }

  useEffect(() => {
    setResponse({type: '', data: []})
    exec(variant, data);
  }, [data, variant]);

  useEffect(() => {
    if (rowData.length !== 0 && columnDefs.length !== 0) {
      setLoading(false);
    }
  }, [rowData, columnDefs])

  return (
    <div className={classNames(containerWidth, loading ? 'h-[500px]' : containerHeight)}>
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
            gridOptions={[gridOptions, ]}
            onCellClicked={handleCellClick}
            onCellValueChange={handleCellValChange}
          />

          <div className='float-left flex flex-row mt-5 text-primary-red'>
            {errorMessage}
          </div>

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
      )}
    </div>
  );
}
