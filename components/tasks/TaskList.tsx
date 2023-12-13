// Import necessary types and components
import { TourState, tourState } from 'state/tasks/tourState';
import TaskListItem from './TaskListItem';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Table } from 'components/global/table/Table';
import { FormInputCheckbox } from 'components/global/forms/FormInputCheckbox';
import { bulkSelectionState } from 'state/tasks/bulkSelectionState';
import { TourTaskDTO } from 'interfaces';
import { useState } from 'react';

interface TaskListProps {
  tourId: number;
  selectedTour?: number;
  searchFilter: string;
  statusFilter: string;
  tasks: TourTaskDTO[];
}

const Tasklist = ({ tourId, selectedTour, searchFilter, statusFilter, tasks }: TaskListProps) => {
  // console.log('Received searchFilter:', searchFilter);
  const [bulkSelection, setBulkSelection] = useRecoilState(bulkSelectionState);
  const tours: TourState = useRecoilValue(tourState);
  const match = tours.find((x) => x.Id === tourId);
  console.log('match', match);
  const [searchQuery, setSearchQuery] = useState('');

  if (!match || (selectedTour !== undefined && selectedTour !== tourId)) {
    return null;
  }

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

  if ((match.Tasks || []).length === 0) {
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
            .filter((task) => {
              const matchesSearch = searchFilter === '' || task.Name.toLowerCase().includes(searchFilter.toLowerCase());
              console.log('Tasklist here', statusFilter);
              let matchesStatus = true;
              switch (statusFilter) {
                case 'todo':
                  matchesStatus = task.Progress === 0;
                  break;
                case 'inProgress':
                  matchesStatus = task.Progress > 0 && task.Progress < 100;
                  break;
                case 'complete':
                  matchesStatus = task.Progress === 100;
                  break;
                default:
                  break;
              }
              return matchesSearch && matchesStatus;
            })
            .map((task) => (
              <TaskListItem task={task} weekNumToDateMap={match.weekNumToDateMap} key={task.Id}></TaskListItem>
            ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default Tasklist;
