import { useCallback, useState } from 'react';
import { noop } from 'utils';
import { Select, TextInput } from 'components/core-ui-lib';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { IAgencyDetails } from '../types';

export const defaultAgencyDetails = {
  hasAgent: false,
  firstName: null,
  lastName: null,
  email: null,
  landline: null,
  address1: null,
  address2: null,
  address3: null,
  name: null,
  mobileNumber: null,
  website: null,
  town: null,
  postcode: null,
  country: null,
  id: null,
};

interface AgencyDetailsProps {
  details?: Partial<IAgencyDetails>;
  disabled: boolean;
  onChange: (data: Partial<IAgencyDetails>) => void;
  countryOptionList: SelectOption[];
}

const AgencyDetails = ({ details, countryOptionList, onChange = noop, disabled = false }: AgencyDetailsProps) => {
  const [agencyDetails, setAgencyDetails] = useState<IAgencyDetails>({ ...defaultAgencyDetails, ...details });
  const {
    firstName,
    lastName,
    email,
    landline,
    address1,
    address2,
    address3,
    name,
    mobileNumber,
    website,
    town,
    postcode,
    country,
  } = agencyDetails;
  const handleChange = useCallback(
    (key: string, value: number | string | string[] | null) => {
      const updatedData = { ...agencyDetails, [key]: value };
      setAgencyDetails(updatedData);
      onChange({ ...details, [key]: value });
    },
    [onChange, setAgencyDetails, agencyDetails],
  );
  return (
    <>
      <div className="grid grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-start">
            <div className="text-primary-input-text font-bold w-44">Agent First Name</div>
            <div className="grow">
              <TextInput
                placeholder="Enter Agents First Name"
                testId="agency-contact-first-name"
                className="text-primary-input-text font-bold w-full max-w-96"
                onChange={(event) => handleChange('firstName', event.target.value)}
                value={firstName}
                disabled={disabled}
              />
            </div>
          </div>
          <div className="flex items-start">
            <div className="text-primary-input-text font-bold w-44">Agent Last Name</div>
            <div className="grow">
              <TextInput
                placeholder="Enter Agents Last Name"
                testId="agency-contact-last-name"
                className="text-primary-input-text font-bold w-full max-w-96"
                onChange={(event) => handleChange('lastName', event.target.value)}
                value={lastName}
                disabled={disabled}
              />
            </div>
          </div>
          <div className="flex items-start">
            <div className="text-primary-input-text font-bold w-44">Address Line 1</div>
            <div className="grow flex-col gap-4">
              <TextInput
                placeholder="Enter Address 1"
                testId="agency-contact-address-1"
                className="text-primary-input-text font-bold w-full max-w-96"
                onChange={(event) => handleChange('address1', event.target.value)}
                value={address1}
                disabled={disabled}
              />
              <TextInput
                placeholder="Enter Address 2"
                testId="agency-contact-address-2"
                className="text-primary-input-text font-bold w-full max-w-96 mt-2"
                onChange={(event) => handleChange('address2', event.target.value)}
                value={address2}
                disabled={disabled}
              />
              <TextInput
                placeholder="Enter Address 3"
                testId="agency-contact-address-2"
                className="text-primary-input-text font-bold w-full max-w-96 mt-2"
                onChange={(event) => handleChange('address3', event.target.value)}
                value={address3}
                disabled={disabled}
              />
            </div>
          </div>
          <div className="flex items-start">
            <div className="text-primary-input-text font-bold w-44">Agency Name</div>
            <div className="grow">
              <TextInput
                placeholder="Enter Agency Name"
                testId="agency-name"
                className="text-primary-input-text font-bold w-full max-w-96"
                onChange={(event) => handleChange('name', event.target.value)}
                value={name}
                disabled={disabled}
              />
            </div>
          </div>
          <div className="flex items-start">
            <div className="text-primary-input-text font-bold w-44">Town</div>
            <div className="grow">
              <TextInput
                placeholder="Enter Town"
                testId="agency-contact-town"
                onChange={(event) => handleChange('town', event.target.value)}
                className="text-primary-input-text font-bold w-full max-w-96"
                value={town}
                disabled={disabled}
              />
            </div>
          </div>
          <div className="flex items-start">
            <div className="text-primary-input-text font-bold w-44">Postcode</div>
            <div className="grow">
              <TextInput
                placeholder="Enter Postcode"
                testId="agency-contact-postcode"
                className="text-primary-input-text font-bold w-full max-w-96"
                onChange={(event) => handleChange('postcode', event.target.value)}
                value={postcode}
                disabled={disabled}
              />
            </div>
          </div>
          <div className="flex items-start">
            <div className="text-primary-input-text font-bold w-44">Country</div>
            <div className="grow">
              <Select
                testId="agency-contact-country"
                onChange={(value) => handleChange('country', value as number)}
                className="bg-primary-white w-full max-w-96"
                placeholder="Please Select Country"
                options={countryOptionList}
                isClearable
                isSearchable
                value={country}
                disabled={disabled}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-start">
            <div className="text-primary-input-text font-bold w-44">Email Address</div>
            <div className="grow">
              <TextInput
                placeholder="Enter Email Address"
                testId="agency-contact-email"
                className="text-primary-input-text font-bold w-full max-w-96"
                onChange={(event) => handleChange('email', event.target.value)}
                value={email}
                disabled={disabled}
              />
            </div>
          </div>
          <div className="flex items-start">
            <div className="text-primary-input-text font-bold w-44">Landline Number</div>
            <div className="grow">
              <TextInput
                placeholder="Enter Landline Number"
                testId="agency-contact-landline"
                className="text-primary-input-text font-bold w-full max-w-96"
                onChange={(event) => handleChange('landline', event.target.value)}
                value={landline}
                disabled={disabled}
              />
            </div>
          </div>
          <div className="flex items-start">
            <div className="text-primary-input-text font-bold w-44">Mobile Number</div>
            <div className="grow">
              <TextInput
                placeholder="Enter Mobile Number"
                testId="agency-contact-mobile-number"
                className="text-primary-input-text font-bold w-full max-w-96"
                onChange={(event) => handleChange('mobileNumber', event.target.value)}
                value={mobileNumber}
                disabled={disabled}
              />
            </div>
          </div>
          <div className="flex items-start">
            <div className="text-primary-input-text font-bold w-44">Agency Website</div>
            <div className="grow">
              <TextInput
                placeholder="Enter Agency Website"
                testId="agency-website"
                className="text-primary-input-text font-bold w-full max-w-96"
                onChange={(event) => handleChange('website', event.target.value)}
                value={website}
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgencyDetails;
