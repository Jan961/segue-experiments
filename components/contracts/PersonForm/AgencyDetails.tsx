import { useCallback, useState } from 'react';
import { noop } from 'utils';
import { Select, TextInput } from 'components/core-ui-lib';
import { SelectOption } from 'components/core-ui-lib/Select/Select';

const defaultAgencyDetails = {
  firstName: '',
  lastName: '',
  email: '',
  landline: '',
  address1: '',
  address2: '',
  name: '',
  mobileNumber: '',
  website: '',
  town: '',
  postcode: '',
  country: null,
};

interface AgencyDetailsProps {
  onChange: (data: any) => void;
  countryOptionList: SelectOption[];
}

const AgencyDetails = ({ countryOptionList, onChange = noop }: AgencyDetailsProps) => {
  const [agencyDetails, setAgencyDetails] = useState(defaultAgencyDetails);
  const {
    firstName,
    lastName,
    email,
    landline,
    address1,
    address2,
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
      onChange(updatedData);
    },
    [onChange, setAgencyDetails, agencyDetails],
  );
  return (
    <div>
      {/* {agencyDetailsData.map((newPersonData) => {
        return (
          <>
            <AddNewPersonInput
              newPersonData={newPersonData}
              handleAddpersonData={(key, value) => handleChange(key, value)}
              newPersonForm={agencyDetails}
            />
          </>
        );
      })} */}
      <div>
        <div className="flex mt-2 items-center">
          <div className="w-1/2 flex items-center">
            <div className="text-primary-input-text font-bold mr-4 w-[11vw]">Agent First Name</div>
            <div className="w-[22vw] ml-4">
              <TextInput
                className="text-primary-input-text font-bold w-full"
                onChange={(event) => handleChange('firstName', event.target.value)}
                value={firstName}
              />
            </div>
          </div>
          <div className="w-1/2 flex items-center">
            <div className="text-primary-input-text font-bold mr-4 w-2/5">Email Address</div>
            <div className="w-[22vw] ml-4">
              <TextInput
                className="text-primary-input-text font-bold w-full"
                onChange={(event) => handleChange('email', event.target.value)}
                value={email}
              />
            </div>
          </div>
        </div>

        <div className="flex mt-2 items-center">
          <div className="w-1/2 flex items-center">
            <div className="text-primary-input-text font-bold mr-4 w-[11vw]">Agent Last Name</div>
            <div className="w-[22vw] ml-4">
              <TextInput
                className="text-primary-input-text font-bold w-full"
                onChange={(event) => handleChange('lastName', event.target.value)}
                value={lastName}
              />
            </div>
          </div>
          <div className="w-1/2 flex items-center">
            <div className="text-primary-input-text font-bold mr-4 w-2/5">Landline Number</div>
            <div className="w-[22vw] ml-4">
              <TextInput
                className="text-primary-input-text font-bold w-full"
                onChange={(event) => handleChange('landline', event.target.value)}
                value={landline}
              />
            </div>
          </div>
        </div>

        <div className="flex mt-2 items-center">
          <div className="w-1/2 flex items-center">
            <div className="text-primary-input-text font-bold mr-4 w-[11vw]">Address Line 1</div>
            <div className="w-[22vw] ml-4">
              <TextInput
                className="text-primary-input-text font-bold w-full"
                onChange={(event) => handleChange('address1', event.target.value)}
                value={address1}
              />
            </div>
          </div>
          <div className="w-1/2 flex items-center">
            <div className="text-primary-input-text font-bold mr-4 w-2/5">Address Line 2</div>
            <div className="w-[22vw] ml-4">
              <TextInput
                className="text-primary-input-text font-bold w-full"
                onChange={(event) => handleChange('address2', event.target.value)}
                value={address2}
              />
            </div>
          </div>
        </div>

        <div className="flex mt-2 items-center">
          <div className="w-1/2 flex items-center">
            <div className="text-primary-input-text font-bold mr-4 w-[11vw]">Agency Name</div>
            <div className="w-[22vw] ml-4">
              <TextInput
                className="text-primary-input-text font-bold w-full"
                onChange={(event) => handleChange('name', event.target.value)}
                value={name}
              />
            </div>
          </div>
          <div className="w-1/2 flex items-center">
            <div className="text-primary-input-text font-bold mr-4 w-2/5">Mobile Number</div>
            <div className="w-[22vw] ml-4">
              <TextInput
                className="text-primary-input-text font-bold w-full"
                onChange={(event) => handleChange('mobileNumber', event.target.value)}
                value={mobileNumber}
              />
            </div>
          </div>
        </div>

        <div className="flex mt-2 items-center">
          <div className="w-1/2 flex items-center">
            <div className="text-primary-input-text font-bold mr-4 w-[11vw]">Agency Website</div>
            <div className="w-[22vw] ml-4">
              <TextInput
                className="text-primary-input-text font-bold w-full"
                onChange={(event) => handleChange('website', event.target.value)}
                value={website}
              />
            </div>
          </div>
          <div className="w-1/2 flex items-center" />
        </div>

        <div className="flex mt-2 items-center">
          <div className="w-1/2 flex items-center">
            <div className="text-primary-input-text font-bold mr-4 w-[11vw]">Town</div>
            <div className="w-[22vw] ml-4">
              <TextInput
                onChange={(event) => handleChange('town', event.target.value)}
                className="bg-primary-white w-full"
                placeholder="Enter Town"
                value={town}
              />
            </div>
          </div>
          <div className="w-1/2 flex items-center">
            <div className="text-primary-input-text font-bold mr-4 w-2/5">Postcode</div>
            <div className="w-[22vw] ml-4">
              <TextInput
                className="text-primary-input-text font-bold w-full"
                onChange={(event) => handleChange('postcode', event.target.value)}
                value={postcode}
              />
            </div>
          </div>
        </div>

        <div className="flex mt-2 items-center">
          <div className="w-1/2 flex items-center">
            <div className="text-primary-input-text font-bold mr-4 w-[11vw]">Country</div>
            <div className="w-[22vw] ml-4">
              <Select
                onChange={(value) => handleChange('country', value as number)}
                className="bg-primary-white w-full"
                placeholder="Please select..."
                options={countryOptionList}
                isClearable
                isSearchable
                value={country}
              />
            </div>
          </div>
          <div className="w-1/2 flex items-center" />
        </div>
      </div>
    </div>
  );
};

export default AgencyDetails;
