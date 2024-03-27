// import axios from "axios";
import { styleProps } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import Checkbox from 'components/core-ui-lib/Checkbox';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import Table from 'components/core-ui-lib/Table';
import { LoadingOverlay } from 'components/shows/ShowsTable';
import { productionsTableConfig } from 'components/shows/table/tableConfig';
import { useEffect, useMemo, useRef, useState } from 'react';
import applyTransactionToGrid from 'utils/applyTransactionToGrid';

type ProductionsViewProps = {
  showData: any;
  showName: string;
};

const ProductionsView = ({ showData, showName }: ProductionsViewProps) => {
  const tableRef = useRef(null);
  const [confirm, setConfirm] = useState<boolean>(false);
  const [productionId, setProductionId] = useState<number>(0);
  const [currentProduction, setCurrentProduction] = useState({});
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

  console.log(productionId, rowIndex);

  const rowsData = useMemo(() => {
    if (isArchived) return [...unArchivedList, ...archivedList];
    return [...unArchivedList];
  }, [unArchivedList, archivedList, isArchived]);

  const updatedRowsData = rowsData.map((item) => {
    return {
      ...item,
      Name: showData.Name + showData.Code,
    };
  });

  const handleArchive = () => {
    setIsArchived(!isArchived);
  };

  useEffect(() => {
    if (isAddRow) {
      applyTransactionToGrid(tableRef, { add: [{}], addIndex: 0 });
    }
  }, [isAddRow, tableRef]);

  const handleCellClick = async (e) => {
    console.log(e);
    setProductionId(e.data.Id);
    setRowIndex(e.rowIndex);
    if (e.column.colId === 'Id_2') {
      setConfirm(true);
    } else if (e.column.colId === '"EditId_1"' && isEdited) {
      setIsLoading(true);
      try {
        const payloadData = { ...currentProduction, IsArchived: e.data.IsArchived };
        // await axios.put(`/api/shows/update/${currentProduction?.Id}`, payloadData);
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
        // setCurrentProduction(intShowData);
      }
    } else if (isAddRow && e.column.colId === 'editId') {
      setIsLoading(true);
      try {
        // const data = { ...intShowData, Code: currentShow.Code, Name: currentShow.Name };
        // delete data.Id;
        // await axios.post(`/api/shows/create`, data);
      } finally {
        setIsLoading(false);
        setIsEdited(false);
        // setCurrentShow(intShowData);
        addNewRow();
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
    // try {
    //   await axios.delete(`/api/shows/delete/${showId}`);
    //   const gridApi = tableRef.current.getApi();
    //   const rowDataToRemove = gridApi.getDisplayedRowAtIndex(rowIndex).data;
    //   const transaction = {
    //     remove: [rowDataToRemove],
    //   };
    //   applyTransactionToGrid(tableRef, transaction);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="text-primary-navy text-xl my-2 font-bold">{showName}</div>
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
      <div className=" w-[750px] lg:w-[1450px] h-full flex flex-col ">
        <Table
          ref={tableRef}
          columnDefs={productionsTableConfig}
          rowData={updatedRowsData}
          styleProps={styleProps}
          onCellClicked={handleCellClick}
          gridOptions={gridOptions}
          onCellValueChange={handleCellChanges}
          headerHeight={30}
        />
        {/* <div className="pt-8 w-full grid grid-cols-2 items-center  justify-end  justify-items-end gap-3">
                    <Button className=" w-33  place-self-start  " text="Check Mileage" onClick={handeCheckMileageClick} />
                    <div className="flex gap-4">
                        <Button className="w-33" variant="secondary" text="Back" onClick={handleBackButtonClick} />
                        <Button className="w-33 " variant="secondary" text="Cancel" onClick={handleCancelButtonClick} />
                        <Button className=" w-33" text="Preview Booking" onClick={handePreviewBookingClick} />
                    </div>
                </div> */}
        <ConfirmationDialog
          variant={'delete'}
          show={confirm}
          onYesClick={handleDelete}
          onNoClick={() => setConfirm(false)}
          hasOverlay={false}
        />
        {isLoading && <LoadingOverlay />}
      </div>
    </>
  );
};

export default ProductionsView;
