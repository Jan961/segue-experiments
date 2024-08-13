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

interface WeeklyPayDetailsProps {
  onChange: (data: any) => void;
  currencySymbol?: string;
}

const WeeklyPayDetails = ({ onChange = noop, currencySymbol = '£' }: WeeklyPayDetailsProps) => {
  const [weeklyPayDetails, setWeeklyPayDetails] = useState(defaultWeeklyPayDetails);
  const { rehearsalFee, rehearsalHolidayPay, performanceFee, performanceHolidayPay, touringAllowance, subsNotes } =
    defaultWeeklyPayDetails;
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
            testId="contract-details-first-day-work"
            placeholder="00.00"
            value={rehearsalFee}
            onChange={(event) => handleChange('rehearsalFee', event.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Label className="w-56 text-sm" text="Rehearsal Holiday Fee (per week)" />
        <div className="flex items-center">
          <Label className="text-sm" text={currencySymbol} />
          <TextInput
            testId="contract-details-first-day-work"
            placeholder="00.00"
            value={rehearsalHolidayPay}
            onChange={(event) => handleChange('rehearsalHolidayPay', event.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Label className="w-56 text-sm" text="Performance Fee (per week)" />
        <div className="flex items-center">
          <Label className="text-sm" text={currencySymbol} />
          <TextInput
            testId="contract-details-first-day-work"
            placeholder="00.00"
            value={performanceFee}
            onChange={(event) => handleChange('performanceFee', event.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Label className="w-56 text-sm" text="Performance Holiday Fee (per week)" />
        <div className="flex items-center">
          <Label className="text-sm" text={currencySymbol} />
          <TextInput
            testId="contract-details-first-day-work"
            placeholder="00.00"
            value={performanceHolidayPay}
            onChange={(event) => handleChange('performanceHolidayPay', event.target.value)}
          />
        </div>
      </div>
      <div className="flex items-start gap-2">
        <Label className="w-56 text-sm" text="Touring Allowance / Subs (per week)" />
        <div className="flex items-start">
          <Label className="text-sm" text={currencySymbol} />
          <div className="flex flex-col gap-2">
            <TextInput
              testId="contract-details-first-day-work"
              placeholder="00.00"
              value={touringAllowance}
              onChange={(event) => handleChange('touringAllowance', event.target.value)}
            />
            <TextInput
              testId="contract-details-first-day-work"
              placeholder="Subs Notes"
              value={subsNotes}
              onChange={(event) => handleChange('touringAllowance', event.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyPayDetails;
