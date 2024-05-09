import Table from 'components/core-ui-lib/Table';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { filterState } from 'state/booking/filterState';
import axios from 'axios';
import { styleProps } from './tableConfig';
import NotesPopup from './NotesPopup';
import { Spinner } from 'components/global/Spinner';
import { loggingService } from 'services/loggingService';

interface TasksTableProps {
  rowData?: any;
  columnDefs?: any;
  tableHeight?: boolean;
}

const LoadingOverlay = () => (
  <div className="inset-0 absolute bg-white bg-opacity-50 z-50 flex justify-center items-center">
    <Spinner size="md" />
  </div>
);

export default function TasksTable({ rowData = [], columnDefs = [], tableHeight = false }: TasksTableProps) {
  const tableRef = useRef(null);
  const [filter, setFilter] = useRecoilState(filterState);
  const [rows, setRows] = useState([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCellClick = (e) => {
    if (e.column.colId === 'Notes') {
      setCurrentTask(e.data);
      setShowModal(true);
    }
  };

  const handleUpdateTask = async (task: any) => {
    setIsLoading(true);
    try {
      const updatedTask = { ...task, Progress: parseInt(task.Progress), Notes: task.Notes };
      await axios.post('/api/tasks/update', updatedTask);
      const updatedRowData = rowData.map((row) => {
        if (row.Id === task.Id) return updatedTask;
        return row;
      });
      setRows(updatedRowData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      loggingService.logError(error);
    }
  };

  const onCellValueChange = (e) => {
    handleUpdateTask(e.data);
  };

  const handleSaveNote = async (value: string) => {
    setShowModal(false);
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
  }, [filter, setFilter, rowData]);

  useEffect(() => {
    if (rowData) {
      setRows(rowData);
    }
  }, [rowData]);

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
          ref={tableRef}
        />
      </div>
      <NotesPopup
        show={showModal}
        currentTask={currentTask}
        onSave={handleSaveNote}
        onCancel={() => setShowModal(false)}
      />
      {isLoading && <LoadingOverlay />}
    </>
  );
}
