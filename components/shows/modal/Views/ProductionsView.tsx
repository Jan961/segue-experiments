import axios from 'axios';
import { styleProps } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import Checkbox from 'components/core-ui-lib/Checkbox';
import Table from 'components/core-ui-lib/Table';
import { getProductionsConvertedPayload } from 'components/shows/constants';
import { productionsTableConfig } from 'components/shows/table/tableConfig';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useComponentMountStatus from 'hooks/useComponentMountStatus';
import { sortByProductionStartDate } from './util';
import { notify } from 'components/core-ui-lib/Notifications';
import { ToastMessages } from 'config/shows';
import { debug } from 'utils/logging';
import ProductionDetailsForm, { ProductionFormData, defaultProductionFormData } from './ProductionDetailsForm';
import LoadingOverlay from 'components/core-ui-lib/LoadingOverlay';
import CurrencyConversionModal from './CurrencyConversionModal';
import { ConfirmationDialog, PopupModal } from 'components/core-ui-lib';
import { all, group, objectify } from 'radash';
import { ICurrency, ICurrencyCountry } from 'interfaces';
import { isNullOrEmpty } from 'utils';
import { useRecoilValue } from 'recoil';
import { accessShows } from 'state/account/selectors/permissionSelector';

interface ProductionsViewProps {
  showData: any;
  onClose: (showData: any) => void;
  visible: boolean;
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

const ProductionsView = ({ showData, visible, onClose }: ProductionsViewProps) => {
  const permissions = useRecoilValue(accessShows);
  const tableRef = useRef(null);
  const router = useRouter();
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<boolean>(false);
  const [openCurrencyConversionModal, setOpenCurrencyConversionModal] = useState<boolean>(false);
  const [currencyLookup, setCurrencyLookup] = useState<Record<string, ICurrency>>({});
  const [currencyCountryLookup, setCurrencyCountryLookup] = useState<Record<string, ICurrencyCountry[]>>({});
  const [currentProduction, setCurrentProduction] = useState<ProductionFormData>(defaultProductionFormData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isArchived, setIsArchived] = useState<boolean>(true);
  const isMounted = useComponentMountStatus();
  const [dataReady, setDataReady] = useState<boolean>(false);
  const productionColumDefs = useMemo(
    () => (isMounted ? productionsTableConfig(permissions, dataReady) : []),
    [isMounted, permissions, dataReady],
  );
  const [showParentLoading, setParentLoadingOverlay] = useState<boolean>(false);
  const showName = useMemo(() => showData.Name, [showData]);
  const showCode = useMemo(() => showData.Code, [showData]);
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

  const currencyCodeList = useMemo(
    () =>
      showData.productions?.flatMap?.(
        (production) =>
          production.ConversionRateList?.flatMap?.(({ ToCurrencyCode, FromCurrencyCode }) => [
            ToCurrencyCode,
            FromCurrencyCode,
          ]),
      ),
    [showData.productions],
  );

  useEffect(() => {
    updateCurrencyDetails(currencyCodeList);
  }, [currencyCodeList]);

  const updateCurrencyDetails = async (currencyCodeList) => {
    try {
      setDataReady(false);
      if (!isNullOrEmpty(currencyCodeList)) {
        const filteredCodeList = currencyCodeList.filter((code) => code !== undefined);
        await all([
          axios.post(`/api/currency/read/list`, { currencyCodeList: filteredCodeList }),
          axios.post(`/api/currency/read/country-list`, { currencyCodeList: filteredCodeList }),
        ]).then((e) => {
          setCurrencyLookup(
            objectify(
              e[0].data,
              (c: ICurrency) => c.code,
              (c) => c,
            ),
          );
          setCurrencyCountryLookup(group(e[1].data, (c: ICurrencyCountry) => c.currencyCode));
          setDataReady(true);
        });
        // setCurrencyLookup(
        //   objectify(
        //     currencyList.data,
        //     (c: ICurrency) => c.code,
        //     (c) => c,
        //   ),
        // );
        // setCurrencyCountryLookup(group(countryList.data, (c: ICurrencyCountry) => c.currencyCode));
      }
    } catch (e) {
      console.log(e);
    }
  };

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
    setParentLoadingOverlay(true);
    setOpenEditModal(false);
    if (production?.id) {
      updateCurrentProduction(production, cb);
    } else {
      createNewProduction(production, cb);
    }
    showData.productions = showData.productions.map((prod) => {
      if (prod.Id === production?.id) {
        const prodId = production.id;

        delete production.id;

        return { ...production, Id: prodId };
      }

      return prod;
    });
    setParentLoadingOverlay(false);
  };

