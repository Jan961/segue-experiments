import { TourState, tourState } from 'state/tasks/tourState';
import TaskListItem from './TaskListItem';
import { useRecoilValue } from 'recoil';
import { Table } from 'components/global/table/Table';
// import { bulkSelectionState } from 'state/tasks/bulkSelectionState';
import { TourTaskDTO } from 'interfaces';

interface TaskListProps {
  tourId: number;
  selectedTour?: number;
  searchFilter: string;
  statusFilter: string;
  startDateFilter: string;
  endDateFilter: string;
  tasks: TourTaskDTO[];
}

const Tasklist = ({
  tourId,
  selectedTour,
  searchFilter,
  statusFilter,
  startDateFilter,
  endDateFilter,
  tasks,
}: TaskListProps) => {
  const tours: TourState = useRecoilValue(tourState);
  const match = tours.find((x) => x.Id === tourId);

  if (!match || (selectedTour !== undefined && selectedTour !== tourId)) {
    return null;
  }

  // const allSelected = countSelected === match.Tasks.length;

  // const toggleAll = () => {
  //   const ids = match.Tasks.map(x => x.Id);
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

  const isDateInRange = (taskDueDate: string, startDate: string, endDate: string) => {
    const convertDate = (dateStr) => {
      if (typeof dateStr !== 'string' || !dateStr.includes('/')) {
        console.error('Invalid date format:', dateStr);
        return null;
      }
      const parts = dateStr.split('/');
      if (parts.length !== 3) {
        console.error('Invalid date format:', dateStr);
        return null;
      }
      const year = parts[2].length === 2 ? '20' + parts[2] : parts[2];
      return `${year}-${parts[1]}-${parts[0]}`;
    };

    const convertedTaskDueDate = convertDate(taskDueDate);
    if (!convertedTaskDueDate) return false;

    const taskDate = new Date(convertedTaskDueDate).getTime();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    return taskDate >= start && taskDate <= end;
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
              const matchesDate =
                startDateFilter && endDateFilter ? isDateInRange(task.DueDate, startDateFilter, endDateFilter) : true;
              console.log('start date filter', startDateFilter);
              return matchesSearch && matchesStatus && matchesDate;
            })
            .map((task) => (
              <TaskListItem task={task} key={task.Id}></TaskListItem>
            ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default Tasklist;
