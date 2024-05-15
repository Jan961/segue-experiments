import Button from 'components/core-ui-lib/Button';
import TextInput from 'components/core-ui-lib/TextInput';
import { useRecoilState } from 'recoil';
import { filterState } from 'state/booking/filterState';

const Filters = () => {
  const [filter, setFilter] = useRecoilState(filterState);

  const onChange = (e: any) => {
    setFilter({ ...filter, [e.target.id]: e.target.value });
  };

  const onClearFilters = () => {
    setFilter({
      ...filter,
      masterTaskText: '',
    });
  };

  return (
    <div className="w-full flex items-center justify-between flex-wrap">
      <div className="px-4">
        <div className="py-2 flex flex-row items-center gap-4">
          <h1 className={`text-4xl font-bold text-primary-yellow`}>Master Task Lists</h1>
          <TextInput
            id={'masterTaskText'}
            placeholder="Search Master Task List..."
            className="w-[410px]"
            iconName="search"
            value={''}
            onChange={onChange}
          />
          <Button className="text-sm leading-8 w-[132px]" text="Clear Filters" onClick={onClearFilters} />
        </div>
      </div>
      <div className="pl-20 flex items-center gap-4 flex-wrap  py-1">
        <Button text="Production Task List" className="w-[132px]" onClick={null} />
        <Button
          text="Export"
          className="w-[132px]"
          iconProps={{ className: 'h-4 w-3' }}
          sufixIconName={'excel'}
          onClick={null}
        />
        <Button onClick={null} text="Add Task" className="w-[132px]" />
      </div>
    </div>
  );
};

export default Filters;
