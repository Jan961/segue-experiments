// import axios from "axios";
import axios from 'axios';
import { styleProps } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import Checkbox from 'components/core-ui-lib/Checkbox';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import Table from 'components/core-ui-lib/Table';
import { LoadingOverlay } from 'components/shows/ShowsTable';
import { getConvertedPayload } from 'components/shows/constants';
import { productionsTableConfig } from 'components/shows/table/tableConfig';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import applyTransactionToGrid from 'utils/applyTransactionToGrid';

type ProductionsViewProps = {
  showData: any;
  showName: string;
  onClose: () => void;
};

const intProduction = {
  Id: null,
  ShowId: null,
  Code: '',
  ShowName: '',
  ShowCode: '',
  IsArchived: false,
  StartDate: '',
  EndDate: '',
  SalesFrequency: '',
  SalesEmail: '',
  RegionId: [],
};

const rowClassRules = {
  'custom-red-row': (params) => {
    const rowData = params.data;
    return rowData && rowData.highlightRow;
  },
  'custom-grey-row': (params) => {
    const rowData = params.data;
    return rowData && rowData.IsArchived;
  },
};

const ProductionsView = ({ showData, showName, onClose }: ProductionsViewProps) => {
  const tableRef = useRef(null);
  const router = useRouter();

  const [confirm, setConfirm] = useState<boolean>(false);
  const [productionId, setProductionId] = useState<number>(0);
  const [currentProduction, setCurrentProduction] = useState(intProduction);
  const [isAddRow, setIsAddRow] = useState<boolean>(false);
  const [rowIndex, setRowIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);

  const gridOptions = {
    getRowId: (params) => {
      return params.data.Id;
    },
  };

  const addNewRow = () => {
    setIsAddRow(!isAddRow);
  };

  const [isArchived, setIsArchived] = useState<boolean>(false);

  const unArchivedList = useMemo(() => {
    return showData.productions.filter((item) => !item.IsArchived);
  }, [showData, isArchived]);

  const archivedList = useMemo(() => {
    return showData.productions.filter((item) => item.IsArchived);
  }, [showData, isArchived]);

  const rowsData = useMemo(() => {
    return [...unArchivedList, ...archivedList];
    // return [...unArchivedList];
  }, [unArchivedList, archivedList, isArchived]);

  const handleArchive = () => {
    setIsArchived(!isArchived);
  };

  useEffect(() => {
    if (isAddRow) {
      applyTransactionToGrid(tableRef, {
        add: [
          {
            ...intProduction,
            ShowId: showData.Id,
            ShowName: showData.Name,
            ShowCode: showData.Code,
            highlightRow: true,
          },
        ],
        addIndex: 0,
      });
    }
  }, [isAddRow, tableRef]);

  const handleCellClick = async (e) => {
    setProductionId(e.data.Id);
    setRowIndex(e.rowIndex);
    if (e.column.colId === 'deleteId') {
      setConfirm(true);
    } else if (e.column.colId === 'EditId_1' && isEdited) {
      setIsLoading(true);
      try {
        const payloadData = { ...currentProduction, IsArchived: e.data.IsArchived };
        await axios.put(`/api/shows/productions/${currentProduction?.Id}`, payloadData);
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
        setCurrentProduction(intProduction);
        router.replace(router.asPath);
      }
    } else if (isAddRow && e.column.colId === 'editId') {
      setIsLoading(true);
      try {
        const payloadData = getConvertedPayload(e.data);
        await axios.post(`/api/productions/create`, payloadData);
      } finally {
        setIsEdited(false);
        setCurrentProduction(intProduction);
        addNewRow();
        router.replace(router.asPath);
        setIsLoading(false);
      }
    }
  };

  const handleCellChanges = (e) => {
    setCurrentProduction(e.data);
    setIsEdited(true);
  };

  const handleDelete = async () => {
    setConfirm(false);
    setIsLoading(true);
    try {
      await axios.delete(`/api/productions/delete/${productionId}`);
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
      <div className="flex justify-between">
        <div className="text-primary-navy text-xl my-3 font-bold">{showName}</div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <Checkbox
              className="flex flex-row-reverse"
              checked={isArchived}
              label="Include archived"
              id={''}
              onChange={handleArchive}
            />
            <Button disabled={isAddRow} onClick={addNewRow} text="Add New Production" />
          </div>
        </div>
      </div>
      <div className=" w-[750px] lg:w-[1568px] h-full flex flex-col ">
        <Table
          ref={tableRef}
          columnDefs={productionsTableConfig}
          rowData={rowsData}
          styleProps={styleProps}
          onCellClicked={handleCellClick}
          gridOptions={gridOptions}
          onCellValueChange={handleCellChanges}
          headerHeight={30}
          rowClassRules={rowClassRules}
        />

        {isLoading && <LoadingOverlay />}
      </div>
      <div className="pt-8 w-full grid grid-cols-2 items-center  justify-end  justify-items-end gap-3">
        <div />
        <div className="flex gap-4">
          <Button className="w-33 " variant="secondary" onClick={onClose} text="Cancel" />
          <Button className=" w-33" text="Save and Close" />
        </div>
      </div>
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

export default ProductionsView;
