import TaskListItem from './TaskListItem';
import { Table } from 'components/global/table/Table';
import { TourTaskDTO } from 'interfaces';

interface TaskListProps {
  tasks: TourTaskDTO[];
}

const Tasklist = ({
  tasks=[],
}: TaskListProps) => {

  if (tasks.length === 0) {
    return <p>No tasks for this tour</p>;
  }
  return (
    <div className="max-h-[32rem] w-full overflow-auto">
      <Table className="border-collapse">
        <Table.HeaderRow>
          <Table.HeaderCell>Code</Table.HeaderCell>
          <Table.HeaderCell>Task Name</Table.HeaderCell>
          <Table.HeaderCell>Start by (wk)</Table.HeaderCell>
          <Table.HeaderCell>Start by</Table.HeaderCell>
          <Table.HeaderCell>Due (wk)</Table.HeaderCell>
          <Table.HeaderCell>Due</Table.HeaderCell>
          <Table.HeaderCell>Progress</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
          <Table.HeaderCell>Assignee</Table.HeaderCell>
          <Table.HeaderCell>Priority</Table.HeaderCell>
          <Table.HeaderCell>Notes</Table.HeaderCell>
        </Table.HeaderRow>
        <Table.Body>
          {tasks
            .map((task) => (
              <TaskListItem task={task} key={task.Id}></TaskListItem>
            ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default Tasklist;
