import Button from 'components/core-ui-lib/Button';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Table from 'components/core-ui-lib/Table';
import { getMasterTasksColumnDefs } from './tableConfig';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState } from 'state/account/userState';
import { useEffect, useMemo, useState } from 'react';
import { tileColors } from 'config/global';
import axios from 'axios';
import { MasterTask } from '@prisma/client';
import Loader from 'components/core-ui-lib/Loader';
import { ARCHIVED_OPTION_STYLES } from 'components/global/nav/ProductionJumpMenu';
import { productionJumpState } from 'state/booking/productionJumpState';
import Select from 'components/core-ui-lib/Select';
import ProductionOption from 'components/global/nav/ProductionOption';
import Checkbox from 'components/core-ui-lib/Checkbox';
import { ConfirmationDialog } from 'components/core-ui-lib';

interface ProductionTaskListProps {
  visible: boolean;
  onClose: (val?: string) => void;
  productionId?: number;
  isMaster?: boolean;
}

const LoadingOverlay = () => (
  <div className="inset-0 absolute bg-white bg-opacity-50 z-50 flex justify-center items-center">
    <Loader className="ml-2" iconProps={{ stroke: '#FFF' }} />
  </div>
);

const ProductionTaskList = ({ visible, onClose, productionId, isMaster = false }: ProductionTaskListProps) => {
  const { users } = useRecoilValue(userState);

  const styleProps = { headerColor: tileColors.tasks };
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<boolean>(false);

  const [productionJump, setProductionJump] = useRecoilState(productionJumpState);
  const [selected, setSelected] = useState(null);
  const [includeArchived, setIncludeArchived] = useState<boolean>(productionJump?.includeArchived || false);

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
    setSelectedRows(selectedData);
  };

  const handleFetchTasks = async () => {
    setLoading(true);
    try {
      console.log(selected);
      const response = await axios.get(`/api/tasks/list/${selected}`);
      setRowData(response.data[0].Tasks || []);
      console.log('raaaaah');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      console.log(selected);
      if (selected) await handleFetchTasks();
    };

    fetchTasks();
  }, [selected]);

  const handleSubmit = async () => {
    setLoading(true);
    if (isMaster) {
      try {
        const tasksData = selectedRows.map((task: MasterTask) => {
          return {
            Code: task.Code,
            Name: task.Name,
            CompleteByIsPostProduction: false,
            StartByIsPostProduction: false,
            StartByWeekNum: task.StartByWeekNum,
            CompleteByWeekNum: task.CompleteByWeekNum,
            AssignedToUserId: task.AssignedToUserId,
            Priority: task.Priority,
            Notes: task.Notes,
            TaskStartByIsPostProduction: false,
            TaskCompleteByIsPostProduction: false,
          };
        });
        const endpoint = '/api/tasks/master/multiple';
        await axios.post(endpoint, tasksData);
        setLoading(false);
        onClose('data-added');
      } catch (error) {
        setLoading(false);
        onClose();
      }
    } else {
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
        onClose('data-added');
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    }
  };

  const handleChange = (val: number) => {
    setSelected(val);
  };

  const onIncludeArchiveChange = (e) => {
    setProductionJump({ ...productionJump, includeArchived: e.target.value });
    setIncludeArchived(e.target.value);
  };

  const handleClose = () => {
    onClose();
  };

  const handleCancel = () => {
    if (selectedRows.length > 0) {
      setConfirm(true);
    } else {
      setConfirm(false);
      onClose();
    }
  };

  return (
    <PopupModal
      show={visible}
      onClose={onClose}
      title="Add from Production Task List"
      titleClass="text-primary-navy text-xl mb-2"
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
        />
        <div className="flex  items-center ml-1 mr-4">
          <Checkbox
            id="IncludeArchived"
            label="Include archived"
            checked={includeArchived}
            onChange={onIncludeArchiveChange}
            className=""
          />
        </div>
      </div>
      <div className=" w-[750px] lg:w-[1386px] h-[606px] flex flex-col mt-4">
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
        content={{
          question: 'Are you sure you want to cancel?',
          warning: 'Any unsaved changes may be lost.',
        }}
        onNoClick={() => setConfirm(false)}
        hasOverlay={false}
      />
    </PopupModal>
  );
};

export default ProductionTaskList;
