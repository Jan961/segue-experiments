import Button from 'components/core-ui-lib/Button';
import TextInput from 'components/core-ui-lib/TextInput';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { masterTaskState } from 'state/tasks/masterTaskState';

const Filters = () => {
  const [filter, setFilter] = useRecoilState(masterTaskState);

  const onChange = (e: any) => {
    setFilter({ ...filter, [e.target.id]: e.target.value });
  };

  const onClearFilters = () => {
    setFilter({
      ...filter,
      taskText: '',
    });
  };

  const router = useRouter();

  return (
    <div className="w-full flex items-center justify-between flex-wrap">
      <div className="px-4">
        <div className="py-2 flex flex-row items-center gap-4">
          <h1 className="text-4xl font-bold text-primary-yellow">Master Task Lists</h1>
          <TextInput
            id="taskText"
            placeholder="Search Master Task List..."
            className="w-[410px]"
            iconName="search"
            value={filter.taskText}
            onChange={onChange}
          />
          <Button className="text-sm leading-8 w-[132px]" text="Clear Filters" onClick={onClearFilters} />
        </div>
      </div>
      <div className="pl-20 flex items-center gap-4 flex-wrap  py-1">
        <Button text="Production Task List" className="w-[132px]" onClick={() => router.push('/tasks')} />
        <Button text="Export" className="w-[132px]" sufixIconName={'excel'} onClick={null} />
        <Button onClick={null} text="Add Task" className="w-[132px]" />
      </div>
    </div>
  );
};

export default Filters;
