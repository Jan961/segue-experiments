import Button from 'components/core-ui-lib/Button';
import Label from 'components/core-ui-lib/Label';
import TextInput from 'components/core-ui-lib/TextInput';
import React, { useMemo } from 'react';
import { useWizard } from 'react-use-wizard';
import Select from 'components/core-ui-lib/Select';

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
};
interface AccountDetailsFormProps {
  accountDetails: Account;
  onChange: (v: Account) => void;
  onSave: () => void;
}

const AccountDetailsForm = ({ accountDetails, onChange, onSave }: AccountDetailsFormProps) => {
  const { nextStep } = useWizard();

  const isValidEmail = useMemo(() => {
    return /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(accountDetails.email);
  }, [accountDetails.email]);

  const canProceedToNextStep = useMemo(() => {
    return (
      isValidEmail &&
      accountDetails.accountId &&
      accountDetails.companyName &&
      accountDetails.firstName &&
      accountDetails.lastName &&
      accountDetails.phoneNumber &&
      accountDetails.email &&
      accountDetails.postcode
    );
  }, [accountDetails, isValidEmail]);

  const handleAccountDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...accountDetails, [e.target.name]: e.target.value });
  };

  return (
    <div className="mx-auto w-[700px]">
      <h1 className="mb-4 text-2xl font-bold text-center text-primary-input-text">Company Details</h1>
      <div className="w-full flex gap-10">
        <section className="w-1/2">
          <div className="mb-2">
            <Label text="First Name" />
            <TextInput
              data-testid="first-name"
              name="firstName"
              placeholder="Enter first name"
              className="w-full"
              value={accountDetails.firstName}
              onChange={handleAccountDetailsChange}
            />
          </div>
          <div className="mb-2">
            <Label text="Last Name" />
            <TextInput
              data-testid="last-name"
              name="lastName"
              placeholder="Enter last name"
              className="w-full"
              value={accountDetails.lastName}
              onChange={handleAccountDetailsChange}
            />
          </div>
          <div className="mb-2">
            <Label text="Company" />
            <TextInput
              data-testid="company-name"
              name="companyName"
              placeholder="Enter name of main company"
              className="w-full"
              value={accountDetails.companyName}
              onChange={handleAccountDetailsChange}
            />
          </div>
          <div className="mb-2">
            <Label text="Phone Number" />
            <TextInput
              data-testid="phone-number"
              name="phoneNumber"
              placeholder="Enter phone number"
              className="w-full"
              value={accountDetails.phoneNumber}
              onChange={handleAccountDetailsChange}
            />
          </div>
          <div className="mb-2">
            <Label text="Address line 1" />
            <TextInput
              data-testid="address-line1"
              name="addressLine1"
              placeholder="Enter address line 1"
              className="w-full"
              value={accountDetails.addressLine1}
              onChange={handleAccountDetailsChange}
            />
          </div>
          <div className="mb-2">
            <Label text="Address line 2" />
            <TextInput
              data-testid="address-line2"
              name="addressLine2"
              placeholder="Enter address line 2"
              className="w-full"
              value={accountDetails.addressLine2}
              onChange={handleAccountDetailsChange}
            />
          </div>
          <div className="mb-2">
            <Label text="Address line 3" />
            <TextInput
              data-testid="address-line3"
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
            <Label text="Town" />
            <TextInput
              data-testid="town"
              name="town"
              placeholder="Enter town"
              className="w-full"
              value={accountDetails.town}
              onChange={handleAccountDetailsChange}
            />
          </div>
          <div className="mb-2">
            <Label text="Postcode" />
            <TextInput
              data-testid="post-code"
              name="postcode"
              placeholder="Enter postcode"
              className="w-full"
              value={accountDetails.postcode}
              onChange={handleAccountDetailsChange}
            />
          </div>
          <div className="mb-2">
            <Label text="Country" />
            <Select
              name="country"
              placeholder="Select country"
              className="w-full h-[31px]"
              options={[{ text: 'United Kingdom', value: 'United Kingdom' }]}
              value={accountDetails.country}
              onChange={(value) => onChange({ ...accountDetails, country: value.toString() })}
              isClearable={false}
            />
          </div>
          <div className="mb-2">
            <Label text="Company Email Address" />
            <TextInput
              data-testid="company-email"
              name="email"
              placeholder="EnterCompany Email Addressr"
              className="w-full"
              value={accountDetails.email}
              onChange={handleAccountDetailsChange}
            />
          </div>
          <div className="mb-2">
            <Label text="Currency for Payment" />
            <Select
              name="currency"
              placeholder="Select currency"
              className="w-full h-[31px]"
              options={[{ text: 'GBP', value: 'GBP' }]}
              value={accountDetails.currency}
              onChange={(value) => onChange({ ...accountDetails, currency: value.toString() })}
              isClearable={false}
            />
          </div>
          <div className="mb-2">
            <Label text="VAT Number" />
            <TextInput
              data-testid="vat-number"
              name="vatNumber"
              placeholder="Enter VAT Number"
              className="w-full"
              value={accountDetails.vatNumber}
              onChange={handleAccountDetailsChange}
            />
          </div>
          <div className="w-full flex gap-2  items-center justify-end mt-10">
            <Button text="Save" onClick={onSave} className="w-32" />
            <Button text="Next" onClick={nextStep} className="w-32" disabled={!canProceedToNextStep} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default AccountDetailsForm;
