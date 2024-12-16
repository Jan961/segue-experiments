import Select from 'components/core-ui-lib/Select';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import TextInput from 'components/core-ui-lib/TextInput';
import { initialVenueAddressDetails } from 'config/venue';
import { useState } from 'react';
import { UiTransformedVenue } from 'utils/venue';
import { Icon, Tooltip, Label } from 'components/core-ui-lib';
import FormError from 'components/core-ui-lib/FormError';

interface VenueAddressFormProps {
  venue: Partial<UiTransformedVenue>;
  countryOptions: SelectOption[];
  validationErrors?: Record<string, string>;
  updateValidationErrrors?: (key: string, value: string) => void;
  onChange: (data: any) => void;
  townSelectOptions: SelectOption[];
  disabled?: boolean;
}
const VenueAddressForm = ({
  venue,
  countryOptions,
  validationErrors,
  updateValidationErrrors,
  onChange,
  townSelectOptions,
  disabled,
}: VenueAddressFormProps) => {
  const [formData, setFormData] = useState<Partial<UiTransformedVenue>>({ ...initialVenueAddressDetails, ...venue });

  const handleInputChange = (field: string, value: any) => {
    let sanitizedValue = value;
    if (field === 'venueCode') {
      sanitizedValue = sanitizedValue?.replace(/[^a-zA-Z]/g, '').toUpperCase();
    }
    const updatedFormData = {
      ...venue,
      [field]: sanitizedValue,
    };
    setFormData(updatedFormData);
    onChange(updatedFormData);
    if (validationErrors?.[field]) {
      updateValidationErrrors(field, null);
    }
  };
  return (
    <>
      <div className="flex flex-col gap-6">
        <h2 className="text-base text-primary-input-text font-bold pt-7">Primary</h2>
        <div className="flex flex-col">
          <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
            <div className="flex gap-x-1">
              <Label required text="Address 1" variant="md" />
            </div>
            <div>
              <TextInput
                testId="primary-address-1"
                placeholder="Enter Address 1"
                className="w-full justify-between"
                inputClassName="w-full"
                value={formData.primaryAddress1}
                error={validationErrors.primaryAddress1}
                onChange={(e) => handleInputChange('primaryAddress1', e.target.value)}
                disabled={disabled}
              />
              <FormError error={validationErrors.primaryAddress1} className="absolute" />
            </div>
          </label>
        </div>
        <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
          <p className="text-primary-input-text">Address 2</p>
          <TextInput
            testId="primary-address-2"
            placeholder="Enter Address 2"
            className="w-full justify-between"
            inputClassName="w-full"
            value={formData.primaryAddress2}
            onChange={(e) => handleInputChange('primaryAddress2', e.target.value)}
            disabled={disabled}
          />
        </label>
        <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
          <p className="text-primary-input-text">Address 3</p>
          <TextInput
            testId="primary-address-3"
            placeholder="Enter Address 3"
            className="w-full justify-between"
            inputClassName="w-full"
            value={formData.primaryAddress3}
            onChange={(e) => handleInputChange('primaryAddress3', e.target.value)}
            disabled={disabled}
          />
        </label>
        <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
          <Label required text="Town" variant="md" />
          <div>
            <Select
              testId="primary-address-town"
              placeholder="Select A Town"
              className="w-full justify-between"
              value={formData.primaryTown}
              error={!!validationErrors.primaryTown}
              onChange={(e) => handleInputChange('primaryTown', e)}
              disabled={disabled}
              options={townSelectOptions}
              isSearchable
            />
            <FormError error={validationErrors.primaryTown} className="absolute" />
          </div>
        </label>
        <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
          <Label required text="Postcode" variant="md" />
          <div>
            <TextInput
              testId="primary-address-postcode"
              placeholder="Enter Postcode"
              className="w-full justify-between"
              inputClassName="w-full"
              value={formData.primaryPostCode}
              onChange={(e) => handleInputChange('primaryPostCode', e.target.value)}
              error={validationErrors.primaryPostCode}
              disabled={disabled}
            />
            <FormError error={validationErrors.primaryPostCode} className="absolute" />
          </div>
        </label>
        <div className="flex flex-col">
          <label className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between w-full">
            <div className="flex  gap-x-1">
              <div className="flex gap-x-1">
                <Label required text="Country" variant="md" />
              </div>
              <div className="mt-1">
                <Tooltip
                  body="For venues in the United Kingdom: Please select Scotland, England, Wales or Northern Ireland as the Country"
                  width="w-[200px]"
                >
                  <Icon iconName="info-circle-solid" />
                </Tooltip>
              </div>
            </div>
            <div>
              <Select
                testId="primary-country"
                name="primaryCountry"
                className="w-full font-bold"
                placeholder="Country"
                value={formData.primaryCountry}
                onChange={(value) => handleInputChange('primaryCountry', parseInt(value as string, 10))}
                options={countryOptions}
                isSearchable
                error={validationErrors.primaryCountry && true}
                disabled={disabled}
              />
              <FormError error={validationErrors.primaryCountry} className="absolute" />
            </div>
          </label>
        </div>
        <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
          <p className="text-primary-input-text">Phone</p>
          <TextInput
            testId="primary-phone-no"
            placeholder="Enter Phone Number"
            className="w-full justify-between"
            inputClassName="w-full"
            value={formData.primaryPhoneNumber}
            onChange={(e) => handleInputChange('primaryPhoneNumber', e.target.value)}
            disabled={disabled}
          />
        </label>
        <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
          <p className="text-primary-input-text">Email</p>
          <TextInput
            testId="primary-email"
            placeholder="Enter Email"
            className="w-full justify-between"
            inputClassName="w-full"
            value={formData.primaryEMail}
            onChange={(e) => handleInputChange('primaryEMail', e.target.value)}
            disabled={disabled}
          />
        </label>
        <label htmlFor="" className="grid grid-cols-[170px_minmax(100px,_1fr)] gap-10 justify-between  w-full">
          <p className="text-primary-input-text">What3Words Venue Entrance</p>
          <TextInput
            testId="primary-what-three-words"
            placeholder="what.three.words"
            className="w-full justify-between"
            inputClassName="w-full"
            value={formData.what3WordsEntrance}
            disabled={disabled}
            onChange={(e) => handleInputChange('what3WordsEntrance', e.target.value)}
          />
        </label>
        <label htmlFor="" className="grid grid-cols-[170px_minmax(100px,_1fr)] gap-10 justify-between  w-full">
          <p className="text-primary-input-text">What3Words Stage Door</p>
          <TextInput
            testId="primary-what-three-words"
            placeholder="what.three.words"
            className="w-full justify-between"
            inputClassName="w-full"
            value={formData.what3WordsStage}
            disabled={disabled}
            onChange={(e) => handleInputChange('what3WordsStage', e.target.value)}
          />
        </label>
        <label htmlFor="" className="grid grid-cols-[170px_minmax(100px,_1fr)] gap-10 justify-between  w-full">
          <p className="text-primary-input-text">What3Words Loading Bay</p>
          <TextInput
            testId="delivery-what-three-words"
            placeholder="what.three.words"
            className="w-full justify-between"
            inputClassName="w-full"
            value={formData.what3WordsLoading}
            onChange={(e) => handleInputChange('what3WordsLoading', e.target.value)}
            disabled={disabled}
          />
        </label>
      </div>
      <div className="flex flex-col gap-6">
        <h2 className="text-base text-primary-input-text font-bold pt-7">Delivery</h2>
        <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
          <p className="text-primary-input-text">Address 1</p>
          <TextInput
            testId="delivery-address-1"
            placeholder="Enter Address 1"
            className="w-full justify-between"
            inputClassName="w-full"
            value={formData.deliveryAddress1}
            onChange={(e) => handleInputChange('deliveryAddress1', e.target.value)}
            disabled={disabled}
          />
        </label>
        <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
          <p className="text-primary-input-text">Address 2</p>
          <TextInput
            testId="delivery-address-2"
            placeholder="Enter Address 2"
            className="w-full justify-between"
            inputClassName="w-full"
            value={formData.deliveryAddress2}
            onChange={(e) => handleInputChange('deliveryAddress2', e.target.value)}
            disabled={disabled}
          />
        </label>
        <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
          <p className="text-primary-input-text">Address 3</p>
          <TextInput
            testId="delivery-address-3"
            placeholder="Enter Address 3"
            className="w-full justify-between"
            inputClassName="w-full"
            value={formData.deliveryAddress3}
            disabled={disabled}
            onChange={(e) => handleInputChange('deliveryAddress3', e.target.value)}
          />
        </label>
        <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
          <p className="text-primary-input-text">Town</p>
          <Select
            testId="delivery-town"
            placeholder="Select A Town"
            className="w-full justify-between"
            value={formData.deliveryTown}
            onChange={(e) => handleInputChange('deliveryTown', e)}
            disabled={disabled}
            options={townSelectOptions}
            isSearchable
          />
        </label>
        <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
          <p className="text-primary-input-text">Postcode</p>
          <TextInput
            testId="delivery-postcode"
            placeholder="Enter Postcode"
            className="w-full justify-between"
            inputClassName="w-full"
            value={formData.deliveryPostCode}
            onChange={(e) => handleInputChange('deliveryPostCode', e.target.value)}
            disabled={disabled}
          />
        </label>

        <label className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
          <div className="flex gap-x-1">
            <div className="flex gap-x-1">
              <Label text="Country" variant="md" />
            </div>
            <div className="mt-1">
              <Tooltip
                body="For venues in the United Kingdom: Please select Scotland, England, Wales or Northern Ireland as the Country"
                width="w-[200px]"
              >
                <Icon iconName="info-circle-solid" />
              </Tooltip>
            </div>
          </div>
          <Select
            testId="delivery-country"
            name="deliveryCountry"
            className="w-full font-bold"
            placeholder="Country"
            value={formData.deliveryCountry}
            onChange={(value) => handleInputChange('deliveryCountry', parseInt(value as string, 10))}
            options={countryOptions}
            isSearchable
            disabled={disabled}
          />
        </label>
        <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
          <p className="text-primary-input-text">Phone</p>
          <TextInput
            testId="delivery-phone-no"
            placeholder="Enter Phone Number"
            className="w-full justify-between"
            inputClassName="w-full"
            value={formData.deliveryPhoneNumber}
            onChange={(e) => handleInputChange('deliveryPhoneNumber', e.target.value)}
            disabled={disabled}
          />
        </label>
        <label htmlFor="" className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
          <p className="text-primary-input-text">Email</p>
          <TextInput
            testId="delivery-email"
            placeholder="Enter Email"
            className="w-full justify-between"
            inputClassName="w-full"
            value={formData.deliveryEMail}
            onChange={(e) => handleInputChange('deliveryEMail', e.target.value)}
            disabled={disabled}
          />
        </label>
      </div>
    </>
  );
};

export default VenueAddressForm;
