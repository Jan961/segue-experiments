import { useCallback, useState } from 'react';
import { Select, TextInput, Tooltip, Icon } from 'components/core-ui-lib';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { EmergencyContact } from '../types';

export const defaultEmergencyContactData = {
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

interface Props {
  emergencyContact?: Partial<EmergencyContact>;
  countryOptionList: SelectOption[];
  onChange: (data: Partial<EmergencyContact>) => void;
}

const EmergencyContactForm = ({ emergencyContact = {}, countryOptionList = [], onChange }: Props) => {
  const [contact, setContact] = useState<EmergencyContact>({ ...defaultEmergencyContactData, ...emergencyContact });
  const { firstName, lastName, email, mobileNumber, landline, address1, address2, address3, town, postcode, country } =
    contact;
  const handleChange = useCallback(
    (key: string, value: number | string | null) => {
      const updatedData = { ...contact, [key]: value };
      setContact(updatedData);
      onChange({ ...emergencyContact, [key]: value });
    },
    [onChange, setContact, contact],
  );
  const countryTooltipText =
    'For addresses in the United Kingdom, please select Scotland, England, Wales or Northern Ireland';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold w-44">First Name</div>
        <div className="grow">
          <TextInput
            testId="emergency-contact-first-name"
            placeholder="Enter First Name"
            className=" text-primary-input-text font-bold w-full max-w-96"
            onChange={(e) => handleChange('firstName', e.target.value)}
            value={firstName}
          />
        </div>
      </div>
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold w-44">Last Name</div>
        <div className="grow">
          <TextInput
            testId="emergency-contact-last-name"
            placeholder="Enter Last Name"
            className=" text-primary-input-text font-bold w-full max-w-96"
            onChange={(e) => handleChange('lastName', e.target.value)}
            value={lastName}
          />
        </div>
      </div>
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold w-44">Address</div>
        <div className="grow flex flex-col gap-2">
          <TextInput
            testId="emergency-contact-address-1"
            placeholder="Enter Address 1"
            className=" text-primary-input-text font-bold w-full max-w-96"
            onChange={(e) => handleChange('address1', e.target.value)}
            value={address1}
          />
          <TextInput
            testId="emergency-contact-address-2"
            placeholder="Enter Address 2"
            className=" text-primary-input-text font-bold w-full max-w-96"
            onChange={(e) => handleChange('address2', e.target.value)}
            value={address2}
          />
          <TextInput
            testId="emergency-contact-address-3"
            placeholder="Enter Address 3"
            className=" text-primary-input-text font-bold w-full max-w-96"
            onChange={(e) => handleChange('address3', e.target.value)}
            value={address3}
          />
        </div>
      </div>
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold w-44">Town</div>
        <div className="grow">
          <TextInput
            testId="emergency-contact-town"
            placeholder="Enter Town"
            className=" text-primary-input-text font-bold w-full max-w-96"
            onChange={(e) => handleChange('town', e.target.value)}
            value={town}
          />
        </div>
      </div>
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold w-44">Postcode</div>
        <div className="grow">
          <TextInput
            testId="emergency-contact-postcode"
            placeholder="Enter Postcode"
            className=" text-primary-input-text font-bold w-full max-w-96"
            onChange={(e) => handleChange('postcode', e.target.value)}
            value={postcode}
          />
        </div>
      </div>
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold w-44">Email Address</div>
        <div className="grow">
          <TextInput
            testId="emergency-contact-email"
            placeholder="Enter Email Address"
            className=" text-primary-input-text font-bold w-full max-w-96"
            onChange={(e) => handleChange('email', e.target.value)}
            value={email}
          />
        </div>
      </div>
      <div className="flex items-center ">
        <div className="flex items-center gap-2 text-primary-input-text font-bold w-44">
          <span>Country</span>
          <Tooltip body={countryTooltipText} position="left" width="w-[140px]" bgColorClass="primary-input-text">
            <Icon iconName="info-circle-solid" variant="xs" />
          </Tooltip>
        </div>
        <div className="grow">
          <Select
            testId="emergency-contact-country"
            placeholder="Select Country"
            className=" text-primary-input-text font-bold w-full max-w-96"
            onChange={(value) => handleChange('country', value as number)}
            options={countryOptionList}
            value={country}
            isSearchable
            isClearable
          />
        </div>
      </div>
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold w-44">Landline Number</div>
        <div className="grow">
          <TextInput
            testId="emergency-contact-landline"
            placeholder="Enter Landline Number"
            className=" text-primary-input-text font-bold w-full max-w-96"
            onChange={(e) => handleChange('landline', e.target.value)}
            value={landline}
          />
        </div>
      </div>
      <div className="flex items-start">
        <div className="text-primary-input-text font-bold w-44">Mobile Number</div>
        <div className="grow">
          <TextInput
            testId="emergency-contact-mobile-number"
            placeholder="Enter Mobile Number"
            className=" text-primary-input-text font-bold w-full max-w-96"
            onChange={(e) => handleChange('mobileNumber', e.target.value)}
            value={mobileNumber}
          />
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactForm;
