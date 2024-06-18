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
import { debug } from 'utils/logging';
import { all, isArray } from 'radash';
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
  SalesFrequency: 'W',
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
  const [uploadModalContext, setUploadModalContext] = useState<any>(false);
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

  function validateShowData(showData) {
    for (const show of showData) {
      if (
        !show.DateBlock ||
        show.DateBlock.length === 0 ||
        !show.DateBlock[0].StartDate ||
        !show.DateBlock[0].EndDate ||
        !show.Code
      ) {
        return false;
      }
    }

    return true;
  }

  const handleSaveAndClose = async () => {
    try {
      const gridApi = tableRef.current.getApi();
      const editedRecords = [];
      const newRecords = [];
      gridApi.forEachNode((rowNode) => {
        if (!rowNode.data.Id) {
          newRecords.push(rowNode.data);
        } else if (editedOrAddedRecords.includes(rowNode.data.Id)) {
          editedRecords.push(rowNode.data);
        }
      });
      const showData = [...newRecords, ...editedRecords];
      const mandatoryFieldsValidation: boolean = validateShowData(showData);
      if (!mandatoryFieldsValidation) {
        notify.warning(ToastMessages.requiredFieldsWarning);
        return;
      }
      await all([
        ...newRecords.map((record) => createNewProduction(record)),
        ...editedRecords.map((record) => updateCurrentProduction(record)),
      ]);
      onClose();
    } catch (error) {
      console.log('Error Saving Records');
    }
  };

  const onSave = (file, onProgress, onError, onUploadingImage) => {
    console.log('==onSave==', file);
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
        setEditedOrAddedRecords((prev) => [...prev, rowDataToUpdate.Id]);
        const transaction = {
          update: [
            {
              ...rowDataToUpdate,
              ImageUrl: `${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN}/${response.data.location}`,
              Image: response.data,
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
    async (data) => {
      setIsLoading(true);
      try {
        const payloadData = getProductionsConvertedPayload(
          { ...data, Id: currentProduction?.Id, Image: productionUploadMap[data.Id] },
          true,
        );
        await axios.put(`/api/productions/update/${currentProduction?.Id}`, payloadData);
        notify.success(ToastMessages.updateProductionSuccess);
        // if (payloadData.isArchived && !isArchived) {
        //   const gridApi = tableRef.current.getApi();
        //   const rowDataToRemove = gridApi.getDisplayedRowAtIndex(e.rowIndex).data;
        //   const transaction = {
        //     remove: [rowDataToRemove],
        //   };
        //   applyTransactionToGrid(tableRef, transaction);
        // }
        setEditedOrAddedRecords((prev) => prev.filter((id) => id !== data.Id));
        const excludeUpdatedRecords = editedOrAddedRecords?.filter((id) => id !== data.Id);
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
    async (data) => {
      setIsLoading(true);
      try {
        const payloadData = getProductionsConvertedPayload(
          { ...data, Id: currentProduction?.Id, Image: productionUploadMap[data.Id] },
          false,
        );
        await axios.post(`/api/productions/create`, payloadData);
        const transaction = {
          update: [
            {
              ...data,
              highlightRow: false,
            },
          ],
        };
        applyTransactionToGrid(tableRef, transaction);
        notify.success(ToastMessages.createNewProductionSuccess);
      } catch (error) {
        notify.error(ToastMessages.createNewProductionFailure);
        console.log('Error creating production', error);
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

  // const findFirstEmptyField = (data) => {
  //   const requiredFields = ['Code', 'DateBlock[0].StartDate', 'DateBlock[0].EndDate'];
  //   return requiredFields.find((field) => !data[field]);
  // };

  const handleCellClick = async (e) => {
    setProductionId(e.data.Id);
    setCurrentProduction(e.data);
    setRowIndex(e.rowIndex);

    if (e.column.colId === 'deleteId') {
      setConfirm(true);
    } else if (e.column.colId === 'editId' && isEdited && !isAddRow) {
      await updateCurrentProduction(e.data);
    } else if (isAddRow && e.column.colId === 'editId') {
      if (e.data.Code && 'DateBlock[0].StartDate' in e.data && 'DateBlock[0].EndDate' in e.data) {
        await createNewProduction(e.data);
      } else {
        notify.warning('Please fill in all the required fields before saving.');
      }
    } else if (e.column.colId === 'ImageUrl') {
      const { originalFilename: name, id } = e.data.Image || {};
      setUploadModalContext({
        value: e.data.Image
          ? {
              imageUrl: e.data.ImageUrl,
              name,
              id,
            }
          : null,
        visibility: true,
      });
      setCurrentProduction(e.data);
    }
  };

  const handleCellChanges = (e) => {
    if (e.oldValue === e.newValue) return;
    debug('handleCellChanges', e);
    setEditedOrAddedRecords((prev) => [...prev, e.data.Id]);
    setCurrentProduction(e.data);
    setIsEdited(true);
  };

  const handleDelete = async () => {
    setConfirm(false);
    setIsLoading(true);
    try {
      if (productionId) {
        await axios.delete(`/api/productions/delete/${productionId}`);
        router.replace(router.asPath);
      }
      notify.success(ToastMessages.deleteProductionSuccess);
      const gridApi = tableRef.current.getApi();
      const rowDataToRemove = gridApi.getDisplayedRowAtIndex(rowIndex).data;
      const transaction = {
        remove: [rowDataToRemove],
      };
      setEditedOrAddedRecords((prev) => prev.filter((id) => id !== rowDataToRemove.Id));
      applyTransactionToGrid(tableRef, transaction);
    } catch (error) {
      notify.error(ToastMessages.deleteProductionFailure);
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (selectedFiles) => {
    if (isArray(selectedFiles) && selectedFiles.length === 0) {
      const gridApi = tableRef.current.getApi();
      const rowDataToUpdate = gridApi.getDisplayedRowAtIndex(rowIndex).data;
      const transaction = {
        update: [
          {
            ...rowDataToUpdate,
            ImageUrl: '',
            Image: null,
          },
        ],
      };
      applyTransactionToGrid(tableRef, transaction);
      setProductionUploadMap((prev) => {
        const newMap = { ...prev };
        newMap[currentProduction.Id] = null;
        return newMap;
      });
      setEditedOrAddedRecords((prev) => [...prev, rowDataToUpdate.Id]);
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
      {uploadModalContext?.visibility && (
        <UploadModal
          visible={uploadModalContext?.visibility}
          title="Production Image"
          info="Please upload your production image here. Image should be no larger than 300px wide x 200px high (Max 500kb). Images in a square or portrait format will be proportionally scaled to fit with the rectangular boundary box. Suitable image formats are jpg, tiff, svg, and png."
          allowedFormats={['image/png', 'image/jpg', 'image/jpeg']}
          onClose={() => setUploadModalContext(null)}
          maxFileSize={500 * 1024} // 500kb
          onSave={onSave}
          value={uploadModalContext?.value}
          onChange={onChange}
        />
      )}
    </>
  );
};

export default ProductionsView;
