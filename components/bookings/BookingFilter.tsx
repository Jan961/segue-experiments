import DateRange from 'components/core-ui-lib/DateRange/DateRange';
import { useRecoilState } from 'recoil';
import { filterState } from 'state/booking/filterState';

export default function BookingsButtons() {
  const [filter, setFilter] = useRecoilState(filterState);
  const {startDate, endDate} = filter||{};
  const onChange = (change:{from:string,to:string}) => {
    const {from:startDate, to:endDate} = change;
    console.log(filter, 'onFilterChange', change);
    setFilter({ ...filter, startDate, endDate });
  };
  return (
    <div className='bg-white'>
      <DateRange label="Date" onChange={onChange} value={{from:startDate, to:endDate}} />
    </div>
  );
}
