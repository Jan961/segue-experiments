import { useEffect, useState } from 'react';
import { UiAccountType, initialUiAccountDetails } from 'config/account';
import { FormField } from '../../account/Form/FormField';
import Tooltip from '../../core-ui-lib/Tooltip';
import Icon from '../../core-ui-lib/Icon';
import Select from '../../core-ui-lib/Select';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { transformToOptions } from '../../../utils';
import { Button, UploadModal } from '../../core-ui-lib';

export default function AccountDetailsTab() {
  const [formData, setFormData] = useState<Partial<UiAccountType>>({ ...initialUiAccountDetails });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [companyInfo, setCompanyInfo] = useState(null);
  const [countryOptions, setCountryOptions] = useState<SelectOption[]>([]);
  const [currencyOptions, setCurrencyOptions] = useState<SelectOption[]>([]);
  const [uploadVisible, setUploadVisible] = useState<boolean>(false);

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
        const companyDetails = data?.companyDetails;
        setFormData({
          firstName: companyDetails?.FirstName || '',
          lastName: companyDetails?.LastName || '',
          companyName: companyDetails?.AccountName || '',
          phoneNumber: '',
          addressLine1: companyDetails?.AccountAddress1 || '',
          addressLine2: companyDetails?.AccountAddress2 || '',
          addressLine3: companyDetails?.AccountAddress3 || '',
          townName: companyDetails?.AccountAddressTown || '',
          postcode: companyDetails?.AccountAddressPostcode || '',
          country: companyDetails?.AccountAddressCountry || '',
          companyEmail: companyDetails?.AccountMainEmail || '',
          currencyForPayment: companyDetails?.AccountCurrencyCode || '',
          vatNumber: companyDetails?.AccountVATNumber || '',
          companyNumber: companyDetails?.AccountCompanyNumber || '',
          companyWebsite: companyDetails?.Website || '',
          typeOfCompany: companyDetails?.TypeOfCompany || '',
          currency: companyDetails?.AccountCurrencyCode || '',
        });
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
    console.log(value);
    console.log(field);
    const updatedFormData = {
      ...formData,
      [field]: value,
    };
    console.log(updatedFormData);
    setFormData(updatedFormData);
  };
  console.log(formData);
  const selectedCountry = countryOptions.find((option) => option.text === formData.country)?.value;
  return (
    <div className="flex flex-row gap-5 w-full">
      <div className="flex flex-col gap-5 w-1/2">
        <h2 className="text-base text-primary-input-text font-bold pt-7">Primary</h2>
        <div className="flex flex-col">
          <FormField
            currentValue={formData.firstName}
            displayText="First Name"
            fieldName="firstName"
            handleInputChange={handleInputChange}
          />
          {validationErrors.firstName && <small className="text-primary-red flex">{validationErrors.firstName}</small>}
        </div>
        <FormField
          currentValue={formData.lastName}
          displayText="Last Name"
          fieldName=""
          handleInputChange={handleInputChange}
        />
        <FormField
          currentValue={formData.companyName}
          displayText="Company Name"
          fieldName=""
          handleInputChange={handleInputChange}
        />
        <FormField
          currentValue={formData.phoneNumber}
          displayText="Phone Number"
          fieldName=""
          handleInputChange={handleInputChange}
        />
        <FormField
          currentValue={formData.addressLine1}
          displayText="Address Line 1"
          fieldName=""
          handleInputChange={handleInputChange}
        />
        <FormField
          currentValue={formData.addressLine2}
          displayText="Address Line 2"
          fieldName=""
          handleInputChange={handleInputChange}
        />
        <FormField
          currentValue={formData.addressLine3}
          displayText="Address Line 3"
          fieldName=""
          handleInputChange={handleInputChange}
        />
        <FormField
          currentValue={formData.townName}
          displayText="Town"
          fieldName=""
          handleInputChange={handleInputChange}
        />
        <FormField
          currentValue={formData.postcode}
          displayText="Postcode"
          fieldName=""
          handleInputChange={handleInputChange}
        />
        <label className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between w-full ">
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
            value={selectedCountry}
            onChange={(value) => handleInputChange('country', parseInt(value as string, 10))}
            options={countryOptions}
            isSearchable
          />
        </label>
      </div>
      <div className="flex flex-col gap-5 w-1/2">
        <div className="flex flex-col">
          <div className="h-[255px] overflow-y-hidden overflow-x-hidden">
            <label className="grid grid-cols-[90px_minmax(255px,_1fr)] gap-10 justify-between mt-16 w-full ml-96">
              <p className="text-primary-input-text">Company Logo</p>
              <Button
                onClick={() => {
                  setUploadVisible(true);
                }}
                text="Upload"
                variant="secondary"
                className="w-[132px]"
              />
              <UploadModal
                title=""
                visible={uploadVisible}
                info=""
                allowedFormats={[]}
                onClose={() => {
                  setUploadVisible(false);
                }}
              />
            </label>
          </div>
          <FormField
            currentValue={formData.companyEmail}
            displayText="Email Address"
            fieldName=""
            handleInputChange={handleInputChange}
          />
          <label className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
            <p className="text-primary-input-text">Currency for Payment</p>
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
        <FormField
          currentValue={formData.vatNumber}
          displayText="VAT Number"
          fieldName=""
          handleInputChange={handleInputChange}
        />
        <FormField
          currentValue={formData.companyNumber}
          displayText="Company Number"
          fieldName=""
          handleInputChange={handleInputChange}
        />
        <FormField
          currentValue={formData.companyWebsite}
          displayText="Website"
          fieldName=""
          handleInputChange={handleInputChange}
        />
        <FormField
          currentValue={formData.typeOfCompany}
          displayText="Type of Company"
          fieldName=""
          handleInputChange={handleInputChange}
        />
        <label className="grid grid-cols-[90px_minmax(300px,_1fr)] gap-10 justify-between  w-full">
          <p className="text-primary-input-text">Company Currency</p>
          <Select
            name="currency"
            className="w-full font-bold"
            placeholder="Currency"
            value={formData.currency}
            onChange={(value) => handleInputChange('currency', parseInt(value as string, 10))}
            options={currencyOptions}
            isSearchable
          />
        </label>
      </div>
    </div>
  );
}
