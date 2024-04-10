import Checkbox from 'components/core-ui-lib/Checkbox';
import Select from 'components/core-ui-lib/Select';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import TextInput from 'components/core-ui-lib/TextInput';
import Tooltip from 'components/core-ui-lib/Tooltip';
import { initialMainVenueDetails, venueStatusOptions } from 'config/Venue';
import { useState } from 'react';

type MainVenueFormProps = {
  onChange: (data: any) => void;
  venueCurrencyOptionList: SelectOption[];
  venueFamilyOptionList: SelectOption[];
};
const MainVenueForm = ({ onChange, venueCurrencyOptionList, venueFamilyOptionList }: MainVenueFormProps) => {
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
  };
  return (
    <>
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
            onBlur={() => handleInputChange('venueCode', formData.venueCode)}
            onChange={(e) => handleInputChange('venueCode', e.target.value)}
          />
        </Tooltip>
      </label>
      <Select
        label="Venue Status"
        options={venueStatusOptions}
        onChange={(value) => handleInputChange('venueStatus', value)}
        value={formData.venueStatus}
        placeholder="<Venue Status DROPDOWN>"
        className="w-[430px] font-bold place-self-end "
      />

      <label htmlFor="" className="flex flex-row gap-5 justify-between ">
        <p className="text-primary-input-text">Venue Name</p>
        <TextInput
          placeholder="Enter Venue Name"
          type=""
          className="w-[364px]"
          value={formData.venueName}
          onChange={(e) => handleInputChange('venueName', e.target.value)}
        />
      </label>
      <div className="flex flex-row justify-between pl-20">
        <Checkbox
          label="VAT Indicator"
          id={'vatIndicator'}
          onChange={(e) => handleInputChange('vatIndicator', e.target.value)}
        />
        <Checkbox
          label="Culturally Exempt Venue"
          id={'culturallyExemptVenue'}
          onChange={(e) => handleInputChange('culturallyExemptVenue', e.target.value)}
        />
      </div>
      <label className="flex flex-row gap-5 justify-between ">
        <p className="text-primary-input-text">Venue Family</p>
        <Select
          name="venueFamily"
          placeholder="Venue Family Dropdown"
          className="w-[364px] font-bold"
          onChange={(value) => handleInputChange('venueFamily', value)}
          options={venueFamilyOptionList}
        />
      </label>
      <label className="flex flex-row gap-5 justify-between  ">
        <p className="text-primary-input-text">Currency</p>
        <Select
          name="currency"
          className="mr-[175px] font-bold"
          placeholder="Currency Dropdown"
          onChange={(value) => handleInputChange('currency', value)}
          options={venueCurrencyOptionList}
          isSearchable
        />
      </label>
      <label htmlFor="" className="flex flex-row gap-5 justify-between ">
        <p className="text-primary-input-text">Capacity</p>
        <TextInput
          placeholder="Enter Capacity"
          type="number"
          className="w-[364px]"
          value={formData.venueCapacity}
          onChange={(e) => handleInputChange('venueCapacity', e.target.value)}
        />
      </label>
      <label htmlFor="" className="flex flex-row gap-5 justify-between ">
        <p className="text-primary-input-text">Town Population</p>
        <TextInput
          placeholder="Enter Town Population"
          type="number"
          className="w-[364px]"
          value={formData.townPopulation}
          onChange={(e) => handleInputChange('townPopulation', e.target.value)}
        />
      </label>
      <label
        htmlFor=""
        className="grid grid-cols-[100px_minmax(500px,_1fr)] flex-row gap-10 justify-between col-span-2 w-full"
      >
        <p className="text-primary-input-text">Website</p>
        <TextInput
          placeholder="Enter Venue Website"
          type=""
          className="w-full justify-between"
          inputClassName="w-full"
          value={formData.venueWebsite}
          onChange={(e) => handleInputChange('venueWebsite', e.target.value)}
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
    </>
  );
};

export default MainVenueForm;
