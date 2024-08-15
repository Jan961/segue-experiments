import { useCallback, useState } from 'react';
import { DateInput, Label, TextInput } from 'components/core-ui-lib';
import { noop } from 'utils';

export const defaultPaymentBreakdown = {
  date: null,
  amount: 0,
  notes: '',
};

export type TPaymentBreakdown = {
  date: string | null;
  amount: number;
  notes: string;
};

interface PaymentBreakdownProps {
  breakdown: TPaymentBreakdown;
  currencySymbol: string;
  onChange: (data: TPaymentBreakdown) => void;
}

const PaymentBreakdown = ({ breakdown, currencySymbol = '£', onChange = noop }: PaymentBreakdownProps) => {
  const [payment, setPayment] = useState({ ...breakdown, ...defaultPaymentBreakdown });
  const { date, amount, notes } = payment;
  const handleChange = useCallback(
    (key: string, value: number | string | boolean | null) => {
      const updatedData = { ...payment, [key]: value };
      setPayment(updatedData);
      onChange(updatedData);
    },
    [onChange, payment, setPayment],
  );
  return (
    <div className="flex items-center w-full gap-4">
      <DateInput
        testId="contract-details-publicity-event-date"
        placeholder="DD/MM/YY"
        value={date}
        onChange={(value) => handleChange('date', value?.toISOString?.() || '')}
      />
      <div className="flex items-center">
        <Label className="text-sm" text={currencySymbol} />
        <TextInput
          placeholder="00.00"
          type="number"
          value={amount}
          onChange={(event) => handleChange('amount', parseInt(event.target.value, 10))}
        />
      </div>
      <TextInput
        className="grow"
        inputClassName="grow"
        placeholder="Payment Notes"
        value={notes}
        onChange={(event) => handleChange('notes', event.target.value)}
      />
    </div>
  );
};

export default PaymentBreakdown;
