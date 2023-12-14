import { FormInputDate } from 'components/global/forms/FormInputDate';
import { useRecoilState } from 'recoil';
import { filterState } from 'state/booking/filterState';

export default function BookingsButtons() {
  const [filter, setFilter] = useRecoilState(filterState);
  const onChange = (e: any) => {
    console.log(filter, 'onFilterChange', e.target.id, e.target.value);
    setFilter({ ...filter, [e.target.id]: e.target.value });
  };
  return (
    <>
      <FormInputDate
        className="flex items-center [&>div]:text-primary-blue [&>div]:text-lg [&>div]:font-bold"
        label="From:"
        value={filter?.startDate}
        name="startDate"
        onChange={onChange}
      />
      <FormInputDate
        className="flex items-center [&>div]:text-primary-blue [&>div]:text-lg [&>div]:font-bold"
        label="To:"
        value={filter?.endDate}
        name="endDate"
        onChange={onChange}
      />
    </>
  );
}
