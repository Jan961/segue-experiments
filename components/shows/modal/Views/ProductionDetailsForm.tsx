import PopupModal from 'components/core-ui-lib/PopupModal';
import Select from 'components/core-ui-lib/Select';
import { useCallback, useState } from 'react';
import Button from 'components/core-ui-lib/Button';
import Label from 'components/core-ui-lib/Label';
import Checkbox from 'components/core-ui-lib/Checkbox';
import DateRange from 'components/core-ui-lib/DateRange';
import { ConfirmationDialog, Icon, TextInput, Tooltip, UploadModal } from 'components/core-ui-lib';
import { REGIONS_LIST, SALES_FIG_OPTIONS } from 'config/shows';
import axios from 'axios';

interface FormDataType {
  production: number | null;
  currency: string | null;
  region: string | null;
  rehearsalToDate: string | null;
  rehearsalFromDate: string | null;
  productionToDate: string | null;
  productionFromDate: string | null;
  company: string | null;
  email: string | null;
  frequency: string | null;
  isArchived: boolean | null;
  prodCode: string | null;
  imageUrl?: '';
}
interface ProductionsViewModalProps {
  visible: boolean;
  title: string;
  production: any;
  onClose: () => void;
  onSave?: (formData: FormDataType) => void;
  onDelete?: (productionId: number, callback?: () => void) => void;
}

const defaultFormData: FormDataType = {
  production: null,
  currency: null,
  region: null,
  rehearsalToDate: null,
  rehearsalFromDate: null,
  productionToDate: null,
  productionFromDate: null,
  company: null,
  email: null,
  frequency: null,
  isArchived: null,
  prodCode: null,
  imageUrl: '',
};
const ProductionsViewModal = ({ visible, onClose, title, onSave, onDelete }: ProductionsViewModalProps) => {
  const [confirm, setConfirm] = useState<boolean>(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const {
    production,
    currency,
    region,
    rehearsalToDate,
    rehearsalFromDate,
    productionToDate,
    productionFromDate,
    company,
    email,
    frequency,
    isArchived,
    prodCode,
    imageUrl,
  } = formData;

  const currencyOptions = [];
  const companyOptions = [];
  const onChange = useCallback((key: string, value: string | number) => {
    setFormData((data) => ({ ...data, [key]: value }));
  }, []);

  const onSaveUpload = (file, onProgress, onError, onUploadingImage) => {
    const formData = new FormData();
    formData.append('file', file[0].file);
    formData.append('path', `images/production${production ? '/' + production : ''}`);

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
        onUploadingImage(file[0].file, `${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN}/${response.data.location}`);
        clearInterval(slowProgressInterval);
      }) // eslint-disable-next-line
      .catch((error) => {
        onError(file[0].file, 'Error uploading file. Please try again.');
        clearInterval(slowProgressInterval);
      });
  };

  const onConfirmDelete = () => {
    onDelete(production, () => setConfirm(false));
  };

  return (
    <PopupModal
      hasOverlay={false}
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
                <img className="h-10 w-14 pb-2" src={imageUrl} />
              ) : (
                <Icon iconName="camera-solid" variant="2xl" />
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label text="Prod Code" />
            <TextInput
              id="prodcode"
              className="w-[60px] placeholder-primary"
              type="string"
              onChange={(e) => onChange('prodCode', e.target.value)}
              value={prodCode}
              required
            />
            <Tooltip>
              <Icon iconName="info-circle-solid" variant="2xl" />
            </Tooltip>
          </div>
        </div>
        {isUploadOpen && (
          <UploadModal
            visible={isUploadOpen}
            title="Production Image"
            info="Please upload your production image here. Image should be no larger than 300px wide x 200px high (Max 500kb). Images in a square or portrait format will be proportionally scaled to fit with the rectangular boundary box. Suitable image formats are jpg, tiff, svg, and png."
            allowedFormats={['image/png', 'image/jpg', 'image/jpeg']}
            onClose={() => {
              setIsUploadOpen(false);
            }}
            onSave={onSaveUpload}
            maxFileSize={500 * 1024} // 500kb
          />
        )}

        <div className="flex items-center gap-[85px] col-span-3 row-start-3">
          <Label text="Rehearsals" />
          <DateRange
            className="w-fit"
            label="Date"
            onChange={({ from, to }) => {
              onChange('rehearsalFromDate', from?.toISOString() || '');
              onChange('rehearsalToDate', !rehearsalToDate && !to ? from?.toISOString() : to?.toISOString() || '');
            }}
            value={{
              from: rehearsalFromDate ? new Date(rehearsalFromDate) : null,
              to: rehearsalToDate ? new Date(rehearsalToDate) : null,
            }}
          />
        </div>
        <div className="flex items-center gap-12 col-span-3 row-start-3">
          <Label text="Production Dates" />
          <DateRange
            className="w-fit"
            label="Date"
            onChange={({ from, to }) => {
              onChange('productionFromDate', from?.toISOString() || '');
              onChange('productionToDate', !productionToDate && !to ? from?.toISOString() : to?.toISOString() || '');
            }}
            value={{
              from: productionFromDate ? new Date(productionFromDate) : null,
              to: productionToDate ? new Date(productionToDate) : null,
            }}
          />
        </div>

        <div className="flex items-center gap-[105px]">
          <Label text="Region" />
          <Select
            className="w-full"
            placeholder="Select Region(s)"
            onChange={(value) => onChange('region', value as string)}
            options={REGIONS_LIST}
            value={region}
            isMulti={true}
          />
        </div>
        <div className="flex items-center gap-6">
          <Label text="Currency for Reports" />
          <Select
            className="w-[150px]"
            onChange={(value) => onChange('currency', value as string)}
            options={currencyOptions}
            value={currency}
            isMulti={true}
          />
        </div>
        <div className="flex items-center gap-[87px]">
          <Label required text="Company" />
          <Select
            className="w-full"
            placeholder="Select Production Company"
            onChange={(value) => onChange('company', value as string)}
            options={companyOptions}
            value={company}
          />
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
          <div className="flex items-center ml-1 float-end">
            <Checkbox
              id="isArchived"
              label="Archived"
              checked={isArchived}
              onChange={(e) => onChange('isArchived', e.target.checked)}
            />
          </div>
        </div>

        <div className="pt-3 w-full flex items-center justify-end gap-2">
          <Button onClick={onClose} className="float-right px-4 w-33 font-normal" variant="secondary" text="Cancel" />
          <Button
            onClick={() => setConfirm(true)}
            className="float-right px-4 w-33 font-normal"
            variant="tertiary"
            text="Delete"
          />
          <Button
            className="float-right px-4 font-normal w-33 text-center"
            variant="primary"
            iconProps={{ className: 'h-4 w-3' }}
            text="Save and Close"
            onClick={() => onSave(formData)}
          />
        </div>
      </form>
      <ConfirmationDialog
        variant="delete"
        show={confirm}
        onYesClick={onConfirmDelete}
        onNoClick={() => setConfirm(false)}
        hasOverlay={false}
      />
    </PopupModal>
  );
};

export default ProductionsViewModal;
