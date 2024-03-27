import { Show } from '@prisma/client';
import Table from 'components/core-ui-lib/Table';
import { styleProps } from '../bookings/table/tableConfig';
import { useEffect, useRef, useState } from 'react';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import axios from 'axios';
import { Spinner } from 'components/global/Spinner';
import { tableConfig } from './table/tableConfig';
import applyTransactionToGrid from 'utils/applyTransactionToGrid';
import Prodcutions from './modal/Productions';

export const LoadingOverlay = () => (
  <div className="inset-0 absolute bg-white bg-opacity-50 z-50 flex justify-center items-center">
    <Spinner size="lg" />
  </div>
);

const intShowData = {
  Id: '',
  Code: '',
  Name: '',
  Type: 'P',
  IsArchived: false,
};
const ShowsTable = ({
  rowsData,
  isAddRow = false,
  addNewRow,
  isArchived = false,
}: {
  rowsData: Show[];
  isAddRow: boolean;
  addNewRow: () => void;
  isArchived: boolean;
}) => {
  const tableRef = useRef(null);

  const [confirm, setConfirm] = useState<boolean>(false);
  const [showId, setShowId] = useState<number>(0);
  const [currentShow, setCurrentShow] = useState(intShowData);
  const [rowIndex, setRowIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [showProductionsModal, setShowProductionsModal] = useState<boolean>(false);

  const gridOptions = {
    getRowId: (params) => {
      return params.data.Id;
    },
    overlayLoadingTemplate: isLoading && <LoadingOverlay />,
  };

  useEffect(() => {
    if (isAddRow) {
      applyTransactionToGrid(tableRef, { add: [{}], addIndex: 0 });
    }
  }, [isAddRow, tableRef]);

  const handleCellClick = async (e) => {
    console.log(e);
    setShowId(e.data.Id);
    setRowIndex(e.rowIndex);
    if (e.column.colId === 'Id') {
      setConfirm(true);
    } else if (e.column.colId === 'productions') {
      setShowProductionsModal(true);
      setCurrentShow(e.data);
    } else if (
      e.column.colId === 'EditId' &&
      currentShow?.Id &&
      currentShow?.Name.length > 2 &&
      currentShow?.Code.length > 1 &&
      isEdited
    ) {
      setIsLoading(true);
      try {
        const payloadData = { ...currentShow, IsArchived: e.data.IsArchived };
        await axios.put(`/api/shows/update/${currentShow?.Id}`, payloadData);
        if (payloadData.IsArchived && !isArchived) {
          const gridApi = tableRef.current.getApi();
          const rowDataToRemove = gridApi.getDisplayedRowAtIndex(e.rowIndex).data;
          const transaction = {
            remove: [rowDataToRemove],
          };
          applyTransactionToGrid(tableRef, transaction);
        }
      } finally {
        setIsLoading(false);
        setIsEdited(false);
        setCurrentShow(intShowData);
      }
    } else if (
      isAddRow &&
      e.column.colId === 'editId' &&
      currentShow?.Name.length > 2 &&
      currentShow?.Code.length > 1
    ) {
      setIsLoading(true);
      try {
        const data = { ...intShowData, Code: currentShow.Code, Name: currentShow.Name };
        delete data.Id;
        await axios.post(`/api/shows/create`, data);
      } finally {
        setIsLoading(false);
        setIsEdited(false);
        setCurrentShow(intShowData);
        addNewRow();
      }
    }
  };

  const handleCellChanges = (e) => {
    setCurrentShow(e.data);
    setIsEdited(true);
  };

  const handleDelete = async () => {
    setConfirm(false);
    setIsLoading(true);
    try {
      await axios.delete(`/api/shows/delete/${showId}`);
      const gridApi = tableRef.current.getApi();
      const rowDataToRemove = gridApi.getDisplayedRowAtIndex(rowIndex).data;
      const transaction = {
        remove: [rowDataToRemove],
      };
      applyTransactionToGrid(tableRef, transaction);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Table
        columnDefs={tableConfig}
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
      {isLoading && <LoadingOverlay />}

      {showProductionsModal && (
        <Prodcutions
          visible={showProductionsModal}
          onClose={() => setShowProductionsModal(false)}
          showData={currentShow}
        />
      )}
    </>
  );
};

export default ShowsTable;
