import { TourState, tourState } from 'state/tasks/tourState';
import TaskListItem from './TaskListItem';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Table } from 'components/global/table/Table';
import { FormInputCheckbox } from 'components/global/forms/FormInputCheckbox';
import { bulkSelectionState } from 'state/tasks/bulkSelectionState';
import { masterTaskState } from 'state/tasks/masterTaskState';
import MasterTaskListItem from './MasterTaskListItem';


const Tasklist = () => {
  const [bulkSelection, setBulkSelection] = useRecoilState(bulkSelectionState);
  const masterTasks = useRecoilValue(masterTaskState);

  if (!masterTasks.length) return null;

  const countSelected = masterTasks.filter((x) => bulkSelection[x.Id]).length;
  const allSelected = countSelected === masterTasks.length;

  const toggleAll = () => {
    const ids = masterTasks.map((x) => x.Id);
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

  if (masterTasks.length === 0) {
    return <p>No tasks for this tour</p>;
  }

  return (
    <div className="h-128 w-full overflow-auto">
      <Table className="border-collapse">
        <Table.HeaderRow className="bg-transparent text-purple-700">
          <Table.HeaderCell>
            <FormInputCheckbox value={allSelected} onChange={toggleAll} minimal />
          </Table.HeaderCell>
          <Table.HeaderCell className="text-purple-900">Code</Table.HeaderCell>
          <Table.HeaderCell className="text-purple-900">Task Name</Table.HeaderCell>
          <Table.HeaderCell className="text-purple-900">Start by</Table.HeaderCell>
          <Table.HeaderCell className="text-purple-900">Complete by</Table.HeaderCell>
          <Table.HeaderCell className="text-purple-900">Priority</Table.HeaderCell>
          <Table.HeaderCell className="text-purple-900">Assigned to</Table.HeaderCell>
          <Table.HeaderCell className="text-purple-900">Notes</Table.HeaderCell>
          <Table.HeaderCell className="text-purple-900">Actions</Table.HeaderCell>
        </Table.HeaderRow>
        <Table.Body  className="bg-transparent">
          {' '}
          {masterTasks.map((masterTask) => (
            <MasterTaskListItem task={masterTask} key={masterTask.Id}></MasterTaskListItem>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default Tasklist;
