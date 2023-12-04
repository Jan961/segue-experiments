import { Table } from 'components/global/table/Table';
import { FormInputCheckbox } from 'components/global/forms/FormInputCheckbox';
import React, { useMemo } from 'react';
import { bulkSelectionState } from 'state/tasks/bulkSelectionState';
import { useRecoilState, useRecoilValue } from 'recoil';
import { MasterTask } from '@prisma/client';
import MasterTaskEditor from './editors/MasterTaskEditor';
import { userState } from 'state/account/userState';
import { MenuButton } from 'components/global/MenuButton';
import { DeleteConfirmation } from 'components/global/DeleteConfirmation';
import axios from 'axios';

interface TaskListItemProps {
  task: MasterTask;
}

const TaskListItem = ({ task }: TaskListItemProps) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [bulkSelection, setBulkSelection] = useRecoilState(bulkSelectionState);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);
  const {users={}} = useRecoilValue(userState)
  const assignedToUser = useMemo(()=>users[task.AssignedToUserId],[task,users])
  const toggleSelected = () => {
    setBulkSelection({ ...bulkSelection, [task.Id]: !bulkSelection[task.Id] });
  };
  const onActionItemClick = (e:any,key:string)=>{
    e?.stopPropagation?.()
    switch(key){
      case 'clone':
        return;
      case 'edit':
        setModalOpen(true)
        return
      case 'delete':
        setShowDeleteConfirmation(true)
    }
  }
  const onDeleteTask = ()=>{
    axios
        .delete(`/api/tasks/master/delete/${task.Id}`)
        .then(()=>{
          setShowDeleteConfirmation(false)
        })
        .catch(error=>{
          console.error(error)
        })
  }
  return (
    <>
      {modalOpen && <MasterTaskEditor open={modalOpen} task={task} triggerClose={() => setModalOpen(false)} />}
      <Table.Row className={`!bg-transparent !bg-opacity-[unset] [&>td]:!border-x-0`} hover onClick={() => setModalOpen(true)}>
        <Table.Cell>
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
            <MenuButton className='!bg-gray-600 hover:!bg-gray-400' onClick={(e)=>onActionItemClick(e,'clone')}>CLONE</MenuButton>
            <MenuButton className='!bg-gray-600 hover:!bg-gray-400' onClick={(e)=>onActionItemClick(e,'edit')}>EDIT</MenuButton>
            <MenuButton className='!bg-gray-600 hover:!bg-gray-400' onClick={(e)=>onActionItemClick(e,'delete')}>DEL</MenuButton>
        </Table.Cell>
      </Table.Row>
      {showDeleteConfirmation && <DeleteConfirmation title={"Delete Master task"} onConfirm={onDeleteTask} onCancel={()=>setShowDeleteConfirmation(false)}>
          <p>Are you sure, you want to delete this task?</p>
        </DeleteConfirmation>}
    </>
  );
};

export default TaskListItem;
