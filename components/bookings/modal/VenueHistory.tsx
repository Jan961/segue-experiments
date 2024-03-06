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
import { productionJumpState } from 'state/booking/productionJumpState';
import SalesTable from 'components/marketing/sales/SalesTable';

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
  const [bookings, setBookings] = useState([]);
  const [rowData, setRowData] = useState([]);
  const { productions } = useRecoilValue(productionJumpState);
  const [venueSelectView, setVenueSelectView] = useState<string>('select');

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

  const goToVenueSelection = (venueID: number) => {
    setVenueId(venueID);
    const venue = venueDict[venueID];
    setVenueDesc(venue.Code + ' ' + venue.Name + ' ' + venue.Town);
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
          showCode: router.query.ShowCode
        },
      }).then((data: any) => {
        if(data.length > 0){
        const processedBookings = [];
        data.forEach(booking => {
          const production = productions.find(production => production.Id === booking.ProductionId)

          processedBookings.push({
            BookingId: booking.BookingId,
            prodName: production.ShowCode + production.Code + ' ' + production.ShowName,
            firstPerfDt: formatInputDate(booking.BookingFirstDate, '/'),
            numPerfs: booking.performanceCount,
            prodWks: booking.ProductionLengthWeeks,
            prodCode: booking.FullProductionCode
          });
        });

        setRowData(processedBookings);
        setShowVenueSelect(false);
        setShowCompSelect(true);
      } else {
        setVenueSelectView('error');
      }
      });


    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const selectForComparison = (selectedValue) => {
    let tempIds = bookings;
    if (selectedValue.order === null) {
      const bookingToDel = tempIds.findIndex(booking => booking.BookingId === selectedValue.BookingId);
      if (bookingToDel > -1) {
        tempIds.splice(bookingToDel, 1);
        setBookings(tempIds);
      }
    } else {
      tempIds.push({
        BookingId: selectedValue.BookingId,
        order: selectedValue.order,
        prodCode: selectedValue.prodCode,
        prodName: selectedValue.prodName,
        numPerfs: selectedValue.numPerfs
      });
      setBookings(tempIds);
    }
  };



  const showResults = () => {
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

          {venueSelectView === 'select' ? (
            <div>
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

          ) : (
            <div>
              <div className="text text-primary-navy">
                There are no productions listed at this venue. <br />
                Please go back and select another venue to continue.
              </div>

              <div className='float-right flex flex-row mt-5'>
                <Button className="w-32" onClick={() => setVenueSelectView('select')} variant="secondary" text={'Back'} />
                <Button
                  className="ml-4 w-32"
                  variant='secondary'
                  text='Cancel'
                  onClick={handleModalCancel}
                />
              </div>
            </div>

          )}
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

          <Table
            columnDefs={venueHistCompColumnDefs(rowData.length, selectForComparison)}
            rowData={rowData}
            styleProps={styleProps}
            gridOptions={gridOptions}
          />

          <div className='float-right flex flex-row mt-5'>
            <Button className="w-32" onClick={handleModalCancel} variant="secondary" text={'Cancel'} />
            <Button
              className="ml-4 w-32"
              variant='primary'
              text='Compare'
              onClick={showResults}
            />
          </div>
        </div>
      </PopupModal>

      <PopupModal
        show={showResultsModal}
        title="Venue History"
        titleClass="text-xl text-primary-navy font-bold -mt-2"
        onClose={handleModalCancel}
      >

        <SalesTable
          containerHeight='h-[734px]'
          containerWidth='w-[1200px]'
          module='bookings'
          bookings={bookings}
        />
      </PopupModal>
    </div>
  );
};
