import classNames from 'classnames';
import TaskListItem from './TaskListItem';
import { Table } from 'components/global/table/Table';
import { ProductionTaskDTO } from 'interfaces';

interface TaskListProps {
  tasks: ProductionTaskDTO[];
  className?: string;
  onTasksChange?: (tasks: ProductionTaskDTO[]) => void;
}

const Tasklist = ({ tasks = [], onTasksChange, className }: TaskListProps) => {
  const onTaskChange = (updatedTask: ProductionTaskDTO) => {
    const updatedTasks = tasks.map((task) => {
      if (task.Id === updatedTask.Id) {
        return updatedTask;
      }
      return task;
    });
    onTasksChange?.(updatedTasks);
  };
  if (tasks.length === 0) {
    return <p>No tasks for this production</p>;
  }
  return (
    <div className={classNames('max-h-[15rem] w-full overflow-auto', className)}>
      <Table className="border-collapse">
        <Table.HeaderRow className="!bg-gray-50 !text-purple-700">
          <Table.HeaderCell className="!text-purple-900 !text-lg w-[80px]">Code</Table.HeaderCell>
          <Table.HeaderCell className="!text-purple-900 !text-lg w-[300px]">Task Name</Table.HeaderCell>
          <Table.HeaderCell className="!text-purple-900 !text-lg w-[100px]">Start by (wk)</Table.HeaderCell>
          <Table.HeaderCell className="!text-purple-900 !text-lg w-[100px]">Start by</Table.HeaderCell>
          <Table.HeaderCell className="!text-purple-900 !text-lg w-[100px]">Due (wk)</Table.HeaderCell>
          <Table.HeaderCell className="!text-purple-900 !text-lg w-[100px]">Due</Table.HeaderCell>
          <Table.HeaderCell className="!text-purple-900 !text-lg w-[150px]">Progress</Table.HeaderCell>
          <Table.HeaderCell className="!text-purple-900 !text-lg w-[100px]">Status</Table.HeaderCell>
          <Table.HeaderCell className="!text-purple-900 !text-lg w-[180px]">Assignee</Table.HeaderCell>
          <Table.HeaderCell className="!text-purple-900 !text-lg w-[100px]">Priority</Table.HeaderCell>
          <Table.HeaderCell className="!text-purple-900 !text-lg">Notes</Table.HeaderCell>
        </Table.HeaderRow>
        <Table.Body className="!bg-transparent">
          {tasks.map((task) => (
            <TaskListItem onTaskChange={onTaskChange} task={task} key={task.Id} />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default Tasklist;