import { useEffect, useMemo, useState } from 'react';
import { LoadingTab } from '../LoadingTab';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import { NoDataWarning } from '../../NoDataWarning';
import { PerformanceSectionNotes } from './PerformanceSectionNotes';
import { FormInputCheckbox } from 'components/global/forms/FormInputCheckbox';
import { FormInputText } from 'components/global/forms/FormInputText';
import { debounce } from 'radash';
import { Table } from 'components/global/table/Table';
import { AllocatedSeatsEditor } from 'components/marketing/editors/AllocatedSeatsEditor';
import { dateToSimple, getTimeFromDateAndTime } from 'services/dateService';
import { FormInputButton } from 'components/global/forms/FormInputButton';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const defaultInputs = {
  CastRateTicketsArranged: false,
  CastRateTicketsNotes: '',
};

export const PromoterHoldsTab = () => {
  const [bookingJump, setBookingJump] = useRecoilState(bookingJumpState);
  const { selected } = bookingJump;
  const [inputs, setInputs] = useState(defaultInputs);
  const [loading, setLoading] = useState(true);
  const [performances, setPerformances] = useState([]);
  const [allocatedSeatsModalOpen, setAllocatedSeatsModalOpen] = useState(false);
  const [allocatedSeatsEditing, setAllocatedSeatsEditing] = useState(undefined);

  const selectedBooking = useMemo(
    () => bookingJump.bookings?.find?.((x) => x.Id === selected),
    [bookingJump.bookings, selected],
  );

  const search = async () => {
    if (selected) {
      setLoading(true);
      const { data } = await axios.get(`/api/marketing/promoterHolds/${selected}`);
      setPerformances(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    const { CastRateTicketsArranged, CastRateTicketsNotes } = selectedBooking || {};
    setInputs({ CastRateTicketsArranged, CastRateTicketsNotes });
  }, [bookingJump.selected]);

  useEffect(() => {
    search();
  }, [selected]);

  const updateBooking = (BookingId: number, payload: any) => {
    axios
      .put('/api/marketing/activities/booking/update', { Id: BookingId, ...payload })
      .then(() => {
        setBookingJump({
          ...bookingJump,
          bookings: bookingJump.bookings.map((booking) => {
            if (booking.Id === BookingId) {
              return { ...booking, ...payload };
            }
            return booking;
          }),
        });
      })
      .catch((error) => console.log('Error Updating booking', error));
  };
  const debouncedUpdateBooking = useMemo(() => debounce({ delay: 500 }, updateBooking), []);

  const handleChange = (e: any) => {
    setInputs((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    debouncedUpdateBooking(selectedBooking?.Id, { [e.target.id]: e.target.value });
  };

  const triggerClose = async (refresh: boolean) => {
    setAllocatedSeatsModalOpen(false);
    if (refresh) search();
  };

  const createAllocatedSeat = (acId, maxAllocation = 0) => {
    setAllocatedSeatsEditing({ AvailableCompId: acId, Seats: 0, maxAllocation });
    setAllocatedSeatsModalOpen(true);
  };

  const editAllocatedSeat = (as: any) => {
    setAllocatedSeatsEditing(as);
    setAllocatedSeatsModalOpen(true);
  };

  if (loading) return <LoadingTab />;

  if (performances.length === 0) return <NoDataWarning message="No performances for this booking." />;

  return (
    <>
      {/* Form Inputs for Cast Rate Tickets */}
      <br />
      {selectedBooking && (
        <>
          <FormInputCheckbox
            className="max-w-[250px]"
            label="CAST RATE TICKETS ARRANGED"
            name="CastRateTicketsArranged"
            onChange={handleChange}
            value={inputs.CastRateTicketsArranged}
          />
          <FormInputText
            area
            className="min-h-[75px] h-auto mb-6"
            label=""
            name="CastRateTicketsNotes"
            onChange={handleChange}
            value={inputs.CastRateTicketsNotes}
            disabled={!inputs.CastRateTicketsArranged}
          />
        </>
      )}

      {/* Render Performance Section Notes and other components as needed */}
      {performances.map((perf) => {
        const max = perf.totalAvailable - perf.totalAllocated;

        return (
          <div key={perf.id} className="bg-gray-200 rounded p-4 pt-2 mb-4">
            <PerformanceSectionNotes perf={perf} triggerSearch={search} />

            <div className="flex justify-end mt-2 pb-4">
              <FormInputButton
                text="Add Allocations"
                onClick={() => createAllocatedSeat(perf.availableCompId, max)}
                icon={faPlus}
                disabled={max === 0}
              />
            </div>
            {perf.allocated?.length > 0 && (
              <Table className="mb-8">
                <Table.HeaderRow>
                  <Table.HeaderCell>Date</Table.HeaderCell>
                  <Table.HeaderCell>Time</Table.HeaderCell>
                  <Table.HeaderCell>Name / Email</Table.HeaderCell>
                  <Table.HeaderCell>Requested</Table.HeaderCell>
                  <Table.HeaderCell>Comments</Table.HeaderCell>
                  <Table.HeaderCell>Seats</Table.HeaderCell>
                  <Table.HeaderCell>Allocated</Table.HeaderCell>
                  <Table.HeaderCell>Venue Confirmation Notes</Table.HeaderCell>
                </Table.HeaderRow>
                <Table.Body>
                  {perf.allocated.map((as) => (
                    <Table.Row key={as.Id} hover onClick={() => editAllocatedSeat(as)}>
                      <Table.Cell>{dateToSimple(perf.info.Date)}</Table.Cell>
                      <Table.Cell>{getTimeFromDateAndTime(perf.info.Date)}</Table.Cell>
                      <Table.Cell>
                        {as.TicketHolderName}
                        <br />
                        {as.TicketHolderEmail}
                      </Table.Cell>
                      <Table.Cell>{as.RequestedBy}</Table.Cell>
                      <Table.Cell>{as.Comments}</Table.Cell>
                      <Table.Cell>
                        <b>{as.Seats}</b>
                      </Table.Cell>
                      <Table.Cell>{as.SeatsAllocated}</Table.Cell>
                      <Table.Cell>{as.VenueConfirmationNotes}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            )}
          </div>
        );
      })}
      {allocatedSeatsModalOpen && (
        <AllocatedSeatsEditor
          open={allocatedSeatsModalOpen}
          triggerClose={triggerClose}
          allocatedSeat={allocatedSeatsEditing}
        />
      )}
    </>
  );
};
