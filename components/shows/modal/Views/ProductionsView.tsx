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
import { useEffect, useMemo, useRef, useState } from 'react';
import applyTransactionToGrid from 'utils/applyTransactionToGrid';
import UploadModal from 'components/core-ui-lib/UploadModal';
import { FileDTO } from 'interfaces';

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
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [productionUploadMap, setProductionUploadMap] = useState<Record<string, FileDTO>>(() => {
    return showData.productions.reduce((prodImageMap, production) => {
      prodImageMap[production.Id] = production.Image;
      return prodImageMap;
    }, {});
  });

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
    return showData.productions.filter((item) => !item.IsArchived && !item.IsDeleted);
  }, [showData, isArchived]);

  const archivedList = useMemo(() => {
    return showData.productions.filter((item) => item.IsArchived && !item.IsDeleted);
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

  const onSave = (file, onProgress, onError) => {
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
        clearInterval(slowProgressInterval);
        const gridApi = tableRef.current.getApi();
        const rowDataToUpdate = gridApi.getDisplayedRowAtIndex(rowIndex).data;
        setProductionUploadMap((prev) => ({ ...prev, [currentProduction.Id]: response.data }));
        const transaction = {
          update: [
            {
              ...rowDataToUpdate,
              ImageUrl: `${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN}/${response.data.Location}`,
              Image: response,
            },
          ],
        };
        applyTransactionToGrid(tableRef, transaction);
      }) // eslint-disable-next-line
      .catch((error) => {
        onError(file[0].file, 'Error uploading file. Please try again.');
        clearInterval(slowProgressInterval);
      });
  };

  const handleCellClick = async (e) => {
    setProductionId(e.data.Id);
    setCurrentProduction(e.data);
    setRowIndex(e.rowIndex);
    if (e.column.colId === 'deleteId') {
      setConfirm(true);
    } else if (e.column.colId === 'editId' && isEdited && !isAddRow) {
      setIsLoading(true);
      try {
        const payloadData = getProductionsConvertedPayload(
          { ...e.data, Id: currentProduction?.Id, Image: productionUploadMap[e.data.Id] },
          true,
        );
        await axios.put(`/api/productions/update/${currentProduction?.Id}`, payloadData);
        if (payloadData.isArchived && !isArchived) {
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
    } else if (
      isAddRow &&
      e.column.colId === 'editId' &&
      e.data.Code &&
      'DateBlock[0].StartDate' in e.data &&
      'DateBlock[0].EndDate' in e.data
    ) {
      handleSave(e.data);
      setIsLoading(true);
      try {
        const payloadData = getProductionsConvertedPayload(e.data, false);
        await axios.post(`/api/productions/create`, payloadData);
      } finally {
        setIsEdited(false);
        setCurrentProduction(intProduction);
        addNewRow();
        router.replace(router.asPath);
        setIsLoading(false);
      }
    } else if (e.column.colId === 'ImageUrl') {
      setIsUploadModalOpen(true);
      setCurrentProduction(e.data);
    }
  };

  const handleSaveAndClose = () => {
    handleSave(currentProduction);
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
        <div className="text-primary-navy text-xl mb-3 mt-1 font-bold">{showName}</div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <Checkbox
              className="flex flex-row-reverse mr-2"
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
        <div className="flex gap-3">
          <Button className="w-33 " variant="secondary" onClick={onClose} text="Cancel" />
          <Button className=" w-33" text="Save and Close" onClick={handleSaveAndClose} />
        </div>
      </div>
      <ConfirmationDialog
        variant={'delete'}
        show={confirm}
        onYesClick={handleDelete}
        onNoClick={() => setConfirm(false)}
        hasOverlay={false}
      />
      <UploadModal
        visible={isUploadModalOpen}
        title="Production Image"
        info="Please upload your production image here. Image should be no larger than 300px wide x 200px high (Max 500kb). Images in a square or portrait format will be proportionally scaled to fit with the rectangular boundary box. Suitable image formats are jpg, tiff, svg, and png."
        allowedFormats={['image/png', 'image/jpg', 'image/jpeg']}
        onClose={() => setIsUploadModalOpen(false)}
        maxFileSize={500 * 1024} // 500kb
        onSave={onSave}
      />
    </>
  );
};

export default ProductionsView;
