import { useEffect, useMemo, useState } from 'react';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Typeahead from 'components/core-ui-lib/Typeahead';
import { bookingState } from 'state/booking/bookingState';
import { useRecoilValue } from 'recoil';
import { venueState } from 'state/booking/venueState';
import classNames from 'classnames';
import Button from 'components/core-ui-lib/Button';
import { Spinner } from 'components/global/Spinner';
import useAxios from 'hooks/useAxios';
import { useRouter } from 'next/router';
import Table from 'components/core-ui-lib/Table';
import { venueHistCompColumnDefs, styleProps } from '../table/tableConfig';
import formatInputDate from 'utils/dateInputFormat';
import { Table as OldTable } from 'components/global/table/Table';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import { productionJumpState } from 'state/booking/productionJumpState';
import { dateToSimple } from 'services/dateService';
import { GridApi, ValueService } from 'ag-grid-community';

interface VenueHistoryProps {
  visible: boolean;
  onCancel: () => void;
}

export const VenueHistory = ({ visible = false, onCancel }: VenueHistoryProps) => {
  const { fetchData } = useAxios();
  const router = useRouter();

  const [showVenueSelectModal, setShowVenueSelect] = useState<boolean>(visible);
  const [showCompSelectModal, setShowCompSelect] = useState<boolean>(false);
  const [showResultsModal, setShowResults] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  // const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [bookings, setBookings] = useState([]);
  const [prodList, setProdList] = useState<any[]>([]);
  const [bookingIds, setBookingIds] = useState([]);
  const [rowData, setRowData] = useState([]);
  const { productions } = useRecoilValue(productionJumpState);
  const [resultColDefs, setResultColDefs] = useState([]);
  const [resultData, setResultData] = useState([]);
  

  const bookingDict = useRecoilValue(bookingState);
  const venueDict = useRecoilValue(venueState);


  const handleModalCancel = () => onCancel?.();

  const [venueId, setVenueId] = useState<number>(0);
  const [venueDesc, setVenueDesc] = useState<string>('');


  const VenueOptions = useMemo(() => {
    const options = [];
    const currentProductionVenues = Object.values(bookingDict).map((booking) => booking.VenueId);
    for (const venueId in venueDict) {
      const venue = venueDict[venueId];
      const option = {
        text: `${venue.Code} ${venue?.Name} ${venue?.Town}`,
        value: venue?.Id,
      };
      if (currentProductionVenues.includes(parseInt(venueId, 10))) {
        continue;
      }
      options.push(option);
    }
    return options;
  }, [venueDict, bookingDict]);


  useEffect(() => {
    setShowVenueSelect(visible);
  }, [visible]);

  const gridOptions = {
    autoSizeStrategy: {
      type: 'fitGridWidth',
      defaultMinWidth: 50,
      wrapHeaderText: true,
    },
  };

  const getBookingSales = async (bookingIds, productions) => {
    setLoading(true);
    fetchData({
      url: '/api/marketing/sales/read/archived',
      method: 'POST',
      data: { bookingIds: bookingIds.map(obj => obj.BookingId) },
    }).then((data: any) => {
      prepareFinalRowData(data.response)
      prepareFinalColDef()
      setLoading(false)
    }).catch((error) => console.log(error));

  }


  const goToVenueSelection = (venueID: number) => {
    const venue = venueDict[venueID];
    // setSelectedVenue(venue);
    setVenueDesc(venue.Code + ' ' + venue.Name + ' ' + venue.Town);
    setShowVenueSelect(false);
    setShowCompSelect(true);

    prepareBookingSection(venue);
  }

  const prepareBookingSection = async (venue) => {
    setLoading(true);
    try {
      fetchData({
        url: '/api/marketing/archivedSales/bookingSelection',
        method: 'POST',
        data: {
          salesByType: 'venue',
          venueCode: venue.Code,
          showCode: router.query.ShowCode // probably a better way of getting this now, if required
        },
      }).then((data: any) => {
        const processedBookings = [];

        setBookings(data)
        data.forEach(booking => {
          const production = productions.find(production => production.Id === booking.ProductionId)
          processedBookings.push({
            BookingId: booking.BookingId,
            prodName: production.ShowCode + production.Code + ' ' + production.ShowName,
            firstPerfDt: formatInputDate(booking.BookingFirstDate, '/'),
            numPerfs: 0, //need to find out where to get this
            prodWks: booking.ProductionLengthWeeks
          });
        });

        setRowData(processedBookings);
      })


    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const prepareFinalRowData = (bookingData) => {
    const finalData = [];

    bookingData.forEach(sale => {
      const dataIndex = finalData.findIndex(data => data.week === sale.SetBookingWeekNum);
      if(dataIndex === -1){
        finalData.push({
          week: sale.SetBookingWeekNum,
          weekOf: formatInputDate(sale.SetProductionWeekDate, '/'),
          ...processData(sale.data)
        });
      } 
    });

    setResultData(finalData);
  }

  const prepareFinalColDef = () => {
    let colDef = [];

    bookingIds.forEach(booking => {
      const prodCode = bookings.find(bookList => bookList.BookingId === booking.BookingId).FullProductionCode;
      colDef.push(
        { 
          sortingOrder: booking.order,
          headerName: prodCode,
          suppressResize: true,
          resizable: false,
          children: [{
            headerName: 'No. of Performances',
            suppressResize: true,
            resizable: false,
            children: [
              { headerName: 'Week', field: 'week' },
              { headerName: 'Week Of', field: 'weekOf' },
              { headerName: 'Seats Sold', field: prodCode + '_seats' },
              { headerName: 'Sales Value', field: prodCode + '_saleValue', resizable: false, },
            ], 
          },
        ]
        },
      )
    });

   const sortedColumnDefs = colDef.sort((a, b) => a.sortingOrder - b.sortingOrder);
   setResultColDefs(sortedColumnDefs)
  }
  

const processData = (data) => {
  let obj = {}
  data.forEach(bookSale => {
    console.log(bookSale)
    const prodCode = bookings.find(booking => booking.BookingId === bookSale.BookingId).FullProductionCode;
    const seats = bookSale.Seats === null ? 0 : bookSale.Seats;
    const value = bookSale.ValueWithCurrencySymbol === '' ? 'No Sales' : bookSale.ValueWithCurrencySymbol;
    obj = {...obj, [prodCode + '_seats']: seats, [prodCode + '_saleValue']: value }
  });

  return obj;
}

  const selectForComparison = (selectedValue) => {
    let tempIds = bookingIds;
    if (selectedValue.order === null) {
      const bookingToDel = tempIds.findIndex(booking => booking.BookingId === selectedValue.BookingId);
      if (bookingToDel > -1) {
        tempIds.splice(bookingToDel, 1);
        setBookingIds(tempIds);

        let tempProds = prodList;
        const prodToDel = tempProds.findIndex(production => production.BookingId === selectedValue.BookingId);
        if (prodToDel > -1) {
          tempProds.splice(prodToDel, 1);
          setProdList(tempProds);
        }
      }
    } else {
      const itemPresent = tempIds.findIndex(booking => booking === selectedValue.BookingId);
      if (itemPresent === -1) {
        tempIds.push({BookingId: selectedValue.BookingId, order: selectedValue.order});
        setBookingIds(tempIds);

        const tempProds = prodList;
        const production = bookings.find(production => production.BookingId === selectedValue.BookingId);
        tempProds.push(production);
        setProdList(tempProds);
      }
    }
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
  };

  const showResults = () => {
    getBookingSales(bookingIds, prodList);
    setShowCompSelect(false);
    setShowResults(true);
  }


  return (
    <div>
      <PopupModal
        show={showVenueSelectModal}
        title="Venue History"
        titleClass="text-xl text-primary-navy font-bold -mt-2"
        onClose={handleModalCancel}
      >
        <div className="w-[417px] h-[130px]">
          <div className="text text-primary-navy">Please select a venue for comparision</div>

          <Typeahead
            className={classNames('my-2 w-full !border-0 text-primary-navy')}
            options={VenueOptions}
            // disabled={stage !== 0}
            onChange={(value) => goToVenueSelection(parseInt(value as string, 10))}
            value={venueId}
            placeholder={'Please select a venue'}
            label="Venue"
          />

          <Button
            className="px-8 mt-4 float-right"
            onClick={handleModalCancel}
            variant="secondary"
            text={'Cancel'}
          ></Button>
        </div>
      </PopupModal>

      <PopupModal
        show={showCompSelectModal}
        title="Venue History"
        titleClass="text-xl text-primary-navy font-bold -mt-2"
        onClose={handleModalCancel}
      >
        <div className="w-[1000px] h-[532px]">
          <div className="text-xl text-primary-navy font-bold -mt-2">{venueDesc}</div>

          {loading && (
            <div className="w-full h-full absolute left-0 top-0 bg-white flex items-center opacity-95">
              <Spinner className="w-full" size="lg" />
            </div>
          )}
          <form onSubmit={handleOnSubmit}>
            <Table
              columnDefs={venueHistCompColumnDefs(bookings.length, selectForComparison)}
              rowData={rowData}
              styleProps={styleProps}
              gridOptions={gridOptions}
            />

            <div className='float-right flex flex-row mt-5'>
              <Button className="w-32" onClick={handleModalCancel} variant="secondary" text={'Cancel'} />
              <Button
                className="ml-4 w-32"
                variant={'primary'}
                text={'Compare'}
                onClick={showResults}
              />
            </div>


          </form>
        </div>
      </PopupModal>

      <PopupModal
        show={showResultsModal}
        title="Venue History"
        titleClass="text-xl text-primary-navy font-bold -mt-2"
        onClose={handleModalCancel}
      >

        <div className='w-[1123px] h-[734px]'>
          {loading ? (
            <div className="w-full h-full absolute left-0 top-0 bg-white flex items-center opacity-95">
              <Spinner className="w-full" size="lg" />
            </div>
          ) : (
            <div>
                <Table
              columnDefs={resultColDefs}
              rowData={resultData}
              styleProps={styleProps}
              gridOptions={gridOptions}
            />
          </div>
            )}
        </div>
      </PopupModal>
    </div>
  );
};
