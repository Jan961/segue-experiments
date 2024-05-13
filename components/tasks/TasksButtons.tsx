import Button from 'components/core-ui-lib/Button';

export default function TasksButtons() {
  return (
    <div className="flex flex-col gap-4">
      <Button text="Master Task List" className="w-[155px]" onClick={null} />
      <Button
        text="Tasks Reports"
        className="w-[155px]"
        iconProps={{ className: 'h-4 w-3' }}
        sufixIconName={'excel'}
        onClick={null}
      />
      <Button onClick={null} text="Add Task" className="w-[155px]" />
    </div>
  );
}
