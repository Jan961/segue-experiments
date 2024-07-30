import { useEffect, useState } from 'react';
import { UiAccountType, initialUiAccountDetails } from 'config/account';
import { FormField } from 'components/account/form/FormField';
import Tooltip from 'components/core-ui-lib/Tooltip';
import Icon from 'components/core-ui-lib/Icon';
import Select from 'components/core-ui-lib/Select';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { transformToOptions } from 'utils';
import { Label } from 'components/core-ui-lib';
import schema from './AccountDetailsValidationSchema';
import { ImageUpload } from '../ImageUpload/ImageUpload';

export default function AccountDetailsTab() {
  const [formData, setFormData] = useState<UiAccountType>({ ...initialUiAccountDetails });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
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

        setCountryOptions(transformToOptions(data.countryList, 'Name', 'Id'));

        setCurrencyOptions(
          data.currencyList.map((currency) => {
            return { text: currency.Code + ' | ' + currency.Name, value: currency.Code };
          }),
        );

        const companyDetails = data?.companyDetails;
        const {
          AccountContact,
          AccountName,
          AccountPhone,
          AccountAddress1,
          AccountAddress2,
          AccountAddress3,
          AccountAddressTown,
          AccountAddressPostcode,
          AccountAddressCountry,
          AccountMainEmail,
          AccountPaymentCurrencyCode,
          AccountVATNumber,
          AccountCompanyNumber,
          AccountWebsite,
          AccountTypeOfCompany,
          AccountCurrencyCode,
        } = companyDetails;
        setFormData({
          firstName: AccountContact.AccContFirstName || '',
          lastName: AccountContact.AccContLastName || '',
          companyName: AccountName || '',
          phoneNumber: AccountPhone || '',
          addressLine1: AccountAddress1 || '',
          addressLine2: AccountAddress2 || '',
          addressLine3: AccountAddress3 || '',
          townName: AccountAddressTown || '',
          postcode: AccountAddressPostcode || '',
          country: AccountAddressCountry || '',
          companyEmail: AccountMainEmail || '',
          currencyForPayment: AccountPaymentCurrencyCode || '',
          vatNumber: AccountVATNumber || '',
          companyNumber: AccountCompanyNumber || '',
          companyWebsite: AccountWebsite || '',
          typeOfCompany: AccountTypeOfCompany || '',
          currency: AccountCurrencyCode || '',
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchCompanyInfo();
  }, []);

  async function validateInfo(data: UiAccountType) {
    try {
      await schema.validate({ ...data }, { abortEarly: false });
      return true;
    } catch (validationErrors) {
      const errors = {};
      validationErrors.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
      setValidationErrors(errors);
      console.log('validation Errors', errors);
      return false;
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setValidationErrors({});
    const updatedFormData = {
      ...formData,
      [field]: value,
    };
    setFormData(updatedFormData);
  };

  const handleBlur = async () => {
    try {
      const isValid = await validateInfo(formData);
      if (isValid) {
        await fetch('/api/admin/accountDetails/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
    } catch (Exception) {}
  };

  const selectedCountry = countryOptions.find((option) => option.text === formData.country)?.value;
  return (
    <div className="mb-8">
      <h2 className="text-2xl text-primary font-bold pt-3 mb-4">Account Holder Details</h2>
      <div className="flex flex-row gap-8 w-full">
        <div className="flex flex-col gap-3 w-1/2">
          <FormField
            currentValue={formData.firstName}
            displayText="First Name"
            fieldName="firstName"
            handleInputChange={handleInputChange}
            onBlur={handleBlur}
            required={true}
            validationCheck={validationErrors.firstName}
          />
          <FormField
            currentValue={formData.lastName}
            displayText="Last Name"
            fieldName="lastName"
            handleInputChange={handleInputChange}
            onBlur={handleBlur}
            required={true}
            validationCheck={validationErrors.lastName}
          />
          <FormField
            currentValue={formData.companyName}
            displayText="Company Name"
            fieldName="companyName"
            handleInputChange={handleInputChange}
            onBlur={handleBlur}
            required={true}
            validationCheck={validationErrors.companyName}
          />
          <FormField
            currentValue={formData.phoneNumber}
            displayText="Phone Number"
            fieldName="phoneNumber"
            handleInputChange={handleInputChange}
            onBlur={handleBlur}
            validationCheck={validationErrors.phoneNumber}
          />
          <FormField
            currentValue={formData.addressLine1}
            displayText="Address Line 1"
            fieldName="addressLine1"
            handleInputChange={handleInputChange}
            onBlur={handleBlur}
            required={true}
            validationCheck={validationErrors.addressLine1}
          />
          <FormField
            currentValue={formData.addressLine2}
            displayText="Address Line 2"
            fieldName="addressLine2"
            handleInputChange={handleInputChange}
            onBlur={handleBlur}
            validationCheck={validationErrors.addressLine2}
          />
          <FormField
            currentValue={formData.addressLine3}
            displayText="Address Line 3"
            fieldName="addressLine3"
            handleInputChange={handleInputChange}
            onBlur={handleBlur}
            validationCheck={validationErrors.addressLine3}
          />
          <FormField
            currentValue={formData.townName}
            displayText="Town"
            fieldName="townName"
            handleInputChange={handleInputChange}
            onBlur={handleBlur}
            validationCheck={validationErrors.townName}
          />
          <FormField
            currentValue={formData.postcode}
            displayText="Postcode"
            fieldName="postcode"
            handleInputChange={handleInputChange}
            onBlur={handleBlur}
            required={true}
            validationCheck={validationErrors.postcode}
          />
          <div>
            <div className="w-fit flex gap-x-2 items-center">
              <div className="flex gap-x-1 mr-1">
                <p className="text-primary-input-text">Country</p>
                <div>
                  <Label required={true} text="" className=" absolute" />
                </div>
                {validationErrors.country && (
                  <small className="text-primary-red self-center ml-1">{validationErrors.country}</small>
                )}
              </div>
              <Tooltip
                body="For venues in the United Kingdom: Please select Scotland, England, Wales or Northern Ireland as the Country"
                width="w-[200px]"
              >
                <Icon iconName="info-circle-solid" />
              </Tooltip>
            </div>
            <Select
              name="country"
              className="w-full font-bold"
              placeholder="Country"
              value={selectedCountry}
              onChange={(value) => {
                handleInputChange('country', countryOptions.find((option) => value === option.value)?.text);
              }}
              options={countryOptions}
              isSearchable
              onBlur={handleBlur}
              menuPlacement="top"
              error={validationErrors.country && true}
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 w-1/2">
          <ImageUpload />
          <FormField
            currentValue={formData.companyEmail}
            displayText="Email Address"
            fieldName="companyEmail"
            handleInputChange={handleInputChange}
            onBlur={handleBlur}
            required={true}
            validationCheck={validationErrors.companyEmail}
          />
          <div>
            <div className="flex gap-x-1">
              <p className="text-primary-input-text">Currency for Payment</p>
              <div>
                <Label required={true} text="" className=" absolute" />
              </div>
              {validationErrors.currencyForPayment && (
                <small className="text-primary-red self-center ml-1">{validationErrors.currencyForPayment}</small>
              )}
            </div>
            <Select
              name="currencyForPayment"
              className={`w-full h-[150] font-bold ${validationErrors.currencyForPayment ? 'bg-red-800' : ''}`}
              placeholder="Currency For Payment"
              value={formData.currencyForPayment}
              onChange={(value) => {
                handleInputChange(
                  'currencyForPayment',
                  currencyOptions.find((option) => value === option.value)?.value,
                );
              }}
              options={currencyOptions}
              isSearchable
              onBlur={handleBlur}
              error={validationErrors.currencyForPayment && true}
            />
          </div>
          <FormField
            currentValue={formData.vatNumber}
            displayText="VAT Number"
            fieldName="vatNumber"
            handleInputChange={handleInputChange}
            onBlur={handleBlur}
            validationCheck={validationErrors.vatNumber}
          />
          <FormField
            currentValue={formData.companyNumber}
            displayText="Company Number"
            fieldName="companyNumber"
            handleInputChange={handleInputChange}
            onBlur={handleBlur}
            validationCheck={validationErrors.companyNumber}
          />
          <FormField
            currentValue={formData.companyWebsite}
            displayText="Website"
            fieldName="companyWebsite"
            handleInputChange={handleInputChange}
            onBlur={handleBlur}
            validationCheck={validationErrors.Website}
          />
          <FormField
            currentValue={formData.typeOfCompany}
            displayText="Type of Company"
            fieldName="typeOfCompany"
            handleInputChange={handleInputChange}
            onBlur={handleBlur}
            validationCheck={validationErrors.typeOfCompany}
          />
          <div>
            <div className="flex gap-x-1">
              <p className="text-primary-input-text">Company Currency</p>
              <div>
                <Label required={true} text="" className=" absolute" />
              </div>
              {validationErrors.currency && (
                <small className="text-primary-red self-center ml-1">{validationErrors.currency}</small>
              )}
            </div>
            <Select
              name="currency"
              className="w-full font-bold"
              placeholder="Currency"
              value={formData.currency}
              onChange={(value) => {
                handleInputChange('currency', currencyOptions.find((option) => value === option.value)?.value);
              }}
              options={currencyOptions}
              isSearchable
              onBlur={handleBlur}
              menuPlacement="top"
              error={validationErrors.currency && true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
