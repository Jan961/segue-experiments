import PopupModal from 'components/core-ui-lib/PopupModal';
import Select from 'components/core-ui-lib/Select';
import { useCallback, useMemo, useState } from 'react';
import Button from 'components/core-ui-lib/Button';
import Label from 'components/core-ui-lib/Label';
import Checkbox from 'components/core-ui-lib/Checkbox';
import DateRange from 'components/core-ui-lib/DateRange';
import { Icon, TextInput, TimeInput, Tooltip, UploadModal, notify } from 'components/core-ui-lib';
import { REGIONS_LIST, SALES_FIG_OPTIONS, ToastMessages } from 'config/shows';
import { uploadFile } from 'requests/upload';
import { UploadedFile } from 'components/core-ui-lib/UploadModal/interface';
import { CustomOption } from 'components/core-ui-lib/Table/renderers/SelectCellRenderer';
import { useRecoilValue } from 'recoil';
import { currencyListState } from 'state/productions/currencyState';
import { transformToOptions } from 'utils';
import { productionCompanyState } from 'state/productions/productionCompanyState';
import { ConversionRateDTO, DateBlockDTO } from 'interfaces';
import { productionFormSchema } from './schema';
import { debug } from 'utils/logging';
import { uploadStrings } from 'config/upload';
import axios from 'axios';

export interface ProductionFormData {
  id?: number;
  currency: string;
  region: number[];
  productionDateBlock: DateBlockDTO;
  rehearsalDateBlock: DateBlockDTO;
  company: number;
  email?: string;
  frequency?: string;
  isArchived?: boolean;
  prodCode: string;
  imageUrl?: string;
  image?: Partial<UploadedFile>;
  runningTime?: string;
  runningTimeNote?: string;
  showId?: number;
  conversionRateList?: ConversionRateDTO[];
}
interface ProductionsViewModalProps {
  visible: boolean;
  title: string;
  production: any;
  onClose: () => void;
  onSave?: (formData: ProductionFormData, callback?: () => void) => void;
}

