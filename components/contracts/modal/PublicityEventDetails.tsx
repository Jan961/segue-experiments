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
  testId?: string;
  details: IPublicityEventDetails;
  onChange: (data: Partial<IPublicityEventDetails>) => void;
}

const PublicityEventDetails: FC<PublicityEventDetailsProps> = ({ details, testId = 'publicity-event', onChange }) => {
  const [eventDetails, setEventDetails] = useState<IPublicityEventDetails>({
    ...defaultPublicityEventDetails,
    ...details,
  });
  const { isRequired, date, notes } = eventDetails;

  const handleChange = useCallback(
    (key: string, value: number | string | boolean | null) => {
      const updatedData = { ...eventDetails, [key]: value };
      setEventDetails(updatedData);
      onChange({ ...details, [key]: value });
    },
    [onChange, eventDetails, setEventDetails],
  );

  return (
    <div className="flex items-start gap-4 w-full">
      <div className="flex items-start gap-2">
        <Select
          testId={`${testId}-is-required`}
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
          testId={`${testId}-date`}
          placeholder="DD/MM/YY"
          value={date}
          onChange={(value) => handleChange('date', value?.toISOString?.() || '')}
        />
      </div>
      <div className="grow">
        <TextInput
          disabled={!isRequired}
          testId={`${testId}-notes`}
          placeholder="Publicity Event Notes"
          className="grow"
          value={notes}
          onChange={(event) => handleChange('notes', event.target.value)}
        />
      </div>
    </div>
  );
};

export default PublicityEventDetails;
