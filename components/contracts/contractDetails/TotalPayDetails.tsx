import { useCallback, useState } from 'react';
import { noop } from 'utils';
import { Label, TextInput } from 'components/core-ui-lib';

const defaultTotalPayDetails = {
  totalFee: 0,
  totalHolidayPay: 0,
  feeNotes: '',
};

interface TotalPayDetailsProps {
  onChange: (data: any) => void;
  currencySymbol?: string;
}

const TotalPayDetails = ({ onChange = noop, currencySymbol = '£' }: TotalPayDetailsProps) => {
  const [totalPayDetails, setTotalPayDetails] = useState(defaultTotalPayDetails);
  const { totalFee, totalHolidayPay, feeNotes } = totalPayDetails;
  const handleChange = useCallback(
    (key: string, value: number | string | boolean | null) => {
      const updatedData = { ...totalPayDetails, [key]: value };
      setTotalPayDetails(updatedData);
      onChange(updatedData);
    },
    [onChange, totalPayDetails, setTotalPayDetails],
  );
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Label className="w-56 text-sm" text="Total Fee" />
        <div className="flex items-center">
          <Label className="text-sm" text={currencySymbol} />
          <TextInput
            testId="contract-details-first-day-work"
            placeholder="00.00"
            value={totalFee}
            onChange={(event) => handleChange('totalFee', parseInt(event.target.value || '0', 10))}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Label className="w-56 text-sm" text="Total Holiday Fee" />
        <div className="flex items-center">
          <Label className="text-sm" text={currencySymbol} />
          <TextInput
            testId="contract-details-first-day-work"
            placeholder="00.00"
            value={totalHolidayPay}
            onChange={(event) => handleChange('totalHolidayPay', parseInt(event.target.value || '0', 10))}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Label className="w-56 text-sm" text="Fee Notes" />
        <TextInput
          testId="contract-details-first-day-work"
          placeholder="00.00"
          value={feeNotes}
          onChange={(event) => handleChange('feeNotes', parseInt(event.target.value || '0', 10))}
        />
      </div>
    </div>
  );
};

export default TotalPayDetails;
