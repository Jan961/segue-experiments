import axios from 'axios';
import { styleProps } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import Checkbox from 'components/core-ui-lib/Checkbox';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import Table from 'components/core-ui-lib/Table';
import { LoadingOverlay } from 'components/shows/ShowsTable';
import { getProductionsConvertedPayload } from 'components/shows/constants';
import { productionsTableConfig } from 'components/shows/table/tableConfig';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import applyTransactionToGrid from 'utils/applyTransactionToGrid';
import UploadModal from 'components/core-ui-lib/UploadModal';
import { FileDTO } from 'interfaces';
import useComponentMountStatus from 'hooks/useComponentMountStatus';
import { sortByProductionStartDate } from './util';
import { notify } from 'components/core-ui-lib/Notifications';
import { ToastMessages } from 'config/shows';
interface ProductionsViewProps {
  showData: any;
  showName: string;
  onClose: () => void;
}

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
  RegionList: [],
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
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<any>(false);
  const [productionUploadMap, setProductionUploadMap] = useState<Record<string, FileDTO>>(() => {
    return showData.productions.reduce((prodImageMap, production) => {
      prodImageMap[production.Id] = production.Image;
      return prodImageMap;
    }, {});
  });
  const [editedOrAddedRecords, setEditedOrAddedRecords] = useState([]);
  const isMounted = useComponentMountStatus();
  const productionColumDefs = useMemo(() => (isMounted ? productionsTableConfig : []), [isMounted]);

  const gridOptions = {
    getRowId: (params) => {
      return params.data.Id;
    },
  };

  const addNewRow = () => {
    setIsAddRow(!isAddRow);
  };

  const [isArchived, setIsArchived] = useState<boolean>(true);

  const unArchivedList = useMemo(() => {
    return sortByProductionStartDate(showData.productions.filter((item) => !item.IsArchived && !item.IsDeleted));
  }, [showData, isArchived]);

  const archivedList = useMemo(() => {
    return sortByProductionStartDate(showData.productions.filter((item) => item.IsArchived && !item.IsDeleted));
  }, [showData, isArchived]);

  const rowsData = useMemo(() => {
    if (isArchived) return [...unArchivedList, ...archivedList];
    return [...unArchivedList];
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSave = async (currentProd: any) => {
    if ('DateBlock[0].StartDate' in currentProd && 'DateBlock[0].EndDate' in currentProd) {
      setIsLoading(true);
      try {
        const payloadData = getProductionsConvertedPayload(currentProd, false);
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

  const onSave = (file, onProgress, onError, onUploadingImage) => {
    const formData = new FormData();
    formData.append('file', file[0].file);
    formData.append('path', `images/production${currentProduction.Id ? '/' + currentProduction.Id : ''}`);

    let progress = 0; // to track overall progress
    let slowProgressInterval; // interval for slow progress simulation

    axios
      .post('/api/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (percentCompleted <= 50) {
            progress = percentCompleted;
          } else if (percentCompleted === 100) {
            progress = 50;
            clearInterval(slowProgressInterval);
            slowProgressInterval = setInterval(() => {
              if (progress < 95) {
                progress += 0.5;
                onProgress(file[0].file, progress);
              } else {
                clearInterval(slowProgressInterval);
              }
            }, 100);
          }

          onProgress(file[0].file, progress);
        },
      }) // eslint-disable-next-line
      .then((response: any) => {
        progress = 100;
        onProgress(file[0].file, progress);
        notify.success(ToastMessages.imageUploadSuccess);
        onUploadingImage(file[0].file, `${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN}/${response.data.location}`);
        clearInterval(slowProgressInterval);
        const gridApi = tableRef.current.getApi();
        const rowDataToUpdate = gridApi.getDisplayedRowAtIndex(rowIndex).data;
        setProductionUploadMap((prev) => ({ ...prev, [currentProduction.Id]: response.data }));
        const transaction = {
          update: [
            {
              ...rowDataToUpdate,
              ImageUrl: `${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN}/${response.data.location}`,
              Image: response,
            },
          ],
        };
        applyTransactionToGrid(tableRef, transaction);
      }) // eslint-disable-next-line
      .catch((error) => {
        notify.error(ToastMessages.imageUploadFailure);
        onError(file[0].file, 'Error uploading file. Please try again.');
        clearInterval(slowProgressInterval);
      });
  };

  const updateCurrentProduction = useCallback(
    async (e) => {
      setIsLoading(true);
      try {
        const payloadData = getProductionsConvertedPayload(
          { ...e.data, Id: currentProduction?.Id, Image: productionUploadMap[e.data.Id] },
          true,
        );
        await axios.put(`/api/productions/update/${currentProduction?.Id}`, payloadData);
        notify.success(ToastMessages.updateProductionSuccess);
        if (payloadData.isArchived && !isArchived) {
          const gridApi = tableRef.current.getApi();
          const rowDataToRemove = gridApi.getDisplayedRowAtIndex(e.rowIndex).data;
          const transaction = {
            remove: [rowDataToRemove],
          };
          applyTransactionToGrid(tableRef, transaction);
        }
        const excludeUpdatedRecords = editedOrAddedRecords?.filter((row) => row.showId !== e.data.ShowId);
        setEditedOrAddedRecords(excludeUpdatedRecords);
      } catch (error) {
        notify.error(ToastMessages.updateProductionFailure);
        console.log('Error updating production', error);
      } finally {
        setIsLoading(false);
        setIsEdited(false);
        setCurrentProduction(intProduction);
        router.replace(router.asPath);
      }
    },
    [currentProduction?.Id, isArchived, productionUploadMap, router],
  );

  const createNewProduction = useCallback(
    async (e) => {
      setIsLoading(true);
      try {
        const payloadData = getProductionsConvertedPayload(
          { ...e.data, Id: currentProduction?.Id, Image: productionUploadMap[e.data.Id] },
          false,
        );
        await axios.post(`/api/productions/create`, payloadData);
        notify.success(ToastMessages.createNewProductionSuccess);
        const excludeSavedRecords = editedOrAddedRecords?.filter((row) => row.showId !== e.data.ShowId);
        setEditedOrAddedRecords(excludeSavedRecords);
      } catch (error) {
        notify.error(ToastMessages.createNewProductionFailure);
        console.log('Error updating production', error);
      } finally {
        setIsEdited(false);
        setCurrentProduction(intProduction);
        addNewRow();
        router.replace(router.asPath);
        setIsLoading(false);
      }
    },
    [addNewRow, currentProduction?.Id, productionUploadMap, router],
  );

  const handleCellClick = async (e) => {
    setProductionId(e.data.Id);
    setCurrentProduction(e.data);
    setRowIndex(e.rowIndex);
    if (e.column.colId === 'deleteId') {
      setConfirm(true);
    } else if (e.column.colId === 'editId' && isEdited && !isAddRow) {
      await updateCurrentProduction(e);
    } else if (
      isAddRow &&
      e.column.colId === 'editId' &&
      e.data.Code &&
      'DateBlock[0].StartDate' in e.data &&
      'DateBlock[0].EndDate' in e.data
    ) {
      // handleSave(e.data);
      await createNewProduction(e);
    } else if (e.column.colId === 'ImageUrl') {
      console.log(e.data);
      const { imageUrl, originalFilename: name, id } = e.data.Image || {};
      setIsUploadModalOpen({
        imageUrl,
        name,
        id,
      });
      setCurrentProduction(e.data);
    }
  };

  const handleSaveAndClose = () => {
    // handleSave(currentProduction);
    onClose();
  };

  const handleCellChanges = (e) => {
    const excludeEditedRow = editedOrAddedRecords?.filter((row) => row.showId !== e.data.ShowId);
    setEditedOrAddedRecords([...excludeEditedRow, getProductionsConvertedPayload(e.data)]);
    setCurrentProduction(e.data);
    setIsEdited(true);
  };

  const handleDelete = async () => {
    setConfirm(false);
    setIsLoading(true);
    try {
      await axios.delete(`/api/productions/delete/${productionId}`);
      notify.success(ToastMessages.deleteProductionSuccess);
      const gridApi = tableRef.current.getApi();
      const rowDataToRemove = gridApi.getDisplayedRowAtIndex(rowIndex).data;
      const transaction = {
        remove: [rowDataToRemove],
      };
      applyTransactionToGrid(tableRef, transaction);
    } catch (error) {
      notify.error(ToastMessages.deleteProductionFailure);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="text-primary-navy text-xl relative bottom-2 font-bold">{showName}</div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <Checkbox
              className="flex flex-row-reverse mr-2"
              checked={isArchived}
              label="Include archived"
              id=""
              onChange={handleArchive}
            />
            <Button disabled={isAddRow} onClick={addNewRow} text="Add New Production" />
          </div>
        </div>
      </div>
      <div className=" w-[750px] lg:w-[1568px] h-full flex flex-col ">
        <Table
          ref={tableRef}
          columnDefs={productionColumDefs}
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
      <div className="pt-4 w-full grid grid-cols-2 items-center  justify-end  justify-items-end gap-3">
        <div />
        <div className="flex gap-3">
          <Button className="w-33 " variant="secondary" onClick={onClose} text="Cancel" />
          <Button className=" w-33" text="Save and Close" onClick={handleSaveAndClose} />
        </div>
      </div>
      <ConfirmationDialog
        variant="delete"
        show={confirm}
        onYesClick={handleDelete}
        onNoClick={() => setConfirm(false)}
        hasOverlay={false}
      />
      {!!isUploadModalOpen && (
        <UploadModal
          visible={!!isUploadModalOpen}
          title="Production Image"
          info="Please upload your production image here. Image should be no larger than 300px wide x 200px high (Max 500kb). Images in a square or portrait format will be proportionally scaled to fit with the rectangular boundary box. Suitable image formats are jpg, tiff, svg, and png."
          allowedFormats={['image/png', 'image/jpg', 'image/jpeg']}
          onClose={() => setIsUploadModalOpen(false)}
          maxFileSize={500 * 1024} // 500kb
          onSave={onSave}
          value={isUploadModalOpen}
        />
      )}
    </>
  );
};

export default ProductionsView;
