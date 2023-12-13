import { TourTaskDTO } from 'interfaces';
import formatDate from 'utils/formatDate';
import getTaskDateStatusColor from 'utils/getTaskDateStatus';
import formatDateDoubleDigits from 'utils/formatDateDoubleDigits';
import { Table } from 'components/global/table/Table';
import { FormInputCheckbox } from 'components/global/forms/FormInputCheckbox';
import React from 'react';
import TaskEditor from './editors/TaskEditor';
import { bulkSelectionState } from 'state/tasks/bulkSelectionState';
import { useRecoilState } from 'recoil';

function getPriority(priority) {
  switch (priority) {
    case 0:
      return 'low';
    case 1:
      return 'Medium';
    case 2:
      return 'High';
    default:
      break;
  }
}

interface TaskListItemProps {
  task: TourTaskDTO;
  weekNumToDateMap: { [key: number]: Date };
}

const TaskListItem = ({ task, weekNumToDateMap }: TaskListItemProps) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [bulkSelection, setBulkSelection] = useRecoilState(bulkSelectionState);

  const taskDateStatusColor = getTaskDateStatusColor(task.DueDate, task.Status);

  const progressBarWidth = task.Progress + '%';
  const toggleSelected = () => {
    setBulkSelection({ ...bulkSelection, [task.Id]: !bulkSelection[task.Id] });
  };


  function getDateFromWeekNum(weekNum, weekNumToDateMap) {
    if (weekNumToDateMap && weekNumToDateMap[weekNum]) {
      return formatDateDoubleDigits(weekNumToDateMap[weekNum]);
    }
    return 'N/A';
  }
  return (
    <>
      {modalOpen && <TaskEditor open={modalOpen} task={task} triggerClose={() => setModalOpen(false)} />}
      <Table.Row className={`${taskDateStatusColor}`} hover onClick={() => setModalOpen(true)}>
        <Table.Cell>{task.Code}</Table.Cell>
        <Table.Cell>{task.Name}</Table.Cell>
        <Table.Cell>{task.StartByWeekNum}</Table.Cell>
        <Table.Cell>{getDateFromWeekNum(task.StartByWeekNum, weekNumToDateMap)}</Table.Cell>
        <Table.Cell>{task.CompleteByWeekNum}</Table.Cell>
        <Table.Cell>{getDateFromWeekNum(task.CompleteByWeekNum, weekNumToDateMap)}</Table.Cell>
        <Table.Cell>
          <div className='rounded flex justify-center bg-progress-grey h-8 relative w-full items-center'>
          <span className='rounded bg-progress-teal absolute block h-full top-0 left-0' style={{ width: progressBarWidth, zIndex: 1 }}></span>
            <span className='z-10 relative'>{task.Progress}</span>
          </div>
        </Table.Cell>
        <Table.Cell>{task.Status}</Table.Cell>
        <Table.Cell>{task.AssignedTo ?? '-'}</Table.Cell>
        <Table.Cell>{getPriority(task.Priority)}</Table.Cell>
        <Table.Cell>{task.Notes}</Table.Cell>
      </Table.Row>
    </>
  );
};

export default TaskListItem;
