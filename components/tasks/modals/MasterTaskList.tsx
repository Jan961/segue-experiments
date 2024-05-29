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

interface MasterTaskListProps {
  visible: boolean;
  onClose: () => void;
}

const MasterTaskList = ({ visible, onClose }: MasterTaskListProps) => {
  const { users } = useRecoilValue(userState);

  const styleProps = { headerColor: tileColors.tasks };
  const [rowData, setRowData] = useState([]);
  const [confirm, setConfirm] = useState<boolean>(false);

  const handleFetchTasks = async () => {
    const response = await axios.get(`/api/tasks/master/list`);
    setRowData(response.data || []);
  };

  useEffect(() => {
    handleFetchTasks();
  }, []);

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

  return (
    <PopupModal show={visible} onClose={onClose} title="Add Master Task" titleClass="text-primary-navy text-xl mb-2">
      <div className=" w-[750px] lg:w-[1386px] h-full flex flex-col ">
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
        <Button text="Add" className="w-[132px]" onClick={null} />
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
