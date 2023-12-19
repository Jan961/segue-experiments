import {
  // useRecoilState,
  useRecoilValue,
} from 'recoil';
import { Table } from 'components/global/table/Table';
// import { FormInputCheckbox } from 'components/global/forms/FormInputCheckbox';
// import { bulkSelectionState } from 'state/tasks/bulkSelectionState';
import { masterTaskState } from 'state/tasks/masterTaskState';
import MasterTaskListItem from './MasterTaskListItem';
import { useMemo } from 'react';
import { filterState } from 'state/booking/filterState';

const Tasklist = () => {
  // const [bulkSelection, setBulkSelection] = useRecoilState(bulkSelectionState);
  const masterTasks = useRecoilValue(masterTaskState);
  const filter = useRecoilValue(filterState);
  const filteredTasks = useMemo(
    () =>
      masterTasks?.filter?.((task) => task?.Name?.toLowerCase?.()?.includes?.(filter?.masterTaskText?.toLowerCase?.())),
    [filter?.masterTaskText, masterTasks],
  );
  if (!filteredTasks.length) return null;

  // const countSelected = filteredTasks.filter((x) => bulkSelection[x.Id]).length;
  // const allSelected = countSelected === filteredTasks.length;

  // const toggleAll = () => {
  //   const ids = masterTasks.map((x) => x.Id);
  //   const newState = { ...bulkSelection };
  //   if (allSelected) {
  //     for (const id of ids) {
  //       delete newState[id];
  //     }
  //   } else {
  //     for (const id of ids) {
  //       newState[id] = true;
  //     }
  //   }
  //   setBulkSelection(newState);
  // };

  if (filteredTasks.length === 0) {
    return <p>No tasks for this tour</p>;
  }

  return (
    <div className="h-[80vh] w-full overflow-auto">
      <Table className="border-collapse">
        <Table.HeaderRow className="bg-transparent !text-purple-700">
          {/* <Table.HeaderCell>
            <FormInputCheckbox value={allSelected} onChange={toggleAll} minimal />
          </Table.HeaderCell> */}
          <Table.HeaderCell className="!text-purple-900 !text-lg">Code</Table.HeaderCell>
          <Table.HeaderCell className="!text-purple-900 !text-lg">Task Name</Table.HeaderCell>
          <Table.HeaderCell className="!text-purple-900 !text-lg">Start by</Table.HeaderCell>
          <Table.HeaderCell className="!text-purple-900 !text-lg">Complete by</Table.HeaderCell>
          <Table.HeaderCell className="!text-purple-900 !text-lg">Priority</Table.HeaderCell>
          <Table.HeaderCell className="!text-purple-900 !text-lg">Assigned to</Table.HeaderCell>
          <Table.HeaderCell className="!text-purple-900 !text-lg">Notes</Table.HeaderCell>
          <Table.HeaderCell className="!text-purple-900 !text-lg">Actions</Table.HeaderCell>
        </Table.HeaderRow>
        <Table.Body className="!bg-transparent">
          {' '}
          {filteredTasks.map((masterTask) => (
            <MasterTaskListItem task={masterTask} key={masterTask.Id}></MasterTaskListItem>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default Tasklist;
