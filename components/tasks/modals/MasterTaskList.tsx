import Button from 'components/core-ui-lib/Button';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Table from 'components/core-ui-lib/Table';
import { getMasterTasksColumnDefs } from './tableConfig';
import { useRecoilValue } from 'recoil';
import { userState } from 'state/account/userState';
import { useEffect, useMemo, useState } from 'react';
import { tileColors } from 'config/global';
import axios from 'axios';
import LoadingOverlay from '../../core-ui-lib/LoadingOverlay';
import { isNullOrEmpty } from 'utils';
import ExistingTasks from './ExistingTasks';
import { useRouter } from 'next/router';
import { productionState } from 'state/tasks/productionState';

interface MasterTaskListProps {
  visible: boolean;
  onClose: (val?: string) => void;
  productionId?: number;
  isMaster?: boolean;
}

const MasterTaskList = ({ visible, onClose, productionId }: MasterTaskListProps) => {
  const { users } = useRecoilValue(userState);

  const styleProps = { headerColor: tileColors.tasks };
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showExistingTaskModal, setShowExistingTaskModal] = useState<boolean>(false);
  const [duplicateTasks, setDuplicateTasks] = useState([]);
  const unfilteredTasks = useRecoilValue(productionState).filter((prod) => prod.Id === productionId)[0]?.Tasks || [];
  const router = useRouter();
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

  const findDuplicateTasks = () => {
    const duplicateTasks = [];
    const mtrList = [];
    const singleList = [];
    selectedRows.forEach((task) => {
      unfilteredTasks.forEach((existingTask) => {
        if (isNullOrEmpty(existingTask?.CopiedFrom)) return;
        if (
          existingTask?.CopiedFrom === 'D' &&
          task?.MTRId === existingTask.CopiedId &&
          !mtrList.includes(task.MTRId)
        ) {
          duplicateTasks.push(task);
          mtrList.push(task.MTRId);
        } else if (
          existingTask?.CopiedFrom === 'M' &&
          task?.Id === existingTask.CopiedId &&
          !singleList.includes(task.Id)
        ) {
          duplicateTasks.push(task);
          singleList.push(task.Id);
        }
      });
    });
    return duplicateTasks;
  };

  useEffect(() => {
    handleFetchTasks();
  }, [users]);

  const usersList = useMemo(() => {
    return Object.values(users).map(({ AccUserId, FirstName = '', LastName = '' }) => ({
      value: AccUserId,
      text: `${FirstName || ''} ${LastName || ''}`,
    }));
  }, [users]);

  const columnDefs = getMasterTasksColumnDefs(usersList);

  const [selectedRows, setSelectedRows] = useState([]);

  const onSelectionChanged = (event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };

  const handleClose = () => {
    onClose();
  };

  const onRowClicked = (event) => {
    if (event.event.target.type !== 'checkbox') {
      event.node.setSelected(!event.node.isSelected());
    }
  };

  const createTasks = async () => {
    setLoading(true);
    try {
      const endpoint = `/api/tasks/addfrom/master/${isNullOrEmpty(productionId) ? 'master' : 'production'}`;
      await axios.post(endpoint, { selectedTaskList: selectedRows, ProductionId: productionId });
      setLoading(false);
      await router.replace(router.asPath);
      onClose('data-added');
    } catch (error) {
      setLoading(false);
      onClose();
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    const duplicates = findDuplicateTasks();
    setDuplicateTasks(duplicates);
    if (duplicates.length > 0) {
      setShowExistingTaskModal(true);
    } else {
      await createTasks();
    }
  };

  return (
    <PopupModal
      show={visible}
      onClose={onClose}
      title="Add Master Task"
      titleClass="text-primary-navy text-xl mb-2"
      hasOverlay={showExistingTaskModal}
    >
      <div className=" w-[750px] lg:w-[1386px] h-[606px] flex flex-col ">
        {loading && <LoadingOverlay spinner={false} />}
        <Table
          columnDefs={columnDefs}
          rowData={rowData}
          styleProps={styleProps}
          onRowClicked={onRowClicked}
          rowSelection="multiple"
          onSelectionChanged={onSelectionChanged}
          testId="table-add-from-master"
          gridOptions={{
            suppressRowClickSelection: true,
          }}
        />
      </div>
      <div className="flex mt-4 justify-end">
        <Button
          variant="secondary"
          text="Cancel"
          className="w-[132px] mr-3"
          onClick={handleClose}
          testId="btn-master-cancel"
        />
        <Button
          text="Add"
          className="w-[132px]"
          onClick={handleSubmit}
          disabled={selectedRows.length === 0}
          testId="btn-master-add-from"
        />
      </div>
      <ExistingTasks
        visible={showExistingTaskModal}
        onCancel={() => {
          setShowExistingTaskModal(false);
        }}
        onConfirm={async () => {
          setShowExistingTaskModal(false);
          await createTasks();
        }}
        duplicateList={duplicateTasks}
      />
    </PopupModal>
  );
};

export default MasterTaskList;
