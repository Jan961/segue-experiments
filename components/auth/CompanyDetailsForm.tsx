import Button from 'components/core-ui-lib/Button';
import Label from 'components/core-ui-lib/Label';
import TextInput from 'components/core-ui-lib/TextInput';
import React, { useMemo, useState } from 'react';
import { useWizard } from 'react-use-wizard';
import Select from 'components/core-ui-lib/Select';

export type Company = {
  companyId?: number;
  companyName: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  town: string;
  country: string;
  postcode: string;
  email: string;
  vatNumber: string;
};

export type Contact = {
  contactId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

const DEFAULT_CONTACT_DETAILS = {
  contactId: null,
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
};

const DEFAULT_COMPANY_DETAILS = {
  companyId: null,
  companyName: '',
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  town: '',
  country: '',
  postcode: '',
  email: '',
  vatNumber: '',
};

interface CompanyDetailsFormProps {
  data: Company & Contact;
  onSubmit: (data: Company & Contact) => void;
}
const CompanyDetailsForm = ({ onSubmit }: CompanyDetailsFormProps) => {
  const [companyDetails, setCompanyDetails] = useState<Company>(DEFAULT_COMPANY_DETAILS);
  const [contactDetails, setContactDetails] = useState<Contact>(DEFAULT_CONTACT_DETAILS);

  const { nextStep } = useWizard();

  const isValidEmail = useMemo(() => {
    return /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(companyDetails.email);
  }, [companyDetails.email]);

  const canProceedToNextStep =
    isValidEmail &&
    companyDetails.companyName &&
    contactDetails.firstName &&
    contactDetails.lastName &&
    contactDetails.phoneNumber &&
    companyDetails.email &&
    companyDetails.postcode;

  const handleCompanyDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyDetails({ ...companyDetails, [e.target.name]: e.target.value });
  };

  const handleContactDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactDetails({ ...contactDetails, [e.target.name]: e.target.value });
  };

  const handleSaveCompanyDetails = async () => {
    onSubmit({ ...companyDetails, ...contactDetails });
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
            value={contactDetails.firstName}
            onChange={handleContactDetailsChange}
          />
        </div>
        <div>
          <Label text="Last Name" />
          <TextInput
            name="lastName"
            placeholder="Enter last name"
            className="w-full"
            value={contactDetails.lastName}
            onChange={handleContactDetailsChange}
          />
        </div>
        <div>
          <Label text="Company" />
          <TextInput
            name="companyName"
            placeholder="Enter name of main company"
            className="w-full"
            value={companyDetails.companyName}
            onChange={handleCompanyDetailsChange}
          />
        </div>
        <div>
          <Label text="Phone Number" />
          <TextInput
            name="phoneNumber"
            placeholder="Enter phone number"
            className="w-full"
            value={contactDetails.phoneNumber}
            onChange={handleContactDetailsChange}
          />
        </div>
        <div>
          <Label text="Address line 1" />
          <TextInput
            name="addressLine1"
            placeholder="Enter address line 1"
            className="w-full"
            value={companyDetails.addressLine1}
            onChange={handleCompanyDetailsChange}
          />
        </div>
        <div>
          <Label text="Address line 2" />
          <TextInput
            name="addressLine2"
            placeholder="Enter address line 2"
            className="w-full"
            value={companyDetails.addressLine2}
            onChange={handleCompanyDetailsChange}
          />
        </div>
        <div>
          <Label text="Address line 3" />
          <TextInput
            name="addressLine3"
            placeholder="Enter address line 3"
            className="w-full"
            value={companyDetails.addressLine3}
            onChange={handleCompanyDetailsChange}
          />
        </div>
        <div>
          <Label text="Town" />
          <TextInput
            name="town"
            placeholder="Enter town"
            className="w-full"
            value={companyDetails.town}
            onChange={handleCompanyDetailsChange}
          />
        </div>
        <div>
          <Label text="Postcode" />
          <TextInput
            name="postcode"
            placeholder="Enter postcode"
            className="w-full"
            value={companyDetails.postcode}
            onChange={handleCompanyDetailsChange}
          />
        </div>
        <div>
          <Label text="Country" />
          <Select
            name="country"
            placeholder="Select country"
            className="w-full"
            options={[{ text: 'United Kingdom', value: 'United Kingdom' }]}
            value={companyDetails.country}
            onChange={(value) => setCompanyDetails({ ...companyDetails, country: value.toString() })}
            isClearable={false}
          />
        </div>
        <div>
          <Label text="Company Email Address" />
          <TextInput
            name="email"
            placeholder="EnterCompany Email Addressr"
            className="w-full"
            value={companyDetails.email}
            onChange={handleCompanyDetailsChange}
          />
        </div>
        <div>
          <Label text="VAT Number" />
          <TextInput
            name="vatNumber"
            placeholder="Enter VAT Number"
            className="w-full"
            value={companyDetails.vatNumber}
            onChange={handleCompanyDetailsChange}
          />
        </div>
      </div>
      <div className="w-full flex gap-2  items-center justify-end mt-5">
        <Button text="Save" onClick={handleSaveCompanyDetails} className="w-32" />
        <Button text="Next" onClick={handleNextClick} className="w-32" disabled={!canProceedToNextStep} />
      </div>
    </div>
  );
};

export default CompanyDetailsForm;
