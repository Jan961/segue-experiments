import { Show } from 'prisma/generated/prisma-client';
import Table from 'components/core-ui-lib/Table';
import { styleProps } from '../bookings/table/tableConfig';
import { useEffect, useMemo, useRef, useState } from 'react';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import axios from 'axios';
import applyTransactionToGrid from 'utils/applyTransactionToGrid';
import { useRouter } from 'next/router';
import { omit } from 'radash';
import { ProductionDTO } from 'interfaces';
import LoadingOverlay from 'components/core-ui-lib/LoadingOverlay';
import { showsTableConfig } from './table/tableConfig';
import ProductionsView from './modal/Views/ProductionsView';
import { notify } from 'components/core-ui-lib';
import { isNullOrEmpty } from 'utils';
import { useRecoilValue } from 'recoil';
import { accessShows } from 'state/account/selectors/permissionSelector';

const rowClassRules = {
  'custom-red-row': (params) => {
    const rowData = params.data;
    // Apply custom style if the 'highlightRow' property is true
    return rowData && rowData.highlightRow;
  },
  'custom-grey-row': (params) => {
    const rowData = params.data;
    return rowData && rowData.IsArchived;
  },
};

const intShowData = {
  Id: null,
  Code: '',
  Name: '',
  Type: 'P',
  IsArchived: false,
  productions: [],
};
const ShowsTable = ({
  rowsData,
  isAddRow = false,
  addNewRow,
  handleEdit,
  isArchived = false,
  setIsAddRow,
}: {
  rowsData: (Show & { productions: ProductionDTO[] })[];
  isAddRow: boolean;
  addNewRow: () => void;
  isArchived: boolean;
  handleEdit: () => void;
  setIsAddRow: (value: boolean) => void;
}) => {
  const permissions = useRecoilValue(accessShows);
  const tableRef = useRef(null);
  const router = useRouter();
  const [confirm, setConfirm] = useState<boolean>(false);
  const [showId, setShowId] = useState<number>(0);
  const [currentShow, setCurrentShow] = useState(intShowData);
  const [rowIndex, setRowIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showProductionsModal, setShowProductionsModal] = useState<boolean>(false);

  const gridOptions = {
    getRowId: (params) => {
      return params.data.Id;
    },
    overlayLoadingTemplate: isLoading && <LoadingOverlay />,
  };

  useEffect(() => {
    if (isAddRow) {
      applyTransactionToGrid(tableRef, { add: [{ highlightRow: true }], addIndex: 0 });
    }
  }, [isAddRow, tableRef]);

  useEffect(() => {
    if (showProductionsModal) {
      const current = rowsData.find((row) => row.Id === currentShow.Id);
      if (current) {
        setCurrentShow(current);
      }
    }
  }, [rowsData]);

  const numArchivedShows = useMemo(() => {
    return rowsData.reduce((acc, row) => {
      return acc + row.productions.filter((prod) => prod.IsArchived).length;
    }, 0);
  }, [rowsData]);

  const updateShowData = (showData) => {
    rowsData = rowsData.map((show) => (show.Id === showData.Id ? showData : show));
  };

  const handleCellClick = async (e) => {
    setShowId(e.data.Id);
    setRowIndex(e.rowIndex);
    if (e.column.colId === 'Id') {
      // only allow deletion if show has no productions
      // button is disabled if show has productions but has no effect on clicking cell
      const numProductions = e.data?.productions?.length;
      if (numProductions === 0 || isNullOrEmpty(numProductions)) {
        setConfirm(true);
      }
    } else if (e.column.colId === 'productions' && e.data.Id) {
      if (permissions.includes('ACCESS_VIEW_EDIT_PRODUCTIONS')) {
        setShowProductionsModal(true);
        setCurrentShow(e.data);
      }
    } else if (e.column.colId === 'EditId' && currentShow?.Id) {
      if (!(currentShow?.Code?.length > 0)) {
        notify.error('Error Creating Show. Please enter a show code');
      } else if (!(currentShow?.Name?.length >= 2)) {
        notify.error('Error Creating Show. Show Name needs to be at least 2 characters');
      } else {
        setIsLoading(true);
        try {
          const payloadData = { ...currentShow, IsArchived: e.data.IsArchived };
          await axios.put(`/api/shows/update/${currentShow?.Id}`, omit(payloadData, ['productions']));
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
          handleEdit();
          setCurrentShow(intShowData);
          router.replace(router.asPath);
        }
      }
    } else if (isAddRow && e.column.colId === 'EditId') {
      if (!(currentShow?.Code?.length > 0)) {
        notify.error('Error Creating Show. Please enter a show code');
      } else if (!(currentShow?.Name?.length >= 2)) {
        notify.error('Error Creating Show. Show Name needs to be at least 2 characters');
      } else {
        setIsLoading(true);
        try {
          const data = { ...intShowData, Code: currentShow.Code, Name: currentShow.Name };
          await axios.post(`/api/shows/create`, omit(data, ['productions', 'Id']));
          handleEdit();
          setCurrentShow(intShowData);
          addNewRow();
          router.replace(router.asPath);
          setIsLoading(false);
        } catch (error) {
          notify.error('Error Creating Show. Please try again');
          setIsLoading(false);
        }
      }
    }
  };

  const handleCellChanges = (e) => {
    setCurrentShow(e.data);
    handleEdit();
  };

  const handleDelete = async () => {
    setConfirm(false);
    setIsLoading(true);
    try {
      if (!isNullOrEmpty(showId)) {
        await axios.delete(`/api/shows/delete/${showId}`);
      } else {
        setIsAddRow(false);
      }
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
    <div className="relative">
      <Table
        columnDefs={showsTableConfig(permissions)}
        ref={tableRef}
        rowData={rowsData}
        styleProps={styleProps}
        onCellClicked={handleCellClick}
        gridOptions={gridOptions}
        onCellValueChange={handleCellChanges}
        rowClassRules={rowClassRules}
        key={numArchivedShows}
      />
      <ConfirmationDialog
        variant="delete"
        show={confirm}
        onYesClick={handleDelete}
        onNoClick={() => setConfirm(false)}
        hasOverlay={false}
      />
      {isLoading && <LoadingOverlay />}

      {showProductionsModal && (
        <ProductionsView
          visible={showProductionsModal}
          onClose={(showData) => {
            updateShowData(showData);
            setShowProductionsModal(false);
          }}
          showData={currentShow}
        />
      )}
    </div>
  );
};

export default ShowsTable;
