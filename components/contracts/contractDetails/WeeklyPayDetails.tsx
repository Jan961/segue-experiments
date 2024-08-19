import { useCallback, useState } from 'react';
import { Label, TextInput } from 'components/core-ui-lib';
import { noop } from 'utils';

const defaultWeeklyPayDetails = {
  rehearsalFee: 0,
  rehearsalHolidayPay: 0,
  performanceFee: 0,
  performanceHolidayPay: 0,
  touringAllowance: 0,
  subsNotes: '',
};

interface IWeeklyPayDetails {
  rehearsalFee: number;
  rehearsalHolidayPay: number;
  performanceFee: number;
  performanceHolidayPay: number;
  touringAllowance: number;
  subsNotes: string;
}

interface WeeklyPayDetailsProps {
  testId?: string;
  details?: Partial<IWeeklyPayDetails>;
  onChange: (data: any) => void;
  currencySymbol?: string;
}

const WeeklyPayDetails = ({
  onChange = noop,
  currencySymbol = '£',
  details = {},
  testId = 'weekly-payment',
}: WeeklyPayDetailsProps) => {
  const [weeklyPayDetails, setWeeklyPayDetails] = useState<IWeeklyPayDetails>({
    ...defaultWeeklyPayDetails,
    ...details,
  });
  const { rehearsalFee, rehearsalHolidayPay, performanceFee, performanceHolidayPay, touringAllowance, subsNotes } =
    weeklyPayDetails;
  const handleChange = useCallback(
    (key: string, value: number | string | boolean | null) => {
      const updatedData = { ...weeklyPayDetails, [key]: value };
      setWeeklyPayDetails(updatedData);
      onChange(updatedData);
    },
    [onChange, weeklyPayDetails, setWeeklyPayDetails],
  );
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Label className="w-56 text-sm" text="Rehearsal Fee (per week)" />
        <div className="flex items-center">
          <Label className="text-sm" text={currencySymbol} />
          <TextInput
            testId={`${testId}-reh-fee`}
            placeholder="00.00"
            value={rehearsalFee}
            type="number"
            onChange={(event) => handleChange('rehearsalFee', parseInt(event.target.value, 10))}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Label className="w-56 text-sm" text="Rehearsal Holiday Fee (per week)" />
        <div className="flex items-center">
          <Label className="text-sm" text={currencySymbol} />
          <TextInput
            testId={`${testId}-reh-hol-pay`}
            placeholder="00.00"
            type="number"
            value={rehearsalHolidayPay}
            onChange={(event) => handleChange('rehearsalHolidayPay', parseInt(event.target.value, 10))}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Label className="w-56 text-sm" text="Performance Fee (per week)" />
        <div className="flex items-center">
          <Label className="text-sm" text={currencySymbol} />
          <TextInput
            testId={`${testId}-perf-fee`}
            placeholder="00.00"
            type="number"
            value={performanceFee}
            onChange={(event) => handleChange('performanceFee', parseInt(event.target.value, 10))}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Label className="w-56 text-sm" text="Performance Holiday Fee (per week)" />
        <div className="flex items-center">
          <Label className="text-sm" text={currencySymbol} />
          <TextInput
            testId={`${testId}-perf-hol-fee`}
            placeholder="00.00"
            type="number"
            value={performanceHolidayPay}
            onChange={(event) => handleChange('performanceHolidayPay', parseInt(event.target.value, 10))}
          />
        </div>
      </div>
      <div className="flex items-start gap-2">
        <Label className="w-56 text-sm" text="Touring Allowance / Subs (per week)" />
        <div className="flex items-start">
          <Label className="text-sm" text={currencySymbol} />
          <div className="flex flex-col gap-2">
            <TextInput
              testId={`${testId}-touring-allowance`}
              placeholder="00.00"
              type="number"
              value={touringAllowance}
              onChange={(event) => handleChange('touringAllowance', parseInt(event.target.value, 10))}
            />
            <TextInput
              testId={`${testId}-subs-notes`}
              placeholder="Subs Notes"
              value={subsNotes}
              onChange={(event) => handleChange('subsNotes', event.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyPayDetails;
