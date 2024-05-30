import Button from 'components/core-ui-lib/Button';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Table from 'components/core-ui-lib/Table';
import { getMasterTasksColumnDefs } from './tableConfig';
import { useRecoilValue } from 'recoil';
import { userState } from 'state/account/userState';
import { useEffect, useMemo, useState } from 'react';
import { tileColors } from 'config/global';
import axios from 'axios';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import { MasterTask } from '@prisma/client';
import Loader from 'components/core-ui-lib/Loader';

interface MasterTaskListProps {
  visible: boolean;
  onClose: () => void;
  productionId: string;
}

const LoadingOverlay = () => (
  <div className="inset-0 absolute bg-white bg-opacity-50 z-50 flex justify-center items-center">
    <Loader className="ml-2" iconProps={{ stroke: '#FFF' }} />
  </div>
);

const MasterTaskList = ({ visible, onClose, productionId }: MasterTaskListProps) => {
  const { users } = useRecoilValue(userState);

  const styleProps = { headerColor: tileColors.tasks };
  const [rowData, setRowData] = useState([]);
  const [confirm, setConfirm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/tasks/master/list`);
      setRowData(response.data || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    handleFetchTasks();
  }, []);

  console.log(
    rowData.filter((item) => {
      return item.Notes !== null;
    }),
  );

  const usersList = useMemo(() => {
    return Object.values(users).map(({ Id, FirstName = '', LastName = '' }) => ({
      value: Id,
      text: `${FirstName || ''} ${LastName || ''}`,
    }));
  }, [users]);

  const columnDefs = getMasterTasksColumnDefs(usersList);

  const [selectedRows, setSelectedRows] = useState([]);

  const onSelectionChanged = (event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    console.log(selectedData);
    setSelectedRows(selectedData);
  };

  const handleClose = () => {
    onClose();
  };

  const handleCancel = () => {
    console.log(selectedRows);
    if (selectedRows.length > 0) {
      setConfirm(true);
    } else {
      setConfirm(false);
      onClose();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const endpoint = '/api/tasks/create/multiple/';
      const tasksData = selectedRows.map((task: MasterTask) => {
        return {
          ProductionId: productionId,
          Code: task.Code,
          Name: task.Name,
          CompleteByIsPostProduction: false,
          StartByIsPostProduction: false,
          StartByWeekNum: task.StartByWeekNum,
          CompleteByWeekNum: task.CompleteByWeekNum,
          AssignedToUserId: task.AssignedToUserId,
          Progress: 0,
          Priority: task.Priority,
        };
      });
      await axios.post(endpoint, tasksData);
      setLoading(false);
      onClose();
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <PopupModal show={visible} onClose={onClose} title="Add Master Task" titleClass="text-primary-navy text-xl mb-2">
      <div className=" w-[750px] lg:w-[1386px] h-[606px] flex flex-col ">
        {loading && <LoadingOverlay />}
        <Table
          columnDefs={columnDefs}
          rowData={rowData}
          styleProps={styleProps}
          rowSelection="multiple"
          onSelectionChanged={onSelectionChanged}
        />
      </div>
      <div className="flex mt-4 justify-end">
        <Button variant="secondary" text="Cancel" className="w-[132px] mr-3" onClick={handleCancel} />
        <Button text="Add" className="w-[132px]" onClick={handleSubmit} disabled={selectedRows.length === 0} />
      </div>
      <ConfirmationDialog
        variant="delete"
        show={confirm}
        onYesClick={handleClose}
        content={{ question: 'Are you sure ?', warning: '' }}
        onNoClick={() => setConfirm(false)}
        hasOverlay={false}
      />
    </PopupModal>
  );
};

export default MasterTaskList;
