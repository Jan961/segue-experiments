import Button from 'components/core-ui-lib/Button';
import Label from 'components/core-ui-lib/Label';
import TextInput from 'components/core-ui-lib/TextInput';
import React, { useMemo, useState } from 'react';
import { useWizard } from 'react-use-wizard';
import Select from 'components/core-ui-lib/Select';

export type Company = {
  companyName: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  town: string;
  country: string;
  postcode: string;
  emailAddress: string;
  password: string;
  vatNumber: string;
};

const DEFAULT_COMPANY_DETAILS = {
  companyName: '',
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  town: '',
  country: '',
  postcode: '',
  emailAddress: '',
  password: '',
  vatNumber: '',
};

interface CompanyDetailsFormProps {
  onSubmit: (data: Company) => void;
}
const CompanyDetailsForm = ({ onSubmit }: CompanyDetailsFormProps) => {
  const [companyDetails, setCompanyDetails] = useState<Company>(DEFAULT_COMPANY_DETAILS);

  const { previousStep, nextStep } = useWizard();

  const isValidEmail = useMemo(() => {
    return /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(companyDetails.emailAddress);
  }, [companyDetails.emailAddress]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyDetails({ ...companyDetails, [e.target.name]: e.target.value });
  };

  const handleNextClick = () => {
    onSubmit(companyDetails);
    nextStep();
  };

  return (
    <div className="mx-auto w-96">
      <div className="w-full flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center text-primary-input-text">Company Details</h1>
        <div>
          <Label text="Company" />
          <TextInput
            name="companyName"
            placeholder="Enter name of main company"
            className="w-full"
            value={companyDetails.companyName}
            onChange={handleValueChange}
          />
        </div>
        <div>
          <Label text="Address line 1" />
          <TextInput
            name="addressLine1"
            placeholder="Enter address line 1"
            className="w-full"
            value={companyDetails.addressLine1}
            onChange={handleValueChange}
          />
        </div>
        <div>
          <Label text="Address line 2" />
          <TextInput
            name="addressLine2"
            placeholder="Enter address line 2"
            className="w-full"
            value={companyDetails.addressLine2}
            onChange={handleValueChange}
          />
        </div>
        <div>
          <Label text="Address line 3" />
          <TextInput
            name="addressLine3"
            placeholder="Enter address line 3"
            className="w-full"
            value={companyDetails.addressLine3}
            onChange={handleValueChange}
          />
        </div>
        <div>
          <Label text="Town" />
          <TextInput
            name="town"
            placeholder="Enter town"
            className="w-full"
            value={companyDetails.town}
            onChange={handleValueChange}
          />
        </div>
        <div>
          <Label text="Postcode" />
          <TextInput
            name="postcode"
            placeholder="Enter postcode"
            className="w-full"
            value={companyDetails.postcode}
            onChange={handleValueChange}
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
            name="emailAddress"
            placeholder="EnterCompany Email Addressr"
            className="w-full"
            value={companyDetails.emailAddress}
            onChange={handleValueChange}
          />
        </div>
        <div>
          <Label text="VAT Number" />
          <TextInput
            name="vatNumber"
            placeholder="Enter VAT Number"
            className="w-full"
            value={companyDetails.vatNumber}
            onChange={handleValueChange}
          />
        </div>
      </div>
      <div className="w-full flex gap-2  items-center justify-end mt-5">
        <Button text="Back" variant="secondary" onClick={previousStep} className="w-32" />
        <Button text="Next" onClick={handleNextClick} className="w-32" disabled={!isValidEmail} />
      </div>
    </div>
  );
};

export default CompanyDetailsForm;
