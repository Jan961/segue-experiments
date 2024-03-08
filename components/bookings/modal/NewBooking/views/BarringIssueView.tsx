import { barringIssueColumnDefs, styleProps } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import Table from 'components/core-ui-lib/Table';
import { steps } from 'config/AddBooking';
import { BarredVenue } from 'pages/api/productions/venue/barred';
import { useEffect } from 'react';
import { useWizard } from 'react-use-wizard';
import { useSetRecoilState } from 'recoil';
import { newBookingState } from 'state/booking/newBookingState';

type BarringIssueViewProps = {
  barringConflicts?: BarredVenue[];
};

export default function BarringIssueView({ barringConflicts }: BarringIssueViewProps) {
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
    if (barringConflicts?.length > 0) {
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
        <Table
          columnDefs={barringIssueColumnDefs}
          rowData={barringConflicts}
          styleProps={styleProps}
          gridOptions={gridOptions}
        />
        <div className="pt-3 w-full flex items-center justify-end">
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
