import { ProductionTaskDTO } from 'interfaces';
import { Table } from 'components/global/table/Table';
import React, { useMemo } from 'react';
import TaskEditor from './editors/TaskEditor';
import { calculateTaskStatus } from 'utils/tasks';
import { TaskStatusLabelMap } from 'config/tasks';
import { useRecoilValue } from 'recoil';
import { userState } from 'state/account/userState';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { dateToSimple } from 'services/dateService';

interface TaskListItemProps {
  task: ProductionTaskDTO;
  onTaskChange?: (task: ProductionTaskDTO) => void;
}

const TaskListItem = ({ task }: TaskListItemProps) => {
  const { users = {} } = useRecoilValue(userState);
  const [modalOpen, setModalOpen] = React.useState(false);
  const status = useMemo(() => TaskStatusLabelMap[calculateTaskStatus(task.Progress || 0)], [task.Progress]);
  const assignee = useMemo(() => {
    const user = users?.[task.AssignedToUserId];
    return `${user?.FirstName || ''} ${user?.LastName || ''}`;
  }, [task.AssignedToUserId, users]);
  // const weekOptions = useMemo(() => getWeekOptions(''), []);
  // const handleOnChange = (e: any) => {
  //   e?.stopPropagation?.();
  //   const { id, value } = e.target;
  //   onTaskChange?.({...task, [id]:parseInt(value,10)})
  // };
  const taskDateStatusColor = 'ng-none';
  const progressBarWidth = task.Progress + '%';
  return (
    <>
      {modalOpen && <TaskEditor open={modalOpen} task={task} triggerClose={() => setModalOpen(false)} />}
      <Table.Row
        className={`!bg-transparent !bg-opacity-[unset] [&>td]:!border-y-2 [&>td]:!border-x-0 ${taskDateStatusColor}`}
        hover
        onClick={() => setModalOpen(true)}
      >
        <Table.Cell className="text-center">{task.Code}</Table.Cell>
        <Table.Cell>{task.Name}</Table.Cell>
        <Table.Cell>
          <div className="border bg-white rounded-md flex justify-between gap-2 px-4 w-20 py-1 items-center">
            {task.StartByWeekNum || '-'}
            <FontAwesomeIcon icon={faAngleDown} />
          </div>
        </Table.Cell>
        <Table.Cell> {task?.StartDate ? dateToSimple(task?.StartDate) : '-'}</Table.Cell>
        <Table.Cell>
          <div className="border bg-white rounded-md flex justify-between gap-2 px-4 w-20 py-1 items-center">
            {task.CompleteByWeekNum || '-'}
            <FontAwesomeIcon icon={faAngleDown} />
          </div>
        </Table.Cell>
        <Table.Cell>{task?.CompleteDate ? dateToSimple(task?.CompleteDate) : '-'}</Table.Cell>
        <Table.Cell>
          <div className="rounded-lg flex justify-center bg-progress-grey h-8 relative w-full items-center">
            <span
              className="rounded-lg bg-progress-teal absolute block h-full top-0 left-0"
              style={{ width: progressBarWidth, zIndex: 1 }}
            />
            <span className="z-10 relative">{task.Progress}</span>
          </div>
        </Table.Cell>
        <Table.Cell>{status}</Table.Cell>
        <Table.Cell>{assignee ?? '-'}</Table.Cell>
        <Table.Cell className="text-center">{task.Priority}</Table.Cell>
        <Table.Cell>{task.Notes}</Table.Cell>
      </Table.Row>
    </>
  );
};

export default TaskListItem;
