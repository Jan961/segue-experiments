import Button from 'components/core-ui-lib/Button';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Table from 'components/core-ui-lib/Table';
import { getProductionTasksColumnDefs } from './tableConfig';
import { useRecoilValue } from 'recoil';
import { userState } from 'state/account/userState';
import { useEffect, useMemo, useState } from 'react';
import { tileColors } from 'config/global';
import axios from 'axios';
import LoadingOverlay from '../../core-ui-lib/LoadingOverlay';
import { ARCHIVED_OPTION_STYLES } from 'components/global/nav/ProductionJumpMenu';
import { productionJumpState } from 'state/booking/productionJumpState';
import Select from 'components/core-ui-lib/Select';
import ProductionOption from 'components/global/nav/ProductionOption';
import Checkbox from 'components/core-ui-lib/Checkbox';
import ExistingTasks from './ExistingTasks';
import { isNullOrEmpty } from 'utils';
import { useRouter } from 'next/router';
import { productionState } from 'state/tasks/productionState';

interface ProductionTaskListProps {
  visible: boolean;
  onClose: (val?: string) => void;
  productionId?: number;
  isMaster?: boolean;
}

const ProductionTaskList = ({ visible, onClose, productionId, isMaster = false }: ProductionTaskListProps) => {
  const { users } = useRecoilValue(userState);
  const styleProps = { headerColor: tileColors.tasks };
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const productionJump = useRecoilValue(productionJumpState);
  const [selected, setSelected] = useState(null);
  const [includeArchived, setIncludeArchived] = useState<boolean>(false);
  const [showExistingTaskModal, setShowExistingTaskModal] = useState<boolean>(false);
  const [duplicateTasks, setDuplicateTasks] = useState([]);
  const unfilteredTasks = useRecoilValue(productionState).filter((prod) => prod.Id === productionId)[0]?.Tasks || [];
  const router = useRouter();
  const productionsData = useMemo(() => {
    const productionOptions = [];
    for (const production of productionJump.productions) {
      if (includeArchived) {
        productionOptions.push({
          Id: -1,
          ShowCode: null,
          Code: null,
          IsArchived: false,
          ...production,
          text: `${production.ShowCode}${production.Code} ${production.ShowName} ${
            production.IsArchived ? ' (A)' : ''
          }`,
          value: production.Id,
        });
      } else if (!production.IsArchived) {
        productionOptions.push({
          Id: -1,
          ShowCode: null,
          Code: null,
          IsArchived: false,
          ...production,
          text: `${production.ShowCode}${production.Code} ${production.ShowName} ${
            production.IsArchived ? ' (A)' : ''
          }`,
          value: production.Id,
        });
      }
    }
    return productionOptions;
  }, [productionJump.productions, includeArchived]);

  const usersList = useMemo(() => {
    return Object.values(users).map(({ AccUserId, FirstName = '', LastName = '' }) => ({
      value: AccUserId,
      text: `${FirstName || ''} ${LastName || ''}`,
    }));
  }, [users]);

  const columnDefs = getProductionTasksColumnDefs(usersList);

  const [selectedRows, setSelectedRows] = useState([]);

  const onSelectionChanged = (event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };

  const findDuplicateTasks = () => {
    const duplicateTasks = [];
    const ptrList = [];
    const singleList = [];
    selectedRows.forEach((task) => {
      unfilteredTasks.forEach((existingTask) => {
        if (isNullOrEmpty(existingTask?.CopiedFrom)) return;
        if (
          existingTask?.CopiedFrom === 'R' &&
          task?.PRTId === existingTask.CopiedId &&
          !ptrList.includes(task.PRTId)
        ) {
          duplicateTasks.push(task);
          ptrList.push(task.PRTId);
        } else if (
          existingTask?.CopiedFrom === 'P' &&
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

  const handleFetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/tasks/addfrom/production/list/${selected}`);
      setRowData(response.data[0].Tasks || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      if (selected) await handleFetchTasks();
    };

    fetchTasks();
  }, [selected]);

  const onRowClicked = (event) => {
    if (event.event.target.type !== 'checkbox') {
      event.node.setSelected(!event.node.isSelected());
    }
  };

  const createTasks = async () => {
    setLoading(true);
    try {
      const endpoint = `/api/tasks/addfrom/production/${isMaster ? 'master' : 'production'}`;
      const tasksData = selectedRows.map((task) => {
        return {
          Id: task.Id,
          ProductionId: selected,
          Code: task.Code,
          Name: task.Name,
          CompleteByIsPostProduction: false,
          StartByIsPostProduction: false,
          StartByWeekNum: task.StartByWeekNum,
          CompleteByWeekNum: task.CompleteByWeekNum,
          TaskAssignedToAccUserId: task.TaskAssignedToAccUserId,
          Progress: 0,
          Priority: task.Priority,
          PRTId: task.PRTId,
          MTRId: task.MTRId,
          FromWeekNum: task.TaskRepeatFromWeekNum,
          Interval: task.RepeatInterval,
          ToWeekNum: task.TaskRepeatToWeekNum,
        };
      });
      await axios.post(endpoint, { selectedTaskList: tasksData, ProductionId: productionId });
      setLoading(false);
      await router.replace(router.asPath);
      onClose('data-added');
    } catch (error) {
      setLoading(false);
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

  const handleChange = (val: number) => {
    setSelected(val);
  };

  const onIncludeArchiveChange = (e) => {
    setIncludeArchived(e.target.value);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <PopupModal
      show={visible}
      onClose={onClose}
      title="Add from Production Task List"
      titleClass="text-primary-navy text-xl mb-2"
      hasOverlay={showExistingTaskModal}
    >
      <div className="bg-white border-primary-border rounded-md border shadow-md flex items-center w-[566px]">
        <Select
          className="border-0 !shadow-none w-[420px]"
          value={selected}
          label="Production"
          placeholder="Please select a Production"
          renderOption={(option) => <ProductionOption option={option} />}
          customStyles={ARCHIVED_OPTION_STYLES}
          options={productionsData}
          onChange={handleChange}
          isSearchable
          isClearable={false}
          testId="sel-production"
          key={includeArchived.toString()}
        />
        <div className="flex  items-center ml-1 mr-4">
          <Checkbox
            id="IncludeArchived"
            label="Include archived"
            checked={includeArchived}
            onChange={onIncludeArchiveChange}
            className=""
            testId="chk-task-name"
          />
        </div>
      </div>
      <div className=" w-[750px] lg:w-[1386px] h-[606px] flex flex-col mt-4">
        {loading && <LoadingOverlay spinner={false} />}
        <Table
          columnDefs={columnDefs}
          rowData={rowData}
          styleProps={styleProps}
          rowSelection="multiple"
          onSelectionChanged={onSelectionChanged}
          onRowClicked={onRowClicked}
          testId="table-prod-tasks"
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
          testId="btn-task-cancel"
        />
        <Button
          text="Add"
          className="w-[132px]"
          onClick={handleSubmit}
          disabled={selectedRows.length === 0}
          testId="btn-task-save"
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

export default ProductionTaskList;
