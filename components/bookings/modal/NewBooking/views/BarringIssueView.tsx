import { barringIssueColumnDefs, styleProps } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import Table from 'components/core-ui-lib/Table';
import { steps } from 'config/AddBooking';
import { BookingWithVenueDTO } from 'interfaces';
import { useEffect } from 'react';
import { useWizard } from 'react-use-wizard';
import { useSetRecoilState } from 'recoil';
import { newBookingState } from 'state/booking/newBookingState';

const rows = [
  { venue: 'Alhambra, Dunfermline', date: '02/02/24', miles: '56' },
  { venue: 'Alhambra, Dunfermline', date: '02/02/24', miles: '02' },
  { venue: 'Alhambra, Dunfermline', date: '02/02/24', miles: '73' },
  { venue: 'Alhambra, Dunfermline', date: '02/02/24', miles: '19' },
];

type BarringIssueViewProps = {
  bookingConflicts?: BookingWithVenueDTO[];
};

export default function BarringIssueView({ bookingConflicts }: BarringIssueViewProps) {
  const { previousStep, activeStep, goToStep } = useWizard();
  const setViewHeader = useSetRecoilState(newBookingState);

  useEffect(() => {
    setViewHeader({ stepIndex: activeStep });
  }, [activeStep]);

  const gridOptions = {
    autoSizeStrategy: {
      type: 'fitGridWidth',
      defaultMinWidth: 50,
    },
  };

  const goToPreviousStep = () => {
    if (bookingConflicts?.length > 0) {
      previousStep();
    } else {
      goToStep(steps.indexOf('Create New Booking'));
    }
  };

  return (
    <div className="flex flex-col">
      <span className="py-4 text-responsive-sm text-primary-input-text">
        A Barring Check has found potential issues
      </span>
      <div className="w-[634px] flex flex-col">
        <Table columnDefs={barringIssueColumnDefs} rowData={rows} styleProps={styleProps} gridOptions={gridOptions} />
        <div className="py-3 w-full flex items-center justify-end">
          <Button className="w-33" variant="secondary" text="Back" onClick={goToPreviousStep} />
          <Button
            className="ml-3 w-33"
            text="Continue"
            onClick={() => goToStep(steps.indexOf('New Booking Details'))}
          />
        </div>
      </div>
    </div>
  );
}
