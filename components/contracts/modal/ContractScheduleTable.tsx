import Table from 'components/core-ui-lib/Table';
import { useRef, useState } from 'react';
import { contractTourScheduleColumns, contractsStyleProps } from '../tableConfig';
import { IScheduleDay } from '../types';

interface ContractScheduleTableProps {
  schedule: IScheduleDay[];
  updateSchedule: (schedule: IScheduleDay[]) => void;
}

const ContractScheduleTable = ({ schedule, updateSchedule }: ContractScheduleTableProps) => {
  const [rows, setRows] = useState(schedule);
  const tableRef = useRef(null);
  const onCellValueChange = (e) => {
    const updatedRows = rows.map((row) => (e.data.date === row.date ? e.data : row));
    setRows(updatedRows);
    updateSchedule(updatedRows);
  };

  const handleCellClick = (e) => {
    if (e.column.colId === 'delete') {
      const updatedRows = rows.filter((row) => row.date !== e.data.date);
      setRows(updatedRows);
      updateSchedule(updatedRows);
    }
  };

  return (
    <>
      <div className="w-full h-[calc(100%-140px)]">
        <Table
          columnDefs={contractTourScheduleColumns}
          rowData={rows}
          ref={tableRef}
          styleProps={contractsStyleProps}
          onCellValueChange={onCellValueChange}
          onCellClicked={handleCellClick}
        />
      </div>
    </>
  );
};

export default ContractScheduleTable;
