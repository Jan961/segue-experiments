import axios from 'axios';
import { styleProps } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import Checkbox from 'components/core-ui-lib/Checkbox';
import Table from 'components/core-ui-lib/Table';
import { getProductionsConvertedPayload } from 'components/shows/constants';
import { productionsTableConfig } from 'components/shows/table/tableConfig';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useRef, useState } from 'react';
import useComponentMountStatus from 'hooks/useComponentMountStatus';
import { sortByProductionStartDate } from './util';
import { notify } from 'components/core-ui-lib/Notifications';
import { ToastMessages } from 'config/shows';
import { debug } from 'utils/logging';
import ProductionDetailsForm, { ProductionFormData, defaultProductionFormData } from './ProductionDetailsForm';
import LoadingOverlay from 'components/shows/LoadingOverlay';
import CurrencyConversionModal from './CurrencyConversionModal';

interface ProductionsViewProps {
  showData: any;
  showName: string;
  showCode: string;
  onClose: () => void;
}

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

const ProductionsView = ({ showData, showName = '', showCode = '', onClose }: ProductionsViewProps) => {
  const tableRef = useRef(null);
  const router = useRouter();
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openCurrencyConversionModal, setOpenCurrencyConversionModal] = useState<boolean>(false);
  const [currentProduction, setCurrentProduction] = useState<ProductionFormData>(defaultProductionFormData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isArchived, setIsArchived] = useState<boolean>(true);
  const isMounted = useComponentMountStatus();
  const productionColumDefs = useMemo(() => (isMounted ? productionsTableConfig : []), [isMounted]);
  const title = useMemo(
    () => `${showName || ''} ${showCode || ''}${currentProduction?.prodCode || ''}`,
    [showName, showCode, currentProduction],
  );

  const gridOptions = {
    getRowId: (params) => {
      return params.data.Id;
    },
  };

  const addNewRow = () => {
    setOpenEditModal(true);
    setCurrentProduction(defaultProductionFormData);
  };

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

  const updateCurrentProduction = useCallback(
    async (data: ProductionFormData, cb?: () => void) => {
      setIsLoading(true);
      try {
        const payloadData = getProductionsConvertedPayload(data);
        await axios.put(`/api/productions/update/${currentProduction?.id}`, payloadData);
        cb?.();
        notify.success(ToastMessages.updateProductionSuccess);
      } catch (error) {
        notify.error(ToastMessages.updateProductionFailure);
        debug('Error updating production', error, data);
      } finally {
        setIsLoading(false);
        setCurrentProduction(defaultProductionFormData);
        router.replace(router.asPath);
      }
    },
    [router, currentProduction],
  );

  const createNewProduction = useCallback(
    async (data: ProductionFormData, cb?: () => void) => {
      setIsLoading(true);
      try {
        const payloadData = getProductionsConvertedPayload(data);
        await axios.post(`/api/productions/create`, { ...payloadData, showId: showData?.Id });
        cb?.();
        router.replace(router.asPath);
      } catch (error) {
        let errorMessage = ToastMessages.createNewProductionFailure;
        if (error?.response?.status === 409) {
          errorMessage = `ProdCode: ${data.prodCode} already exists. Please try with different ProdCode`;
        }
        notify.error(errorMessage);
        debug('Error creating production', error, data);
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  const onSaveProduction = (production: ProductionFormData, cb?: () => void) => {
    if (production?.id) {
      updateCurrentProduction(production, cb);
    } else {
      createNewProduction(production, cb);
    }
  };

  const updateCurrentProductionState = (data) => {
    const {
      DateBlock = [],
      Code,
      Id,
      RegionList,
      SalesFrequency,
      SalesEmail,
      IsArchived,
      ImageUrl,
      Image,
      ShowId,
      ReportCurrencyCode,
      RunningTime,
      RunningTimeNote,
      ProdCoId,
      ConversionRateList,
    } = data;
    const productionDateBlock = DateBlock.find((d) => d.Name === 'Production');
    const rehearsalDateBlock = DateBlock.find((d) => d.Name === 'Rehearsal');
    setCurrentProduction({
      id: Id,
      showId: ShowId,
      prodCode: Code,
      productionDateBlock,
      rehearsalDateBlock,
      region: RegionList,
      email: SalesEmail,
      frequency: SalesFrequency,
      isArchived: IsArchived,
      imageUrl: ImageUrl,
      currency: ReportCurrencyCode,
      company: ProdCoId,
      runningTime: RunningTime,
      runningTimeNote: RunningTimeNote,
      conversionRateList: ConversionRateList,
      ...(ImageUrl && {
        image: {
          id: Image.id,
          imageUrl: ImageUrl,
          name: Image.originalFilename,
        },
      }),
    });
  };

  const handleCellClick = async (e) => {
    updateCurrentProductionState(e.data);
    if (e.column.colId === 'editId') {
      setOpenEditModal(true);
    }
    if (e.column.colId === 'updateCurrencyConversion') {
      setOpenCurrencyConversionModal(true);
    }
  };

  const handleCellChanges = (e) => {
    if (e.oldValue === e.newValue) return;
    debug('handleCellChanges', e);
    updateCurrentProductionState(e.data);
  };

  const handleDelete = async (productionId: number, callback?: () => void) => {
    callback?.();
    setIsLoading(true);
    try {
      if (productionId) {
        await axios.delete(`/api/productions/delete/${productionId}`);
        router.replace(router.asPath);
      }
      notify.success(ToastMessages.deleteProductionSuccess);
    } catch (error) {
      notify.error(ToastMessages.deleteProductionFailure);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between mb-2">
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
            <Button onClick={addNewRow} text="Add New Production" />
          </div>
        </div>
      </div>
      <div className=" w-[750px] lg:w-[870px] h-full flex flex-col ">
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
          {/* <Button className="w-33 " variant="secondary" onClick={onClose} text="Cancel" /> */}
          <Button className=" w-33" text="Close" onClick={onClose} />
        </div>
      </div>
      {openEditModal && (
        <ProductionDetailsForm
          production={currentProduction}
          title={title || ''}
          onDelete={handleDelete}
          visible={openEditModal}
          onSave={onSaveProduction}
          onClose={() => setOpenEditModal(false)}
        />
      )}
      {openCurrencyConversionModal && (
        <CurrencyConversionModal
          conversionRates={currentProduction?.conversionRateList}
          title={title || ''}
          visible={openCurrencyConversionModal}
          onClose={() => setOpenCurrencyConversionModal(false)}
        />
      )}
    </>
  );
};

export default ProductionsView;
