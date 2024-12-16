import Button from 'components/core-ui-lib/Button';
import Label from 'components/core-ui-lib/Label';
import TextInput from 'components/core-ui-lib/TextInput';
import React, { useState } from 'react';
import { useWizard } from 'react-use-wizard';
import Select from 'components/core-ui-lib/Select';
import schema from './schema/accountDetailsFormSchema';
import { Checkbox, PopupModal } from 'components/core-ui-lib';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import AuthError from './AuthError';

export type Account = {
  accountId?: number;
  companyName: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  town: string;
  country: string;
  postcode: string;
  email: string;
  vatNumber?: string;
  currency: string;
  contactId?: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  agreementChecked: boolean;
};

interface AccountDetailsFormProps {
  currencies: SelectOption[];
  countries: SelectOption[];
  accountDetails: Account;
  onChange: (v: Account) => void;
  onSave: (callBack: () => void) => void;
  error?: string;
}

const AccountDetailsForm = ({
  currencies,
  countries,
  accountDetails,
  onChange,
  onSave,
  error,
}: AccountDetailsFormProps) => {
  const { nextStep } = useWizard();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState(false);
  const handleAccountDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...accountDetails, [e.target.name]: e.target.value });
  };

  async function validateForm(data: Account) {
    try {
      await schema.validate({ ...data }, { abortEarly: false });
      return true;
    } catch (validationErrors) {
      const errors = {};
      validationErrors.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
      setValidationErrors(errors);
      return false;
    }
  }

  const handleNextClick = async () => {
    setValidationErrors({});
    if (await validateForm(accountDetails)) {
      onSave(() => nextStep());
    }
  };

  const handleShowLicenseModal = () => {
    if (!showModal) setShowModal(true);
  };

  return (
    <div className="mx-auto w-[700px]">
      <h1 className="mb-4 text-2xl font-bold text-center text-primary-input-text">Company Details</h1>
      <div className="w-full flex gap-10">
        <section className="w-1/2">
          <div className="mb-2">
            <Label text="First Name" required />
            <TextInput
              testId="first-name"
              name="firstName"
              placeholder="Enter first name"
              className="w-full"
              value={accountDetails.firstName}
              onChange={handleAccountDetailsChange}
            />
            {validationErrors.firstName && (
              <small className="text-primary-red mt-1">{validationErrors.firstName}</small>
            )}
          </div>
          <div className="mb-2">
            <Label text="Last Name" required />
            <TextInput
              testId="last-name"
              name="lastName"
              placeholder="Enter last name"
              className="w-full"
              value={accountDetails.lastName}
              onChange={handleAccountDetailsChange}
            />
            {validationErrors.lastName && <small className="text-primary-red mt-1">{validationErrors.lastName}</small>}
          </div>
          <div className="mb-2">
            <Label text="Company" required />
            <TextInput
              testId="company-name"
              name="companyName"
              placeholder="Enter name of main company"
              className="w-full"
              value={accountDetails.companyName}
              onChange={handleAccountDetailsChange}
            />
            {validationErrors.companyName && (
              <small className="text-primary-red mt-1">{validationErrors.companyName}</small>
            )}
          </div>
          <div className="mb-2">
            <Label text="Phone Number" required />
            <TextInput
              testId="phone-number"
              name="phoneNumber"
              placeholder="Enter phone number"
              className="w-full"
              value={accountDetails.phoneNumber}
              onChange={handleAccountDetailsChange}
            />
            {validationErrors.phoneNumber && (
              <small className="text-primary-red mt-1">{validationErrors.phoneNumber}</small>
            )}
          </div>
          <div className="mb-2">
            <Label text="Address line 1" required />
            <TextInput
              testId="address-line1"
              name="addressLine1"
              placeholder="Enter address line 1"
              className="w-full"
              value={accountDetails.addressLine1}
              onChange={handleAccountDetailsChange}
            />
            {validationErrors.addressLine1 && (
              <small className="text-primary-red mt-1">{validationErrors.addressLine1}</small>
            )}
          </div>
          <div className="mb-2">
            <Label text="Address line 2" required />
            <TextInput
              testId="address-line2"
              name="addressLine2"
              placeholder="Enter address line 2"
              className="w-full"
              value={accountDetails.addressLine2}
              onChange={handleAccountDetailsChange}
            />
            {validationErrors.addressLine2 && (
              <small className="text-primary-red mt-1">{validationErrors.addressLine2}</small>
            )}
          </div>
          <div className="mb-2">
            <Label text="Address line 3" />
            <TextInput
              testId="address-line3"
              name="addressLine3"
              placeholder="Enter address line 3"
              className="w-full"
              value={accountDetails.addressLine3}
              onChange={handleAccountDetailsChange}
            />
          </div>
        </section>
        <section className="w-1/2">
          <div className="mb-2">
            <Label text="Town" required />
            <TextInput
              testId="town"
              name="town"
              placeholder="Enter town"
              className="w-full"
              value={accountDetails.town}
              onChange={handleAccountDetailsChange}
            />
            {validationErrors.town && <small className="text-primary-red mt-1">{validationErrors.town}</small>}
          </div>
          <div className="mb-2">
            <Label text="Postcode" required />
            <TextInput
              testId="post-code"
              name="postcode"
              placeholder="Enter postcode"
              className="w-full"
              value={accountDetails.postcode}
              onChange={handleAccountDetailsChange}
            />
            {validationErrors.postcode && <small className="text-primary-red mt-1">{validationErrors.postcode}</small>}
          </div>
          <div className="mb-2">
            <Label text="Country" required />
            <Select
              testId="country"
              name="country"
              placeholder="Select country"
              className="w-full h-[31px]"
              options={countries}
              value={accountDetails.country}
              onChange={(value) => onChange({ ...accountDetails, country: value.toString() })}
              isClearable={false}
              isSearchable
            />
            {validationErrors.country && <small className="text-primary-red mt-1">{validationErrors.country}</small>}
          </div>
          <div className="mb-2">
            <Label text="Company Email Address" required />
            <TextInput
              testId="company-email"
              name="email"
              placeholder="Enter Company Email Address"
              className="w-full"
              value={accountDetails.email}
              onChange={handleAccountDetailsChange}
            />
            {validationErrors.email && <small className="text-primary-red mt-1">{validationErrors.email}</small>}
          </div>
          <div className="mb-2">
            <Label text="Currency for Payment" required />
            <Select
              testId="currency"
              name="currency"
              placeholder="Select currency"
              className="w-full h-[31px]"
              options={currencies}
              value={accountDetails.currency}
              onChange={(value) => onChange({ ...accountDetails, currency: value.toString() })}
              isClearable={false}
            />
            {validationErrors.currency && <small className="text-primary-red mt-1">{validationErrors.currency}</small>}
          </div>
          <div className="mb-2">
            <Label text="VAT Number" />
            <TextInput
              testId="vat-number"
              name="vatNumber"
              placeholder="Enter VAT Number"
              className="w-full"
              value={accountDetails.vatNumber}
              onChange={handleAccountDetailsChange}
            />
          </div>
          <div className="relative pt-2">
            <a href="#" onClick={handleShowLicenseModal} className="text-md ml-6 relative mt-3 underline">
              VIEW SOFTWARE LICENCE AGREEMENT
            </a>
            <Checkbox
              testId="licence-agreement"
              id="licence-agreement"
              name="agreementChecked"
              checked={accountDetails.agreementChecked}
              onChange={handleAccountDetailsChange}
              label="I have read and agree to the terms"
              required
            />
            {validationErrors.agreementChecked && (
              <small className="text-primary-red mt-1">{validationErrors.agreementChecked}</small>
            )}
          </div>

          <div className="w-full flex flex-col gap-2  items-end justify-end mt-10">
            {error && <AuthError error={error} />}
            <Button text="Next" onClick={handleNextClick} className="w-32" />
          </div>
        </section>
      </div>
      <PopupModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Licnese Agreement"
        titleClass="text-xl text-primary-navy font-bold -mt-2"
        hasOverlay={false}
      >
        <div className="w-80 h-80 p-4">
          <p className="text-primary-input-text">Pleace holder for Licence Agreement text</p>
        </div>
      </PopupModal>
    </div>
  );
};

export default AccountDetailsForm;
