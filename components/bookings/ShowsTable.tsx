import { Show } from '@prisma/client';
import Table from 'components/core-ui-lib/Table';
import { bookingShowsTableConfig, styleProps } from './table/tableConfig';
import { useEffect, useRef, useState } from 'react';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import axios from 'axios';

const ShowsTable = ({
  rowsData,
  isAddRow = false,
}: {
  rowsData: Show[];
  isAddRow: boolean;
  addNewRow: (gridApi) => void;
}) => {
  const tableRef = useRef(null);

  const [confirm, setConfirm] = useState<boolean>(false);
  const [showId, setShowId] = useState<number>(0);
  const [currentShow, setCurrentShow] = useState({ Id: '' });
  const [rowIndex, setRowIndex] = useState<number | null>(null);

  const gridOptions = {
    getRowId: (params) => {
      return params.data.Id;
    },
  };

  useEffect(() => {
    if (isAddRow && tableRef) {
      const gridApi = tableRef.current.getApi();
      gridApi.applyTransaction({ add: [{}], addIndex: 0 });
    }
  }, [isAddRow, tableRef]);

  const handleCellClick = async (e) => {
    setShowId(e.data.Id);
    setRowIndex(e.rowIndex);
    if (e.column.colId === 'Id') {
      setConfirm(true);
    } else if (e.column.colId === 'EditId') {
      await axios.post(`/api/shows/update/${currentShow?.Id}`, currentShow);
    }
  };

  const handleCellChanges = (e) => {
    setCurrentShow(e.data);
  };

  const handleDelete = async () => {
    setConfirm(false);
    await axios.delete(`/api/shows/delete/${showId}`).then(() => {
      const gridApi = tableRef.current.getApi();
      const rowDataToRemove = gridApi.getDisplayedRowAtIndex(rowIndex).data;
      const transaction = {
        remove: [rowDataToRemove],
      };
      gridApi.applyTransaction(transaction);
    });
  };

  return (
    <>
      <Table
        columnDefs={bookingShowsTableConfig}
        ref={tableRef}
        rowData={rowsData}
        styleProps={styleProps}
        onCellClicked={handleCellClick}
        gridOptions={gridOptions}
        onCellValueChange={handleCellChanges}
      />
      <ConfirmationDialog
        variant={'delete'}
        show={confirm}
        onYesClick={handleDelete}
        onNoClick={() => setConfirm(false)}
        hasOverlay={false}
      />
    </>
  );
};

export default ShowsTable;
