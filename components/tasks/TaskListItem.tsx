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
import { getAdjustedDateByWeeks } from 'utils/getAdjustedDateByWeeks';

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

  const toggleSelected = () => {
    setBulkSelection({ ...bulkSelection, [task.Id]: !bulkSelection[task.Id] });
  };

  return (
    <>
      {modalOpen && <TaskEditor open={modalOpen} task={task} triggerClose={() => setModalOpen(false)} />}
      <Table.Row className={`${taskDateStatusColor}`} hover onClick={() => setModalOpen(true)}>
        <Table.Cell>
          <FormInputCheckbox value={bulkSelection[task.Id]} onChange={toggleSelected} minimal />
        </Table.Cell>
        <Table.Cell>{task.StartByWeekNum}</Table.Cell>
        <Table.Cell>{getAdjustedDateByWeeks(task.StartByWeekNum)}</Table.Cell>
        <Table.Cell>{task.CompleteByWeekNum}</Table.Cell>
        <Table.Cell>{getAdjustedDateByWeeks(task.CompleteByWeekNum)}</Table.Cell>
        <Table.Cell>{task.Progress + '%'}</Table.Cell>
        <Table.Cell>{task.Name}</Table.Cell>
        <Table.Cell>{task.AssignedTo ?? '-'}</Table.Cell>
        <Table.Cell>{task.AssignedBy ?? '-'}</Table.Cell>
        <Table.Cell>{task.Status}</Table.Cell>
        <Table.Cell>{getPriority(task.Priority)}</Table.Cell>
        <Table.Cell>{formatDate(task.FollowUp) ?? '-'}</Table.Cell>
      </Table.Row>
    </>
  );
};

export default TaskListItem;
