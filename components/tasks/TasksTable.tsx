import Table from 'components/core-ui-lib/Table';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { filterState } from 'state/booking/filterState';
import axios from 'axios';
import { styleProps } from './tableConfig';
import NotesPopup from './NotesPopup';
import { loggingService } from 'services/loggingService';
import Loader from 'components/core-ui-lib/Loader';
import { ProductionTaskDTO } from 'interfaces';
import { useRouter } from 'next/router';
import AddTask from './modals/AddTask';
import { isNullOrEmpty } from 'utils';
import { formatDate, newDate } from 'services/dateService';
import { accessProjectManagement } from 'state/account/selectors/permissionSelector';

interface TasksTableProps {
  rowData?: any;
  columnDefs?: any;
  tableHeight?: boolean;
  showAddTask?: boolean;
  handleShowTask?: () => void;
  productionId?: number;
  setIsShowSpinner?: (value: boolean) => void;
}

export interface ProductionTaskDTOWithStringProgress extends Omit<ProductionTaskDTO, 'Progress'> {
  Progress: string;
}

export default function TasksTable({
  rowData = [],
  columnDefs = [],
  tableHeight = false,
  showAddTask,
  handleShowTask,
  productionId,
  setIsShowSpinner,
}: TasksTableProps) {
  const tableRef = useRef(null);
  const [filter, setFilter] = useRecoilState(filterState);
  const [rows, setRows] = useState([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const router = useRouter();
  const permissions = useRecoilValue(accessProjectManagement);
  const canAccessEdit = permissions.includes('ACCESS_EDIT_PROD_TASKS');
  const canEditTaskNotes = permissions.includes('EDIT_PROD_TASK_NOTES');
  const canEditTask = permissions.includes('EDIT_PROD_TASK');
  const canDeleteTask = permissions.includes('DELETE_PROD_TASK');
  const canCloneTask = true;

  const handleCellClick = (e) => {
    if (e.column.colId === 'Notes') {
      setCurrentTask(e.data);
      setShowModal(true);
    }
  };

  const handleUpdateTask = async (task: ProductionTaskDTOWithStringProgress) => {
    try {
      setIsLoading(true);
      setIsShowSpinner(true);

      const progress = parseInt(task.Progress);
      const updatedTask = {
        ...task,
        Progress: progress,
        Notes: task.Notes,
        TaskCompletedDate:
          progress < 100
            ? null
            : isNullOrEmpty(task.TaskCompletedDate)
            ? formatDate(newDate(), "E..EEE MMM dd yyyy HH:mm:ss 'GMT'XXX (zzzz)")
            : task.TaskCompletedDate,
      };
      const updatedRowData = rowData.map((row) => {
        if (row.Id === task.Id) return updatedTask;
        return row;
      });
      setIsLoading(false);
      setRows(updatedRowData);

      await axios.post(`/api/tasks/${task.PRTId ? 'update/recurring' : 'update/single'}`, updatedTask);
      await updateTableData();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      loggingService.logError(error);
    }
    setIsShowSpinner(false);
  };

  const onCellValueChange = async (e) => {
    await handleUpdateTask(e.data);
  };

  const handleSaveNote = async (value: string) => {
    setShowModal(false);
    setIsShowSpinner(true);
    const updatedTask = { ...currentTask, Notes: value };
    handleUpdateTask(updatedTask);
  };

  useEffect(() => {
    if (tableRef && tableRef.current && filter?.scrollToDate) {
      const rowIndex = rowData.findIndex(({ date }) => date === filter.scrollToDate);
      if (rowIndex !== -1) {
        tableRef.current?.getApi().ensureIndexVisible(rowIndex, 'middle');
        setFilter({ ...filter, scrollToDate: '' });
      }
    }
  }, [filter, rowData]);

  useEffect(() => {
    if (rowData) {
      setRows(rowData);
    }
  }, [rowData]);

  const onRowDoubleClicked = (e) => {
    if (canAccessEdit) {
      setCurrentTask(e.data);
      setIsEdit(true);
    }
  };

  const handleClose = () => {
    setIsLoading(false);
    if (isEdit) setIsEdit(false);
    else handleShowTask();
  };

  const updateTableData = async (task?: any) => {
    setIsShowSpinner(true);
    if (isNullOrEmpty(task)) {
      await router.push(router.asPath);
      return;
    }

    const updatedTask = { ...task, Progress: parseInt(task.Progress), Notes: task.Notes };
    const updatedRowData = rowData.map((row) => {
      if (row.Id === task.Id) return updatedTask;
      return row;
    });
    setIsLoading(false);
    setRows(updatedRowData);
    await router.push(router.asPath);
    setIsShowSpinner(false);
  };

  const modalData = isEdit ? { ...currentTask, ProductionId: productionId } : { ProductionId: productionId };

  return (
    <>
      <div className="w-full h-[calc(100%-140px)]">
        <Table
          columnDefs={columnDefs}
          rowData={rows}
          styleProps={styleProps}
          tableHeight={tableHeight ? 234 : 0}
          onCellValueChange={onCellValueChange}
          onCellClicked={handleCellClick}
          onRowDoubleClicked={onRowDoubleClicked}
          ref={tableRef}
          testId="table-tasks"
        />
      </div>
      <NotesPopup
        show={showModal}
        currentTask={currentTask}
        onSave={handleSaveNote}
        onCancel={() => setShowModal(false)}
        disabled={!canEditTaskNotes}
      />
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Loader variant="lg" iconProps={{ stroke: '#FFF' }} />
        </div>
      )}
      <AddTask
        visible={isEdit || showAddTask}
        onClose={handleClose}
        task={modalData}
        productionId={productionId}
        updateTableData={updateTableData}
        canEdit={!canEditTask}
        canDelete={!canDeleteTask}
        canClone={!canCloneTask}
      />
    </>
  );
}
