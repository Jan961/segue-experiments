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
}

const TaskListItem = ({ task }: TaskListItemProps) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [bulkSelection, setBulkSelection] = useRecoilState(bulkSelectionState);

  const taskDateStatusColor = getTaskDateStatusColor(task.DueDate, task.Status);

  const progressBarWidth = task.Progress + '%'; // Convert progress to a percentage string

  const toggleSelected = () => {
    setBulkSelection({ ...bulkSelection, [task.Id]: !bulkSelection[task.Id] });
  };

  return (
    <>
      {modalOpen && <TaskEditor open={modalOpen} task={task} triggerClose={() => setModalOpen(false)} />}
      <Table.Row className={`${taskDateStatusColor}`} hover onClick={() => setModalOpen(true)}>
        <Table.Cell>{task.Code}</Table.Cell>
        <Table.Cell>{task.Name}</Table.Cell>
        <Table.Cell>{task.StartByWeekNum}</Table.Cell>
        <Table.Cell>{formatDateDoubleDigits(task.DueDate) ?? 'N/A'}</Table.Cell>
        <Table.Cell>{task.CompleteByWeekNum}</Table.Cell>
        <Table.Cell>{formatDateDoubleDigits(task.DueDate) ?? 'N/A'}</Table.Cell>
        <Table.Cell>
          {/* JAS TO DO, add to config */}
          <div className='rounded flex justify-center bg-[#dadce5] py-2 relative  w-full'>
          <div className='rounded bg-red absolute block' style={{ width: progressBarWidth, zIndex: 1 }}></div>
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
