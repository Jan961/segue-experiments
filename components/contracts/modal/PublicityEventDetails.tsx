import { DateInput, Label, Select, TextInput } from 'components/core-ui-lib';
import { booleanOptions } from 'config/contracts';
import { useState, FC, useCallback } from 'react';

export const defaultPublicityEventDetails = {
  isRequired: false,
  date: null,
  notes: '',
};

export interface IPublicityEventDetails {
  isRequired: boolean;
  date?: string;
  notes: string;
}

interface PublicityEventDetailsProps {
  details: IPublicityEventDetails;
  onChange: (data: IPublicityEventDetails) => void;
}

const PublicityEventDetails: FC<PublicityEventDetailsProps> = ({ details, onChange }) => {
  const [eventDetails, setEventDetails] = useState<IPublicityEventDetails>({
    ...defaultPublicityEventDetails,
    ...details,
  });
  const { isRequired, date, notes } = eventDetails;
  const handleChange = useCallback(
    (key: string, value: number | string | boolean | null) => {
      const updatedData = { ...eventDetails, [key]: value };
      setEventDetails(updatedData);
      onChange(updatedData);
    },
    [onChange, eventDetails, setEventDetails],
  );
  return (
    <div className="flex items-start gap-4">
      <div className="flex items-start gap-2">
        <Select
          testId="contract-details-currency"
          placeholder="Yes | No"
          value={isRequired}
          onChange={(value) => handleChange('isRequired', value as boolean)}
          options={booleanOptions}
        />
      </div>
      <div className="flex items-center gap-2">
        <Label className="!font-bold text-sm" text="If YES, " />
        <DateInput
          disabled={!isRequired}
          testId="contract-details-publicity-event-date"
          placeholder="DD/MM/YY"
          value={date}
          onChange={(value) => handleChange('date', value?.toISOString?.() || '')}
        />
      </div>
      <TextInput
        disabled={!isRequired}
        testId="contract-details-publicity-event-notes"
        placeholder="Publicity Event Notes"
        className="flex-1"
        value={notes}
        onChange={(event) => handleChange('notes', event.target.value)}
      />
    </div>
  );
};

export default PublicityEventDetails;