export const defaultProductionFormData: ProductionFormData = {
  id: null,
  currency: null,
  region: [],
  productionDateBlock: null,
  rehearsalDateBlock: null,
  company: null,
  email: null,
  frequency: 'W',
  isArchived: null,
  prodCode: null,
  imageUrl: '',
  image: null,
  runningTime: '',
  runningTimeNote: '',
};
const ProductionDetailsForm = ({ visible, onClose, title, onSave, production }: ProductionsViewModalProps) => {
  const currencyList = useRecoilValue(currencyListState);
  const productionCompanyList = useRecoilValue(productionCompanyState);
  const [formData, setFormData] = useState(production || defaultProductionFormData);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const currencyListOptions = useMemo(() => transformToOptions(currencyList, 'code', 'code'), [currencyList]);
  const productionCompanyOptions = useMemo(
    () => transformToOptions(productionCompanyList, 'name', 'id'),
    [productionCompanyList],
  );
  const {
    id,
    currency,
    region,
    productionDateBlock,
    rehearsalDateBlock,
    company,
    email,
    frequency,
    isArchived,
    prodCode,
    imageUrl,
    image,
    runningTime,
    runningTimeNote,
  } = formData;

  const onChange = useCallback((key: string, value: string | number | DateBlockDTO) => {
    setFormData((data) => ({ ...data, [key]: value }));
    setValidationErrors((prev) => ({ ...prev, [key]: null }));
  }, []);

  const onSaveUpload = async (file, onProgress, onError, onUploadingImage) => {
    const formData = new FormData();
    formData.append('file', file[0].file);
    formData.append('path', `images/production${id ? '/' + id : ''}`);
    try {
      const response = await uploadFile(formData, onProgress, onError, onUploadingImage);
      const { id, originalFilename, location } = response || {};
      const imageUrl = `${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN}/${location}`;
      setFormData((prev) => ({
        ...prev,
        imageUrl,
        image: { id, imageUrl, name: originalFilename, size: null } as UploadedFile,
      }));
    } catch (error) {
      onError(file[0].file, error.message);
    }
  };

  const onFileUploadChange = (selectedFiles) => {
    if (Array.isArray(selectedFiles) && selectedFiles.length === 0 && image?.location) {
      notify.promise(
        axios
          .delete(`/api/file/delete?location=${image?.location}`)
          .then(() => setFormData((prev) => ({ ...prev, imageUrl: '', image: null }))),
        {
          success: 'Image deleted successfully',
          loading: 'Deleting Image',
          error: 'Deleting Image failed. Please try again later',
        },
      );
    }
  };

  async function validateProduction(data: ProductionFormData) {
    try {
      await productionFormSchema.validate({ ...data }, { abortEarly: false });
      return true;
    } catch (validationErrors) {
      const errors = {};
      validationErrors.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
      setValidationErrors(errors);
      debug('validation Errors', errors);
      return false;
    }
  }

  const onSubmit = useCallback(async () => {
    const isValid = await validateProduction(formData);
    if (isValid) {
      return onSave(formData, onClose);
    }
    notify.warning(ToastMessages.requiredFieldsWarning);
  }, [formData, onClose, validateProduction]);

  return (
    <PopupModal
      hasOverlay={isUploadOpen}
      titleClass="text-xl text-primary-navy text-bold"
      title={title}
      show={visible}
      onClose={onClose}
    >
      <form className="flex flex-col gap-4 w-[520px] mt-4">
        <div className="flex items-end gap-6 col-span-3 row-start-3">
          <div className="flex items-center gap-4 col-span-5">
            <div
              className="bg-gray-300 w-44 h-32 flex items-center justify-center cursor-pointer"
              onClick={() => setIsUploadOpen(true)}
            >
              {imageUrl ? (
                <img className="h-full w-full pb-2" src={imageUrl} />
              ) : (
                <Icon iconName="camera-solid" variant="2xl" />
              )}
            </div>
          </div>
          <div className="flex-col">
            <div className="flex items-center gap-2">
              <Label required text="Prod Code" />
              <TextInput
                id="prodcode"
                className="w-[60px] placeholder-primary"
                type="string"
                onChange={(e) => onChange('prodCode', e.target.value)}
                value={prodCode}
                error={validationErrors?.prodCode}
                maxlength={10}
                required
              />
              <Tooltip>
                <Icon iconName="info-circle-solid" variant="2xl" />
              </Tooltip>
            </div>
            {validationErrors.prodCode && <small className="text-red-400">{validationErrors.prodCode}</small>}
          </div>
        </div>
        {isUploadOpen && (
          <UploadModal
            visible={isUploadOpen}
            title="Production Image"
            info={uploadStrings.info}
            allowedFormats={['image/png', 'image/jpg', 'image/jpeg']}
            onClose={() => setIsUploadOpen(false)}
            onSave={onSaveUpload}
            maxFileSize={500 * 1024} // 500kb
            onChange={onFileUploadChange}
            value={image}
          />
        )}

        <div className="flex items-center gap-[93px] col-span-3 row-start-3">
          <Label text="Rehearsals" />
          <DateRange
            className="w-fit"
            label="Date"
            onChange={({ from, to }) => {
              const StartDate = from?.toISOString() || '';
              const EndDate = !rehearsalDateBlock?.EndDate && !to ? from?.toISOString() : to?.toISOString() || '';
              onChange('rehearsalDateBlock', { ...rehearsalDateBlock, StartDate, EndDate });
            }}
            value={{
              from: rehearsalDateBlock?.StartDate ? new Date(rehearsalDateBlock?.StartDate) : null,
              to: rehearsalDateBlock?.EndDate ? new Date(rehearsalDateBlock?.EndDate) : null,
            }}
          />
        </div>
        <div className="flex-col">
          <div className="flex items-center gap-12 col-span-3 row-start-3">
            <Label required text="Production Dates" />
            <DateRange
              className="w-fit"
              label="Date"
              onChange={({ from, to }) => {
                const StartDate = from?.toISOString() || '';
                const EndDate = !productionDateBlock?.EndDate && !to ? from?.toISOString() : to?.toISOString() || '';
                onChange('productionDateBlock', { ...productionDateBlock, StartDate, EndDate });
              }}
              value={{
                from: productionDateBlock?.StartDate ? new Date(productionDateBlock?.StartDate) : null,
                to: productionDateBlock?.EndDate ? new Date(productionDateBlock?.EndDate) : null,
              }}
            />
          </div>
          {validationErrors.productionDateBlock && (
            <small className="text-red-400">{validationErrors.productionDateBlock}</small>
          )}
        </div>
        <div className="flex-col">
          <div className="flex items-center gap-[107px]">
            <Label required text="Region" />
            <Select
              className="flex-1"
              placeholder="Select Region(s)"
              onChange={(value) => onChange('region', value as string)}
              options={REGIONS_LIST}
              value={region}
              isMulti={true}
              renderOption={(option) => <CustomOption option={option} isMulti={true} />}
            />
          </div>
          {validationErrors.region && <small className="text-red-400">{validationErrors.region}</small>}
        </div>
        <div className="flex-col">
          <div className="flex items-center gap-7">
            <Label required text="Currency for Reports" />
            <Select
              className="w-64"
              onChange={(value) => onChange('currency', value as string)}
              options={currencyListOptions}
              value={currency}
              isSearchable
            />
          </div>
          {validationErrors.currency && <small className="text-red-400">{validationErrors.currency}</small>}
        </div>
        <div className="flex-col">
          <div className="flex items-center gap-[92px]">
            <Label required text="Company" />
            <Select
              className="flex-1"
              placeholder="Select Production Company"
              onChange={(value) => onChange('company', value as string)}
              options={productionCompanyOptions}
              value={company}
            />
          </div>
          {validationErrors.company && <small className="text-red-400">{validationErrors.company}</small>}
        </div>
        <div className="flex items-center gap-6">
          <Label text="Email Address for Sales Figures" />
          <TextInput
            id="email"
            className="w-[320px] placeholder-primary"
            placeholder="Email address..."
            type="string"
            onChange={(e) => onChange('email', e.target.value)}
            value={email}
          />
        </div>
        <div className="flex items-center gap-4">
          <Label text="Input Frequency of Sales Figures" />
          <Select
            className="w-[150px]"
            onChange={(value) => onChange('frequency', value as string)}
            options={SALES_FIG_OPTIONS}
            value={frequency}
          />
        </div>
        <div className="flex items-center gap-[45px]">
          <Label text="Running Time (inc Intervals)" />
          <TimeInput
            className="w-28 placeholder-primary"
            onChange={({ hrs, min }) => onChange('runningTime', `${hrs || 0}:${min || 0}`)}
            value={runningTime}
          />
        </div>
        <div className="flex items-center gap-[85px]">
          <Label text="Running Time Notes" />
          <TextInput
            id="runningTimeNote"
            className="w-[320px] placeholder-primary"
            placeholder="Running Time Notes..."
            type="string"
            onChange={(e) => onChange('runningTimeNote', e.target.value)}
            value={runningTimeNote}
          />
        </div>
        <div className="flex items-center ml-1 float-end justify-end">
          <Checkbox
            id="isArchived"
            label="Archived"
            checked={isArchived}
            onChange={(e) => onChange('isArchived', e.target.checked)}
          />
        </div>

        <div className="pt-3 w-full flex items-center justify-end gap-2">
          <Button onClick={onClose} className="float-right px-4 w-33 font-normal" variant="secondary" text="Cancel" />
          <Button
            className="float-right px-4 font-normal w-33 text-center"
            variant="primary"
            iconProps={{ className: 'h-4 w-3' }}
            text="Save and Close"
            onClick={onSubmit}
          />
        </div>
      </form>
    </PopupModal>
  );
};

export default ProductionDetailsForm;
