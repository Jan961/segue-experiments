import { barringIssueColumnDefs, styleProps } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import Table from 'components/core-ui-lib/Table';
import { BarredVenue } from 'components/bookings/modal/NewBooking/reducer';
import { useEffect } from 'react';
import { useWizard } from 'react-use-wizard';
import { gridOptions } from '../../GapSuggest';

type BarringIssueViewProps = {
  barringConflicts?: BarredVenue[];
  updateModalTitle: (title: string) => void;
  nextStep: number;
  previousStep: number;
  onResetBooking?: () => void;
};

const barringGridOptions = {
  ...gridOptions,
  rowClassRules: {
    '!bg-primary-orange !bg-opacity-25': (params) => params?.data?.hasBarringConflict,
  },
};

export default function BarringIssueView({
  barringConflicts,
  updateModalTitle,
  previousStep,
  nextStep,
  onResetBooking,
}: BarringIssueViewProps) {
  const { goToStep } = useWizard();

  useEffect(() => {
    updateModalTitle('Barring Issue');
  }, []);

  const handleBackClick = () => {
    onResetBooking && onResetBooking();
    goToStep(previousStep);
  };

  return (
    <div className="flex flex-col">
      <span className="py-4 text-responsive-sm text-primary-input-text">
        A Barring Check has found potential issues
      </span>
      <div className="w-[634px] flex flex-col">
        <Table
          testId="barring-issue-table"
          columnDefs={barringIssueColumnDefs}
          rowData={barringConflicts}
          styleProps={styleProps}
          gridOptions={barringGridOptions}
        />
        <div className="pt-3 w-full flex items-center justify-end">
          <Button className="w-33" variant="secondary" text="Back" onClick={handleBackClick} />
          <Button className="ml-3 w-33" text="Continue" onClick={() => goToStep(nextStep)} />
        </div>
      </div>
    </div>
  );
}
