import { bookingConflictsColumnDefs, styleProps } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import Table from 'components/core-ui-lib/Table';
import { useEffect, useMemo } from 'react';
import { useWizard } from 'react-use-wizard';
import { useSetRecoilState } from 'recoil';
import { newBookingState } from 'state/booking/newBookingState';
import { bookingStatusMap } from 'config/bookings';
import { dateToSimple } from 'services/dateService';
import { BookingWithVenueDTO } from 'interfaces';
import { steps } from 'config/AddBooking';

interface BookingConflictsViewProps {
  data?: BookingWithVenueDTO[];
  hasBarringIssues?: boolean;
}

export default function BookingConflictsView({ data, hasBarringIssues }: BookingConflictsViewProps) {
  const { nextStep, previousStep, activeStep, goToStep } = useWizard();
  const setViewHeader = useSetRecoilState(newBookingState);

  const rows = useMemo(
    () =>
      data?.map?.((b) => ({
        ...b,
        venue: b.Venue.Name,
        date: dateToSimple(b.Date),
        bookingStatus: bookingStatusMap[b.StatusCode],
      })),
    [data],
  );
  const confirmedBookings = useMemo(() => rows?.filter(({ bookingStatus }) => bookingStatus === 'Confirmed'), [rows]);

  useEffect(() => {
    setViewHeader({ stepIndex: activeStep });
  }, [activeStep]);

  const gridOptions = {
    autoSizeStrategy: {
      type: 'fitGridWidth',
      defaultMinWidth: 50,
    },
    getRowStyle: (params) => {
      return params.data.bookingStatus === 'Confirmed' ? { backgroundColor: 'rgba(236, 98, 85, 0.3)' } : '';
    },
  };

  const handleContinueClick = async () => {
    if (hasBarringIssues) {
      nextStep();
    } else {
      goToStep(steps.indexOf('New Booking Details'));
    }
  };

  return (
    <div className="flex flex-col">
      <span className="pb-2 text-responsive-sm text-primary-input-text">{`This booking would conflict with ${
        rows?.length || 0
      } bookings`}</span>
      <div className="w-[634px] max-h-[calc(100%-140px)] flex flex-col">
        <Table
          columnDefs={bookingConflictsColumnDefs}
          rowData={rows}
          styleProps={styleProps}
          gridOptions={gridOptions}
        />
      </div>
      <div className="pt-3 w-full flex items-center justify-end">
        <Button className="w-33" variant="secondary" text="Back" onClick={() => previousStep()} />
        <Button
          className="ml-3 w-33"
          text="Continue"
          onClick={handleContinueClick}
          disabled={confirmedBookings?.length > 0}
        />
      </div>
      {confirmedBookings && confirmedBookings.length > 0 && (
        <span className="w-full text-end text-responsive-sm text-primary-red mt-2">
          Warning! Booking clash with existing confirmed booking.
        </span>
      )}
    </div>
  );
}
