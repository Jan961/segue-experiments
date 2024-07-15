import { useEffect, useState } from 'react';
import { UiAccountType, initialUiAccountDetails } from 'config/account';
import { FormField } from '../../account/Form/FormField';
import Tooltip from '../../core-ui-lib/Tooltip';
import Icon from '../../core-ui-lib/Icon';
import Select from '../../core-ui-lib/Select';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { transformToOptions } from '../../../utils';

export default function AccountDetailsTab() {
  const [formData, setFormData] = useState<Partial<UiAccountType>>({ ...initialUiAccountDetails });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [companyInfo, setCompanyInfo] = useState(null);
  const [countryOptions, setCountryOptions] = useState<SelectOption[]>([]);
  const [currencyOptions, setCurrencyOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const response = await fetch('/api/admin/accountDetails/read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: null,
        });
        const data = await response.json();
        setCompanyInfo(data);
        console.log(data.countryList);
        setCountryOptions(transformToOptions(data.countryList, 'Name', 'Id'));
        console.log(transformToOptions(data.countryList, 'Name', 'Id'));
        setCurrencyOptions(transformToOptions(data.currencyList, 'Code', 'Code'));
      } catch (error) {
        setValidationErrors({});
        console.log(companyInfo);
        console.log(error);
      }
    };

    fetchCompanyInfo();
  }, []);

  // async function validateDetails(data: UiAccountType) {
  //   try {
  //     await schema.validate({ ...data }, { abortEarly: false });
  //     return true;
  //   } catch (validationErrors) {
  //     const errors = {};
  //     validationErrors.inner.forEach((error) => {
  //       errors[error.path] = error.message;
  //     });
  //     setValidationErrors(errors);
  //     console.log('validation Errors', errors);
  //     return false;
  //   }
  // }

  const handleInputChange = (field: string, value: any) => {
    let sanitizedValue = value;

    if (field === 'venueCode') {
      sanitizedValue = sanitizedValue?.replace(/[^a-zA-Z]/g, '').toUpperCase();
    }
    // validate email here

    const updatedFormData = {
      // ...venue,
      [field]: sanitizedValue,
    };
    setFormData(updatedFormData);
  };
  console.log(countryOptions);
  return (
    <div className="flex flex-row gap-5 w-full">
      <div className="flex flex-col gap-5 w-1/2">
        <h2 className="text-base text-primary-input-text font-bold pt-7">Primary</h2>
        <div className="flex flex-col">
          <FormField value={formData.firstName} displayText="First Name" handleInputChange={handleInputChange} />
          {validationErrors.firstName && <small className="text-primary-red flex">{validationErrors.firstName}</small>}
        </div>
        <FormField value={formData.lastName} displayText="Last Name" handleInputChange={handleInputChange} />
        <FormField value={formData.companyName} displayText="Company Name" handleInputChange={handleInputChange} />
        <FormField value={formData.phoneNumber} displayText="Phone Number" handleInputChange={handleInputChange} />
        <FormField value={formData.addressLine1} displayText="Address Line 1" handleInputChange={handleInputChange} />
        <FormField value={formData.addressLine2} displayText="Address Line 2" handleInputChange={handleInputChange} />
        <FormField value={formData.addressLine3} displayText="Address Line 3" handleInputChange={handleInputChange} />
        <FormField value={formData.townName} displayText="Town" handleInputChange={handleInputChange} />
        <FormField value={formData.postcode} displayText="Postcode" handleInputChange={handleInputChange} />
        <label className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
          <Tooltip
            body="For venues in the United Kingdom: Please select Scotland, England, Wales or Northern Ireland as the Country"
            width="w-[200px]"
          >
            <p className="text-primary-input-text">Country</p>
            <Icon iconName="info-circle-solid" />
          </Tooltip>
          <Select
            name="country"
            className="w-full font-bold"
            placeholder="Country"
            value={formData.country}
            onChange={(value) => handleInputChange('country', parseInt(value as string, 10))}
            options={countryOptions}
            isSearchable
          />
        </label>
      </div>
      <div className="flex flex-col gap-5 w-1/2">
        <h2 className="text-base text-primary-input-text font-bold pt-7">Primary</h2>
        <div className="flex flex-col">
          <label className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
            <p className="text-primary-input-text">Country</p>
            <Select
              name="currencyForPayment"
              className="w-full font-bold"
              placeholder="Currency For Payment"
              value={formData.currencyForPayment}
              onChange={(value) => handleInputChange('currencyForPayment', parseInt(value as string, 10))}
              options={currencyOptions}
              isSearchable
            />
          </label>
        </div>
        <FormField value={formData.lastName} displayText="Last Name" handleInputChange={handleInputChange} />
        <FormField value={formData.companyName} displayText="Company Name" handleInputChange={handleInputChange} />
        <FormField value={formData.phoneNumber} displayText="Phone Number" handleInputChange={handleInputChange} />
      </div>
    </div>
  );
}
