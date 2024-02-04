import DateRange from 'components/core-ui-lib/DateRange/DateRange';
import { useRecoilState } from 'recoil';
import { filterState } from 'state/booking/filterState';

export default function BookingsButtons() {
  const [filter, setFilter] = useRecoilState(filterState);
  const { startDate, endDate } = filter || {};

  const onChange = (change: { from: Date; to: Date }) => {
    const { from: startDate, to: endDate } = change;
    setFilter({ ...filter, startDate, endDate });
  };
  return (
    <DateRange className="bg-primary-white" label="Date" onChange={onChange} value={{ from: startDate, to: endDate }} />
  );
}
