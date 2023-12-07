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
import { masterTaskState } from 'state/tasks/masterTaskState';
import { omit } from 'radash';
import { loggingService } from 'services/loggingService';
import { Spinner } from 'components/global/Spinner';

interface TaskListItemProps {
  task: MasterTask;
}

const TaskListItem = ({ task }: TaskListItemProps) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [bulkSelection, setBulkSelection] = useRecoilState(bulkSelectionState);
  const [loading, setLoading] = React.useState<boolean>(false)
  const [masterTasks, setMasterTasks] = useRecoilState(masterTaskState);
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
        onCloneTask()
        return;
      case 'edit':
        setModalOpen(true)
        return
      case 'delete':
        setShowDeleteConfirmation(true)
    }
  }
  const onCloneTask = async ()=>{
    setLoading(true)
    try {
      const endpoint = '/api/tasks/master/create';
      await axios.post(endpoint, omit(task, ['Id'])).then((response)=>{
        const taskIndex = masterTasks.findIndex(masterTask=>masterTask.Id===task.Id)
        setMasterTasks([...masterTasks.slice(0, taskIndex),{ ...omit(task, ['Id']), Id:response.data.Id}, ...masterTasks.slice(taskIndex)])
      }).finally(()=>{
        setLoading(false)
      });
    } catch (error) {
      loggingService.logError(error);
      console.error(error);
    }
  }
  const onDeleteTask = ()=>{
    axios
        .delete(`/api/tasks/master/delete/${task.Id}`)
        .then(()=>{
          setShowDeleteConfirmation(false)
          const updatedTasks = masterTasks.filter(masterTask=>masterTask.Id!==task.Id)
          setMasterTasks(updatedTasks)
        })
        .catch(error=>{
          console.error(error)
        })
  }
  return (
    <>
      {modalOpen && <MasterTaskEditor open={modalOpen} task={task} triggerClose={() => setModalOpen(false)} />}
      {loading && (
          <div className="w-full h-full absolute left-0 top-0 bg-white flex items-center opacity-95">
            <Spinner className="w-full" size="lg" />
          </div>
        )}
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
