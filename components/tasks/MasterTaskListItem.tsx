import { Table } from 'components/global/table/Table';
import { FormInputCheckbox } from 'components/global/forms/FormInputCheckbox';
import React, { useMemo } from 'react';
import { bulkSelectionState } from 'state/tasks/bulkSelectionState';
import { useRecoilState, useRecoilValue } from 'recoil';
import { MasterTask } from '@prisma/client';
import MasterTaskEditor from './editors/MasterTaskEditor';
import { userState } from 'state/account/userState';
import { MenuButton } from 'components/global/MenuButton';

interface TaskListItemProps {
  task: MasterTask;
}

const TaskListItem = ({ task }: TaskListItemProps) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [bulkSelection, setBulkSelection] = useRecoilState(bulkSelectionState);
  const {users={}} = useRecoilValue(userState)
  const assignedToUser = useMemo(()=>users[task.AssignedToUserId],[task,users])
  const toggleSelected = () => {
    setBulkSelection({ ...bulkSelection, [task.Id]: !bulkSelection[task.Id] });
  };
  const onDeleteTask = ()=>{}
  return (
    <>
      {modalOpen && <MasterTaskEditor open={modalOpen} task={task} triggerClose={() => setModalOpen(false)} />}
      <Table.Row className={`!bg-transparent bg-opacity-[unset]`} hover onClick={() => setModalOpen(true)}>
        <Table.Cell >
          <FormInputCheckbox value={bulkSelection[task.Id]} onChange={toggleSelected} minimal />
        </Table.Cell>
        <Table.Cell>{task.Code}</Table.Cell>
        <Table.Cell>{task.Name}</Table.Cell>
        <Table.Cell>{task.StartByWeekNum}</Table.Cell>
        <Table.Cell>{task.CompleteByWeekNum}</Table.Cell>
        <Table.Cell>{task.Priority}</Table.Cell>
        <Table.Cell>{assignedToUser?`${assignedToUser?.FirstName} ${assignedToUser?.LastName}`:'-'}</Table.Cell>
        <Table.Cell>{task.Notes}</Table.Cell>
        <Table.Cell>
            <MenuButton>CLONE</MenuButton>
            <MenuButton onClick={()=>setModalOpen(true)}>EDIT</MenuButton>
            <MenuButton onClick={onDeleteTask}>DEL</MenuButton>
        </Table.Cell>
      </Table.Row>
    </>
  );
};

export default TaskListItem;
