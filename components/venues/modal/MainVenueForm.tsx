import Checkbox from 'components/core-ui-lib/Checkbox';
import Icon from 'components/core-ui-lib/Icon';
import Select from 'components/core-ui-lib/Select';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import TextInput from 'components/core-ui-lib/TextInput';
import Tooltip from 'components/core-ui-lib/Tooltip';
import { initialMainVenueDetails, venueStatusOptions } from 'config/venue';
import { useState } from 'react';
import { UiTransformedVenue } from 'utils/venue';
import { Label } from 'components/core-ui-lib';
import FormError from 'components/core-ui-lib/FormError';
interface MainVenueFormProps {
  venue: Partial<UiTransformedVenue>;
  venueFamilyOptionList: SelectOption[];
  validationErrors?: Record<string, string>;
  onChange: (data: any) => void;
  updateValidationErrrors?: (key: string, value: string) => void;
  disabled?: boolean;
}
const MainVenueForm = ({
  venue,
  venueFamilyOptionList,
  validationErrors,
  updateValidationErrrors,
  onChange,
  disabled,
}: MainVenueFormProps) => {
  const [formData, setFormData] = useState<Partial<UiTransformedVenue>>({ ...initialMainVenueDetails, ...venue });
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
      <div className="flex flex-col mb-1">
        <label htmlFor="" className="flex flex-row gap-5 justify-between">
          <div className="flex gap-x-1">
            <Label required text="Venue Code" variant="md" />
          </div>
          <Tooltip
            width="w-[200px]"
            position="right"
            body="Venue Code is the first three letters of the town followed by the first three letters of the venue. eg. King's Theatre, Glasgow would have the code GLAKIN."
          >
            <TextInput
              testId="main-venue-code"
              id="venueCode"
              type="text"
              maxlength={6}
              className="w-[364px]"
              placeholder="Enter Venue Code"
              iconName="info-circle-solid"
              value={formData.venueCode}
              error={validationErrors.venueCode}
              onChange={(e) => handleInputChange('venueCode', e.target.value)}
              disabled={disabled}
            />
            <FormError error={validationErrors.venueCode} className="absolute" />
          </Tooltip>
        </label>
      </div>
      <div className="flex flex-col mb-1">
        <Select
          testId="main-venue-status"
          label="Venue Status"
          options={venueStatusOptions}
          onChange={(value) => handleInputChange('venueStatus', value)}
          value={formData.venueStatus}
          placeholder="Select Venue Status"
          className="w-[430px] font-bold place-self-end"
          disabled={disabled}
        />
        <FormError error={validationErrors.venueStatus} className="absolute" />
      </div>
      <div className="flex flex-col mb-1">
        <label htmlFor="" className="flex flex-row gap-5 justify-between ">
          <div className="flex gap-x-1">
            <Label required text="Venue Name" variant="md" />
          </div>
          <div>
            <TextInput
              testId="main-venue-name"
              placeholder="Enter Venue Name"
              className="w-[364px]"
              value={formData.venueName}
              error={validationErrors.venueName}
              onChange={(e) => handleInputChange('venueName', e.target.value)}
              disabled={disabled}
            />
            <FormError error={validationErrors.venueName} className="absolute" />
          </div>
        </label>
      </div>
      <div className="flex flex-row justify-between pl-20 mb-1">
        <Checkbox
          testId="main-venue-vat-checkbox"
          label="VAT Indicator"
          id="vatIndicator"
          checked={formData.vatIndicator}
          onChange={(e) => handleInputChange('vatIndicator', e.target.value)}
          disabled={disabled}
        />
        <Checkbox
          testId="main-venue-culturallyExempt-checkbox"
          label="Culturally Exempt Venue"
          id="culturallyExempt"
          checked={formData.culturallyExempt}
          onChange={(e) => handleInputChange('culturallyExempt', e.target.value)}
          disabled={disabled}
        />
      </div>
      <div className="flex flex-col mb-1">
        <label className="flex flex-row gap-5 justify-between">
          <p className="text-primary-input-text">Venue Family</p>
          <Select
            testId="main-venue-family"
            name="venueFamily"
            placeholder="Select Venue Family"
            className="w-[364px] font-bold"
            onChange={(value) => handleInputChange('venueFamily', value)}
            options={venueFamilyOptionList}
            isSearchable
            disabled={disabled}
          />
        </label>
        {validationErrors.venueFamily && <small className="text-primary-red">{validationErrors.venueFamily}</small>}
      </div>
      <label htmlFor="" className="flex flex-row gap-5 justify-between mb-1">
        <p className="text-primary-input-text">Town Population</p>
        <TextInput
          testId="main-venue-town-population"
          placeholder="Enter Town Population"
          type="number"
          className="w-[364px]"
          value={formData.townPopulation}
          onChange={(e) => handleInputChange('townPopulation', parseFloat(e.target.value))}
          disabled={disabled}
        />
      </label>
      <div className="flex flex-col mb-1">
        <label htmlFor="" className="flex flex-row gap-5 justify-between ">
          <p className="text-primary-input-text">Capacity</p>
          <TextInput
            testId="main-venue-capacity"
            placeholder="Enter Capacity"
            type="number"
            className="w-[364px]"
            value={formData.venueCapacity}
            onChange={(e) => handleInputChange('venueCapacity', parseFloat(e.target.value))}
            disabled={disabled}
          />
        </label>
        {validationErrors.venueCapacity && <small className="text-primary-red">{validationErrors.venueCapacity}</small>}
      </div>
      <label
        htmlFor=""
        className="grid grid-cols-[100px_minmax(500px,_1fr)] flex-row gap-10 justify-between col-span-2 w-full mb-1"
      >
        <p className="text-primary-input-text">Website</p>
        <TextInput
          testId="main-venue-website"
          placeholder="Enter Venue Website"
          className="w-full justify-between"
          inputClassName="w-full"
          value={formData.venueWebsite}
          onChange={(e) => handleInputChange('venueWebsite', e.target.value)}
          disabled={disabled}
        />
      </label>
      <label
        htmlFor=""
        className="grid grid-cols-[100px_minmax(500px,_1fr)] flex-row gap-10 justify-between col-span-2 w-full mb-1"
      >
        <p className="text-primary-input-text">Notes</p>
        <TextArea
          testId="main-venue-notes"
          placeholder="Notes Field"
          className="w-full max-h-40 min-h-[50px]  justify-between"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          disabled={disabled}
        />
      </label>
      <div />
      <div className="flex items-center gap-4 w-full justify-end ">
        <p className="text-primary-input-text">Exclude from Barring Check and Venue Gap Suggestions</p>
        <Tooltip
          width="w-[200px]"
          body="Selected venues will be excluded from Venue Gap Suggestions and Barring Checks. Selecting this check box will include this venue in that exclusion. This exclusion can be unselected when running the Suggestions or Barring Checks."
          position="right"
        >
          <Icon iconName="info-circle-solid" />
        </Tooltip>
        <Checkbox
          testId="main-venue-exclude-barring-and-gap-suggestions-checkbox"
          id="excludeFromChecks"
          checked={formData.excludeFromChecks}
          onChange={(e) => handleInputChange('excludeFromChecks', e.target.value)}
          disabled={disabled}
        />
      </div>
    </>
  );
};

export default MainVenueForm;
