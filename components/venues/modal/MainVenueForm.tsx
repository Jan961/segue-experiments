import Checkbox from 'components/core-ui-lib/Checkbox';
import Icon from 'components/core-ui-lib/Icon';
import Select from 'components/core-ui-lib/Select';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import TextInput from 'components/core-ui-lib/TextInput';
import Tooltip from 'components/core-ui-lib/Tooltip';
import { initialMainVenueDetails, venueStatusOptions } from 'config/venue';
import { useState } from 'react';

interface MainVenueFormProps {
  onChange: (data: any) => void;
  venueCurrencyOptionList: SelectOption[];
  venueFamilyOptionList: SelectOption[];
  validationErrors?: Record<string, string>;
  updateValidationErrrors?: (key: string, value: string) => void;
}
const MainVenueForm = ({
  onChange,
  venueCurrencyOptionList,
  venueFamilyOptionList,
  validationErrors,
  updateValidationErrrors,
}: MainVenueFormProps) => {
  const [formData, setFormData] = useState(initialMainVenueDetails);
  const handleInputChange = (field: string, value: any) => {
    let sanitizedValue = value;
    if (field === 'venueCode') {
      sanitizedValue = sanitizedValue?.replace(/[^a-zA-Z]/g, '').toUpperCase();
    }
    const updatedFormData = {
      ...formData,
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
      <div className="flex flex-col">
        <label htmlFor="" className="flex flex-row gap-5 justify-between">
          <p className="text-primary-input-text">Venue Code</p>
          <Tooltip
            width="w-[200px]"
            position="right"
            body="Venue Code is the first three letters of the town followed by the first three letters of the venue. eg. King's Theatre, Glasgow would have the code GLAKIN."
          >
            <TextInput
              id="venueCode"
              type="text"
              maxlength={6}
              className="w-[364px]"
              placeholder="Enter Venue Code"
              iconName="info-circle-solid"
              value={formData.venueCode}
              error={validationErrors.venueCode}
              onBlur={() => handleInputChange('venueCode', formData.venueCode)}
              onChange={(e) => handleInputChange('venueCode', e.target.value)}
            />
          </Tooltip>
        </label>
        {validationErrors.venueCode && (
          <small className="text-primary-red flex justify-end">{validationErrors.venueCode}</small>
        )}
      </div>
      <div className="flex flex-col">
        <Select
          label="Venue Status"
          options={venueStatusOptions}
          onChange={(value) => handleInputChange('venueStatus', value)}
          value={formData.venueStatus}
          placeholder="<Venue Status DROPDOWN>"
          className="w-[430px] font-bold place-self-end"
        />
        {validationErrors.venueStatus && (
          <small className="text-primary-red justify-end w-[430px] place-self-end">
            {validationErrors.venueStatus}
          </small>
        )}
      </div>
      <div className="flex flex-col">
        <label htmlFor="" className="flex flex-row gap-5 justify-between ">
          <p className="text-primary-input-text">Venue Name</p>
          <TextInput
            placeholder="Enter Venue Name"
            className="w-[364px]"
            value={formData.venueName}
            onChange={(e) => handleInputChange('venueName', e.target.value)}
          />
        </label>
        {validationErrors.venueName && <small className="text-primary-red">{validationErrors.venueName}</small>}
      </div>
      <div className="flex flex-row justify-between pl-20">
        <Checkbox
          label="VAT Indicator"
          id={'vatIndicator'}
          checked={formData.vatIndicator}
          onChange={(e) => handleInputChange('vatIndicator', e.target.value)}
        />
        <Checkbox
          label="Culturally Exempt Venue"
          id={'culturallyExemptVenue'}
          checked={formData.culturallyExemptVenue}
          onChange={(e) => handleInputChange('culturallyExemptVenue', e.target.value)}
        />
      </div>
      <div className="flex flex-col">
        <label className="flex flex-row gap-5 justify-between">
          <p className="text-primary-input-text">Venue Family</p>
          <Select
            name="venueFamily"
            placeholder="Venue Family Dropdown"
            className="w-[364px] font-bold"
            onChange={(value) => handleInputChange('venueFamily', value)}
            options={venueFamilyOptionList}
            isSearchable
          />
        </label>
        {validationErrors.venueFamily && <small className="text-primary-red">{validationErrors.venueFamily}</small>}
      </div>
      <div className="flex flex-col">
        <label className="flex flex-row gap-5 justify-between">
          <p className="text-primary-input-text">Currency</p>
          <Select
            name="currency"
            className="w-[364px] font-bold"
            placeholder="Currency Dropdown"
            onChange={(value) => handleInputChange('currency', value)}
            options={venueCurrencyOptionList}
            isSearchable
          />
        </label>
        {validationErrors.currency && <small className="text-primary-red">{validationErrors.currency}</small>}
      </div>
      <div className="flex flex-col">
        <label htmlFor="" className="flex flex-row gap-5 justify-between ">
          <p className="text-primary-input-text">Capacity</p>
          <TextInput
            placeholder="Enter Capacity"
            type="number"
            className="w-[364px]"
            value={formData.venueCapacity}
            onChange={(e) => handleInputChange('venueCapacity', parseFloat(e.target.value))}
          />
        </label>
        {validationErrors.venueCapacity && <small className="text-primary-red">{validationErrors.venueCapacity}</small>}
      </div>
      <label htmlFor="" className="flex flex-row gap-5 justify-between ">
        <p className="text-primary-input-text">Town Population</p>
        <TextInput
          placeholder="Enter Town Population"
          type="number"
          className="w-[364px]"
          value={formData.townPopulation}
          onChange={(e) => handleInputChange('townPopulation', parseFloat(e.target.value))}
        />
      </label>
      <label
        htmlFor=""
        className="grid grid-cols-[100px_minmax(500px,_1fr)] flex-row gap-10 justify-between col-span-2 w-full"
      >
        <p className="text-primary-input-text">Website</p>
        <TextInput
          placeholder="Enter Venue Website"
          className="w-full justify-between"
          inputClassName="w-full"
          value={formData.venueWebsite}
          onChange={(e) => handleInputChange('venueWebsite', parseFloat(e.target.value))}
        />
      </label>
      <label
        htmlFor=""
        className="grid grid-cols-[100px_minmax(500px,_1fr)] flex-row gap-10 justify-between col-span-2 w-full"
      >
        <p className="text-primary-input-text">Notes</p>
        <TextArea
          placeholder="Notes Field"
          className="w-full max-h-40 min-h-[50px]  justify-between"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
        />
      </label>
      <div className="flex flex-row items-center gap-4 ">
        <p className="text-primary-input-text">Exclude from Barring Check and Venue Gap Suggestions</p>
        <Tooltip
          width="w-[200px]"
          body="Selected venues will be excluded from Venue Gap Suggestions and Barring Checks. Selecting this check box will include this venue in that exclusion. This exclusion can be unselected when running the Suggestions or Barring Checks."
          position="right"
        >
          <Icon iconName="info-circle-solid" />
        </Tooltip>
        <Checkbox
          id={'excludeFromChecks'}
          checked={formData.excludeFromChecks}
          onChange={(e) => handleInputChange('excludeFromChecks', e.target.value)}
        />
      </div>
    </>
  );
};

export default MainVenueForm;
