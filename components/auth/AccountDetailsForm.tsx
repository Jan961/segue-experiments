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

  const canProceedToNextStep =
    isValidEmail &&
    accountDetails.accountId &&
    accountDetails.companyName &&
    accountDetails.firstName &&
    accountDetails.lastName &&
    accountDetails.phoneNumber &&
    accountDetails.email &&
    accountDetails.postcode;

  const handleAccountDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...accountDetails, [e.target.name]: e.target.value });
  };

  const handleNextClick = () => {
    nextStep();
  };

  return (
    <div className="mx-auto w-96">
      <div className="w-full flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center text-primary-input-text">Company Details</h1>
        <div>
          <Label text="First Name" />
          <TextInput
            name="firstName"
            placeholder="Enter first name"
            className="w-full"
            value={accountDetails.firstName}
            onChange={handleAccountDetailsChange}
          />
        </div>
        <div>
          <Label text="Last Name" />
          <TextInput
            name="lastName"
            placeholder="Enter last name"
            className="w-full"
            value={accountDetails.lastName}
            onChange={handleAccountDetailsChange}
          />
        </div>
        <div>
          <Label text="Company" />
          <TextInput
            name="companyName"
            placeholder="Enter name of main company"
            className="w-full"
            value={accountDetails.companyName}
            onChange={handleAccountDetailsChange}
          />
        </div>
        <div>
          <Label text="Phone Number" />
          <TextInput
            name="phoneNumber"
            placeholder="Enter phone number"
            className="w-full"
            value={accountDetails.phoneNumber}
            onChange={handleAccountDetailsChange}
          />
        </div>
        <div>
          <Label text="Address line 1" />
          <TextInput
            name="addressLine1"
            placeholder="Enter address line 1"
            className="w-full"
            value={accountDetails.addressLine1}
            onChange={handleAccountDetailsChange}
          />
        </div>
        <div>
          <Label text="Address line 2" />
          <TextInput
            name="addressLine2"
            placeholder="Enter address line 2"
            className="w-full"
            value={accountDetails.addressLine2}
            onChange={handleAccountDetailsChange}
          />
        </div>
        <div>
          <Label text="Address line 3" />
          <TextInput
            name="addressLine3"
            placeholder="Enter address line 3"
            className="w-full"
            value={accountDetails.addressLine3}
            onChange={handleAccountDetailsChange}
          />
        </div>
        <div>
          <Label text="Town" />
          <TextInput
            name="town"
            placeholder="Enter town"
            className="w-full"
            value={accountDetails.town}
            onChange={handleAccountDetailsChange}
          />
        </div>
        <div>
          <Label text="Postcode" />
          <TextInput
            name="postcode"
            placeholder="Enter postcode"
            className="w-full"
            value={accountDetails.postcode}
            onChange={handleAccountDetailsChange}
          />
        </div>
        <div>
          <Label text="Country" />
          <Select
            name="country"
            placeholder="Select country"
            className="w-full"
            options={[{ text: 'United Kingdom', value: 'United Kingdom' }]}
            value={accountDetails.country}
            onChange={(value) => onChange({ ...accountDetails, country: value.toString() })}
            isClearable={false}
          />
        </div>
        <div>
          <Label text="Company Email Address" />
          <TextInput
            name="email"
            placeholder="EnterCompany Email Addressr"
            className="w-full"
            value={accountDetails.email}
            onChange={handleAccountDetailsChange}
          />
        </div>
        <div>
          <Label text="Currency" />
          <Select
            name="currency"
            placeholder="Select currency"
            className="w-full"
            options={[{ text: 'GBP', value: 'GBP' }]}
            value={accountDetails.currency}
            onChange={(value) => onChange({ ...accountDetails, currency: value.toString() })}
            isClearable={false}
          />
        </div>
        <div>
          <Label text="VAT Number" />
          <TextInput
            name="vatNumber"
            placeholder="Enter VAT Number"
            className="w-full"
            value={accountDetails.vatNumber}
            onChange={handleAccountDetailsChange}
          />
        </div>
      </div>
      <div className="w-full flex gap-2  items-center justify-end mt-5">
        <Button text="Save" onClick={onSave} className="w-32" />
        <Button text="Next" onClick={handleNextClick} className="w-32" disabled={!canProceedToNextStep} />
      </div>
    </div>
  );
};

export default AccountDetailsForm;
