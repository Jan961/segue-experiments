import { FormInputDate } from 'components/global/forms/FormInputDate';
import { FormInputTime } from 'components/global/forms/FormInputTime';
interface DateTimeSelectorProps {
  date: string;
  setDate: (date: string) => void;
}

export const DateTimeSelector = ({ date, setDate }: DateTimeSelectorProps) => {
  const datePart = date ? date.split('T')[0] : '';
  const timePart = date && date.split('T')[1] ? date.split('T')[1] : '18:30:00';

  const handleOnChange = (e: any) => {
    const { id, value } = e.target;

    if (id === 'datePart') {
      const newDatePart = value.split('T')[0] ? value.split('T')[0] : '';
      setDate(newDatePart + 'T' + timePart);
    } else if (id === 'timePart') {
      setDate(datePart + 'T' + value);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <FormInputDate name="datePart" value={datePart} onChange={handleOnChange} />
      <FormInputTime name="timePart" value={timePart} onChange={handleOnChange} />
    </div>
  );
};
