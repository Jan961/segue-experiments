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

interface VenueHistoryProps {
  visible: boolean;
  onCancel: () => void;
}

export const VenueHistory = ({ visible = false, onCancel }: VenueHistoryProps) => {
  const { fetchData } = useAxios();
  const router = useRouter();

  const [showVenueSelectModal, setShowVenueSelect] = useState<boolean>(visible);
  const [showCompSelectModal, setShowCompSelect] = useState<boolean>(false);
  // const [showResultsModal, setShowResults] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  // const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [bookings, setBookings] = useState([]);
  
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

  const goToVenueSelection = (venueID:number) => {
    const venue = venueDict[venueID];
    // setSelectedVenue(venue);
    setVenueDesc(venue.Code + ' ' + venue.Name + ' ' + venue.Town);
    setShowVenueSelect(false);
    setShowCompSelect(true);

    prepareBookingSection(venue).then((data) => {
      console.log(data);
    })
  }
  
  const prepareBookingSection = async (venue) => {
    setLoading(true);
    try {
      console.log({selectedVenue: venue, showCode: router.query.ShowCode})
      fetchData({
        url: '/api/marketing/archivedSales/bookingSelection',
        method: 'POST',
        data: { 
          salesByType: 'venue',
          venueCode: venue.Code,
          showCode: router.query.ShowCode // probably a better way of getting this now, if required
         },
      }).then((data:any) => {
        const processedBookings = [];
        data.forEach(booking => {
          processedBookings.push({
            prodNum: 'Production ' + booking.ProductionId,
            firstPerfDt: formatInputDate(booking.BookingFirstDate, '/'),
            numPerfs: 0, //need to find out where to get this
            prodWks: booking.ProductionLengthWeeks
          })
        });
        alert(JSON.stringify(processedBookings))
        setBookings(processedBookings);
        return data;
      })
    
      
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnSubmit = (e) => {
    // e.preventDefault();
    // const bookingIds = Object.keys(inputs)
    //   .sort((a, b) => inputs[a] - inputs[b])
    //   .filter((id) => inputs[id])
    //   .map((id) => parseInt(id, 10))
    //   .filter((id) => id);
    // const productions: any[] = bookingIds.map((bookingId: any) =>
    //   bookings.find((booking) => booking.BookingId === bookingId),
    // );
    // onSubmit(bookingIds, productions);

  };

  const handleCellClick = (e) => {
    console.log(e);
    // setBookingRow(e.data);
    // if (e.column.colId === 'notes') {
    //   setShowNotesModal(true);
    // }
  };

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
      <div className="w-[774px] h-[532px]">
        <div className="text-xl text-primary-navy font-bold -mt-2">{venueDesc}</div>

        {loading && (
            <div className="w-full h-full absolute left-0 top-0 bg-white flex items-center opacity-95">
              <Spinner className="w-full" size="lg" />
            </div>
          )}
          <form onSubmit={handleOnSubmit}>
            <div className="h-[50vh] overflow-auto">
                     <Table
                        columnDefs={venueHistCompColumnDefs(bookings.length)}
                        rowData={bookings}
                        styleProps={styleProps}
                       onCellClicked={handleCellClick}
                        //gridOptions={gridOptions}
                      />
              {/* {bookings.map((booking, i) => (
                <div className="flex items-center mt-6" key={i}>
                  <label htmlFor="date" className="text-lg font-medium mr-4">
                    {booking.FullProductionCode}(WEEKS: {booking.ProductionLengthWeeks})
                  </label>
                  <select
                    className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={inputs?.[booking?.BookingId]}
                    id={booking.BookingId}
                    name={booking.BookingId}
                   // onChange={handleOnChange}
                  >
                    <option value={null}>None</option>
                    {new Array(bookings.length).fill(0).map?.((_, j) => (
                      <option key={j} value={j + 1}>
                        {j + 1}
                      </option>
                    ))}
                  </select>
                  {JSON.stringify(booking)}
                </div>
              ))} */}
            </div>
            {/* <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => onClose()}
              >
                Close and Discard
              </button>
              <button
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="submit"
              >
                Apply
              </button>
            </div> */}
          </form>
      </div>
    </PopupModal>
    </div>
  );
};