  const updateCurrentProductionState = (data) => {
    const productionRecord = showData.productions.find((production) => production.Id === data.Id);
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
    } = productionRecord;
    const productionDateBlock = DateBlock.find((d) => d.Name === 'Production') || {};
    const rehearsalDateBlock = DateBlock.find((d) => d.Name === 'Rehearsal') || {};
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
          location: Image.location,
        },
      }),
    });
  };

  const handleCellClick = async (e) => {
    updateCurrentProductionState(e.data);
    if (e.column.colId === 'editId' && permissions.includes('ACCESS_EDIT_PRODUCTION DETAILS')) {
      setOpenEditModal(true);
    }
    if (e.column.colId === 'updateCurrencyConversion' && permissions.includes('ACCESS_CURRENCY_CONVERSION')) {
      setOpenCurrencyConversionModal(true);
    }
    if (e.column.colId === 'delete' && permissions.includes('DELETE_PRODUCTION') && e.data?.IsArchived) {
      setConfirm(true);
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

  const onConfirmDelete = useCallback(() => {
    handleDelete(currentProduction?.id, () => setConfirm(false));
  }, [handleDelete, setConfirm, currentProduction]);

  return (
    <div>
      {showParentLoading && <LoadingOverlay />}
      <PopupModal
        show={visible}
        onClose={() => onClose(showData)}
        titleClass="text-xl text-primary-navy text-bold"
        title="Productions"
        panelClass="relative"
        hasOverlay={openEditModal || openCurrencyConversionModal || confirm}
      >
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
              <Button
                onClick={addNewRow}
                text="Add New Production"
                disabled={!permissions.includes('ADD_NEW_PRODUCTION')}
              />
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
            key={`${unArchivedList.length}:${archivedList.length}`}
          />

          {isLoading && <LoadingOverlay />}
        </div>
        <div className="pt-4 w-full grid grid-cols-2 items-center  justify-end  justify-items-end gap-3">
          <div />
          <div className="flex gap-3">
            {/* <Button className="w-33 " variant="secondary" onClick={onClose} text="Cancel" /> */}
            <Button className=" w-33" text="Close" onClick={() => onClose(showData)} />
          </div>
        </div>
        <ConfirmationDialog
          variant="delete"
          show={confirm}
          onYesClick={onConfirmDelete}
          onNoClick={() => setConfirm(false)}
          hasOverlay={false}
        />
        {openEditModal && (
          <ProductionDetailsForm
            production={currentProduction}
            title={title || ''}
            visible={openEditModal}
            onSave={onSaveProduction}
            onClose={() => setOpenEditModal(false)}
            disabled={!permissions.includes('EDIT_PRODUCTION_DETAILS')}
          />
        )}
        {openCurrencyConversionModal && (
          <CurrencyConversionModal
            conversionRates={currentProduction?.conversionRateList}
            currencyCountryLookup={currencyCountryLookup}
            currencyLookup={currencyLookup}
            title={title || ''}
            visible={openCurrencyConversionModal}
            onClose={() => setOpenCurrencyConversionModal(false)}
          />
        )}
      </PopupModal>
    </div>
  );
};

export default ProductionsView;
