import { TourState, tourState } from 'state/tasks/tourState';
import TaskListItem from './TaskListItem';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Table } from 'components/global/table/Table';
import { FormInputCheckbox } from 'components/global/forms/FormInputCheckbox';
import { bulkSelectionState } from 'state/tasks/bulkSelectionState';

interface TaskListProps {
  tourId: number;
}

const Tasklist = ({ tourId }: TaskListProps) => {
  const [bulkSelection, setBulkSelection] = useRecoilState(bulkSelectionState);
  const tours: TourState = useRecoilValue(tourState);
  const match = tours.filter((x) => x.Id === tourId)[0];

  if (!match) return null;

  const countSelected = match.Tasks.filter((x) => bulkSelection[x.Id]).length;
  const allSelected = countSelected === match.Tasks.length;

  const toggleAll = () => {
    const ids = match.Tasks.map((x) => x.Id);
    const newState = { ...bulkSelection };
    if (allSelected) {
      for (const id of ids) {
        delete newState[id];
      }
    } else {
      for (const id of ids) {
        newState[id] = true;
      }
    }
    setBulkSelection(newState);
  };

  if (match.Tasks.length === 0) {
    return <p>No tasks for this tour</p>;
  }

  return (
    <div className="h-96">
      <Table>
        <Table.HeaderRow>
          <Table.HeaderCell>
            <FormInputCheckbox value={allSelected} onChange={toggleAll} minimal />
          </Table.HeaderCell>
          <Table.HeaderCell>Start by (wk)</Table.HeaderCell>
          <Table.HeaderCell>Start by</Table.HeaderCell>
          <Table.HeaderCell>Due (wk)</Table.HeaderCell>
          <Table.HeaderCell>Due</Table.HeaderCell>
          <Table.HeaderCell>Progress</Table.HeaderCell>
          <Table.HeaderCell>Title</Table.HeaderCell>
          <Table.HeaderCell>Assignee</Table.HeaderCell>
          <Table.HeaderCell>Assigned By</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
          <Table.HeaderCell>Priority</Table.HeaderCell>
          <Table.HeaderCell>Follow Up</Table.HeaderCell>
        </Table.HeaderRow>
        <Table.Body className="overflow-auto">
          {' '}
          {match.Tasks.map((task) => (
            <TaskListItem task={task} key={task.Id}></TaskListItem>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default Tasklist;
