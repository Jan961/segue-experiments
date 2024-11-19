import React from 'react';
import { dateToPicker, dateToSimple, getKey, newDate } from 'services/dateService';
import { StyledDialog } from 'components/global/StyledDialog';
import { FormInputTextAttached } from 'components/global/forms/FormInputSetter';
import { useRecoilState, useRecoilValue } from 'recoil';
import { FormInfo } from 'components/global/forms/FormInfo';
import axios from 'axios';
import { FormInputDate } from 'components/global/forms/FormInputDate';
import { UpdateDateParams, UpdateDateResponse } from 'pages/api/bookings/update/date';
import { bookingState } from 'state/booking/bookingState';
import { distanceState } from 'state/booking/distanceState';
import { scheduleDictSelector } from 'state/booking/selectors/scheduleDictSelector';
import { performanceState } from 'state/booking/performanceState';
import { BookingDTO, PerformanceDTO } from 'interfaces';
import { DateViewModel } from 'state/booking/selectors/scheduleSelector';
import { differenceInDays, parseISO } from 'date-fns';
import { objectify, unique } from 'radash';
import { venueState } from 'state/booking/venueState';

interface ChangeBookingDateProps {
  bookingId: number;
  disabled?: boolean;
}

const shiftDates = (dates: string[], days: number): string[] => {
  return dates.map((date) => {
    const currentDate = newDate(date);
    currentDate.setDate(currentDate.getDate() + days);
    return currentDate.toISOString().split('T')[0];
  });
};

const getDatesRange = (performances: PerformanceDTO[]): string[] => {
  const dates = performances.map((performance) => newDate(getKey(performance.Date)).getTime());
  const minDate = newDate(Math.min(...dates));
  const maxDate = newDate(Math.max(...dates));

  const generateDates = (start: Date, end: Date): string[] => {
    const dateList: string[] = [];
    const currentDate = start;

    // eslint-disable-next-line no-unmodified-loop-condition
    while (currentDate <= end) {
      dateList.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateList;
  };

  return generateDates(minDate, maxDate);
};

export const ChangeBookingDate = ({ bookingId, disabled }: ChangeBookingDateProps) => {
  const scheduleDict = useRecoilValue(scheduleDictSelector);
  const [bookingDict, setBookingDict] = useRecoilState(bookingState);
  const [perfDict, setPerfDict] = useRecoilState(performanceState);
  const booking = bookingDict[bookingId];
  const venueDict = useRecoilValue(venueState);
  const [showModal, setShowModal] = React.useState(false);
  const [date, setDate] = React.useState(dateToPicker(booking.Date));
  const [loading, setLoading] = React.useState(false);
  const [distance, setDistance] = useRecoilState(distanceState);

  const fromDate = getKey(booking.Date);
  const toDate = getKey(date);

  React.useEffect(() => {
    setDate(dateToPicker(booking.Date));
  }, [bookingId, booking]);

  const handleOnSubmit = async (e: any) => {
    // Swap around the dates
    e.preventDefault();
    setLoading(true);

    const params: UpdateDateParams = {
      bookingId,
      date,
    };

    try {
      const { data } = await axios.post('/api/bookings/update/date', params);
      const { performances, bookings } = data as UpdateDateResponse;

      const newBookingState = { ...bookingDict, ...objectify(bookings, (x: BookingDTO) => x.Id) };
      const newPerfState = { ...perfDict, ...objectify(performances, (x: PerformanceDTO) => x.Id) };
      setBookingDict(newBookingState);
      setPerfDict(newPerfState);
      setDistance({ ...distance });
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleOnChange = (e: any) => {
    setDate(e.target.value);
  };

  // Validation
  const matchingPerformances = Object.values(perfDict).filter((x) => x.BookingId === bookingId);
  const existingDates = getDatesRange(matchingPerformances);
  const daysDiff = differenceInDays(parseISO(toDate), parseISO(fromDate));
  const newDates = shiftDates(existingDates, daysDiff);

  const conflicts = [];
  const errors = [];

  for (const date of newDates) {
    const match: DateViewModel = scheduleDict[date];
    if (match) {
      for (const perfId of match.PerformanceIds) {
        const perfMatch = perfDict[perfId];
        if (perfMatch.BookingId !== bookingId) {
          conflicts.push(perfMatch.BookingId);
        }
      }
      for (const bId of match.BookingIds) {
        if (bId !== bookingId) {
          conflicts.push(bId);
        }
      }
      if (match.GetInFitUpIds.length > 0 || match.OtherIds.length > 0 || match.RehearsalIds.length > 0) {
        errors.push('There are already non-booking events on these days');
      }
    } else {
      // Outside bounds. False
      errors.push('Event falls outside range of schedule.');
    }
  }

  const valid = errors.length === 0 && conflicts.length === 0;

  const modalDisabled = loading || dateToPicker(booking.Date) === dateToPicker(date);

  return (
    <>
      <FormInputTextAttached
        disabled={disabled}
        name="Date"
        value={dateToSimple(booking.Date)}
        onClick={() => setShowModal(true)}
      />
      <StyledDialog
        title={`Move Date: ${dateToSimple(booking.Date)}`}
        open={showModal}
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleOnSubmit}>
          <FormInfo intent="WARNING" header="Warning">
            <p>Changing a booking will move all related items to the new date.</p>
            <p className="mt-2">
              Moving this booking requires space for <b>{existingDates.length}</b> dates
            </p>
          </FormInfo>
          <FormInputDate label="New Date" value={date} onChange={handleOnChange} />
          {!valid && (
            <FormInfo intent="DANGER">
              <ul>
                {unique(conflicts).map((bId) => (
                  <li key={bId}>
                    Conflict: <b>{venueDict[bookingDict[bId]?.VenueId]?.Name}</b>
                  </li>
                ))}
                {unique(errors).map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            </FormInfo>
          )}
          <>
            <StyledDialog.FooterContainer>
              <StyledDialog.FooterCancel onClick={() => setShowModal(false)} />
              <StyledDialog.FooterContinue disabled={modalDisabled || !valid} submit>
                Change Date
              </StyledDialog.FooterContinue>
            </StyledDialog.FooterContainer>
          </>
        </form>
      </StyledDialog>
    </>
  );
};
