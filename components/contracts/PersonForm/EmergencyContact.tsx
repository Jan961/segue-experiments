import { useCallback, useState } from 'react';
import { Select, TextInput } from 'components/core-ui-lib';
import { SelectOption } from 'components/core-ui-lib/Select/Select';

const defaultEmergencyContactData = {
  firstName: '',
  lastName: '',
  address1: '',
  address2: '',
  address3: '',
  postcode: '',
  town: '',
  country: null,
  email: '',
  landline: '',
  mobileNumber: '',
};

interface EmergencyContact {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  address3?: string;
  town: string;
  postcode: string;
  country: number | null;
  email: string;
  landline: string;
  mobileNumber: string;
}

interface Props {
  countryOptionList: SelectOption[];
  onChange: (data: EmergencyContact) => void;
}

const EmergencyContactForm = ({ countryOptionList = [], onChange }: Props) => {
  const [contact, setContact] = useState<EmergencyContact>(defaultEmergencyContactData);
  const { firstName, lastName, email, mobileNumber, landline, address1, address2, address3, town, postcode, country } =
    contact;
  const handleChange = useCallback(
    (key: string, value: number | string | null) => {
      const updatedData = { ...contact, [key]: value };
      setContact(updatedData);
      onChange(updatedData);
    },
    [onChange, setContact, contact],
  );
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold mr-4 w-[11vw]">First Name</div>
        <div className="w-[22vw] ml-4">
          <TextInput
            placeholder="Enter First Name"
            className=" text-primary-input-text font-bold w-full"
            onChange={(e) => handleChange('firstName', e.target.value)}
            value={firstName}
          />
        </div>
      </div>
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold mr-4 w-[11vw]">Last Name</div>
        <div className="w-[22vw] ml-4">
          <TextInput
            placeholder="Enter Last Name"
            className=" text-primary-input-text font-bold w-full"
            onChange={(e) => handleChange('lastName', e.target.value)}
            value={lastName}
          />
        </div>
      </div>
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold mr-4 w-[11vw]">Address</div>
        <div className="w-[22vw] ml-4 flex flex-col gap-2">
          <TextInput
            placeholder="Enter Address 1"
            className=" text-primary-input-text font-bold w-full"
            onChange={(e) => handleChange('address1', e.target.value)}
            value={address1}
          />
          <TextInput
            placeholder="Enter Address 2"
            className=" text-primary-input-text font-bold w-full"
            onChange={(e) => handleChange('address2', e.target.value)}
            value={address2}
          />
          <TextInput
            placeholder="Enter Address 3"
            className=" text-primary-input-text font-bold w-full"
            onChange={(e) => handleChange('address3', e.target.value)}
            value={address3}
          />
        </div>
      </div>
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold mr-4 w-[11vw]">Town</div>
        <div className="w-[22vw] ml-4">
          <TextInput
            placeholder="Enter Town"
            className=" text-primary-input-text font-bold w-full"
            onChange={(e) => handleChange('town', e.target.value)}
            value={town}
          />
        </div>
      </div>
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold mr-4 w-[11vw]">Postcode</div>
        <div className="w-[22vw] ml-4">
          <TextInput
            placeholder="Enter Postcode"
            className=" text-primary-input-text font-bold w-full"
            onChange={(e) => handleChange('postcode', e.target.value)}
            value={postcode}
          />
        </div>
      </div>
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold mr-4 w-[11vw]">Email Address</div>
        <div className="w-[22vw] ml-4">
          <TextInput
            placeholder="Enter Email Address"
            className=" text-primary-input-text font-bold w-full"
            onChange={(e) => handleChange('email', e.target.value)}
            value={email}
          />
        </div>
      </div>
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold mr-4 w-[11vw]">Country</div>
        <div className="w-[22vw] ml-4">
          <Select
            placeholder="Select Country"
            className=" text-primary-input-text font-bold w-full"
            onChange={(value) => handleChange('country', value as number)}
            options={countryOptionList}
            value={country}
          />
        </div>
      </div>
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold mr-4 w-[11vw]">Landline Number</div>
        <div className="w-[22vw] ml-4">
          <TextInput
            placeholder="Enter Landline Number"
            className=" text-primary-input-text font-bold w-full"
            onChange={(e) => handleChange('landline', e.target.value)}
            value={landline}
          />
        </div>
      </div>
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold mr-4 w-[11vw]">Mobile Number</div>
        <div className="w-[22vw] ml-4">
          <TextInput
            placeholder="Enter Mobile Number"
            className=" text-primary-input-text font-bold w-full"
            onChange={(e) => handleChange('mobileNumber', e.target.value)}
            value={mobileNumber}
          />
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactForm;
