import { useCallback, useState } from 'react';
import { DateInput, Icon, Select, TextInput } from 'components/core-ui-lib';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { CustomOption } from 'components/core-ui-lib/Table/renderers/SelectCellRenderer';
import { workTypeOptions } from 'config/contracts';
import { insertAtPos, removeAtPos, replaceAtPos } from 'utils';
import { IOtherWorkType, IPersonDetails } from '../types';

export const defaultPersonDetails = {
  firstName: '',
  lastName: '',
  email: '',
  landline: '',
  address1: '',
  address2: '',
  address3: '',
  town: '',
  mobileNumber: '',
  passportName: '',
  passportNumber: '',
  hasUKWorkPermit: false,
  passportExpiryDate: null,
  postcode: '',
  checkedBy: null,
  country: null,
  isFEURequired: false,
  workType: [],
  advisoryNotes: '',
  generalNotes: '',
  healthDetails: '',
  otherWorkTypes: [{ name: '' }],
  notes: '',
};

interface PersonalDetailsProps {
  countryOptionList: SelectOption[];
  booleanOptions: SelectOption[];
  userOptionList: SelectOption[];
  details: Partial<IPersonDetails>;
  onChange: (data: Partial<IPersonDetails>) => void;
}

const PersonalDetails = ({
  countryOptionList,
  booleanOptions,
  userOptionList,
  details = {},
  onChange,
}: PersonalDetailsProps) => {
  const [formData, setFormData] = useState<IPersonDetails>({ ...defaultPersonDetails, ...details });
  const {
    firstName,
    lastName,
    email,
    landline,
    address1,
    address2,
    address3,
    mobileNumber,
    town,
    passportName,
    passportNumber,
    passportExpiryDate,
    postcode,
    checkedBy,
    country,
    isFEURequired,
    workType,
    hasUKWorkPermit,
    advisoryNotes,
    generalNotes,
    healthDetails,
    otherWorkTypes=[{ name: '' }],
    notes,
  } = formData;
  const handleChange = useCallback(
    (key: string, value: number | string | string[] | number[] | IOtherWorkType[] | null) => {
      const updatedData = { ...formData, [key]: value };
      setFormData(updatedData);
      onChange({ ...details, [key]: value });
    },
    [onChange, setFormData, formData, details],
  );
  return (
    <>
      <div className="grid grid-cols-2 gap-x-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <div className="text-primary-input-text font-bold w-40">First Name</div>
            <div className="grow">
              <TextInput
                testId="person-first-name"
                placeholder="Enter First Name"
                className="text-primary-input-text font-bold w-full max-w-96"
                onChange={(event) => handleChange('firstName', event.target.value)}
                value={firstName}
              />
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-primary-input-text font-bold w-40">Last Name</div>
            <div className="grow">
              <TextInput
                testId="person-last-name"
                placeholder="Enter last Name"
                className="text-primary-input-text font-bold w-full max-w-96"
                onChange={(event) => handleChange('lastName', event.target.value)}
                value={lastName}
              />
            </div>
          </div>
          <div className="flex items-start">
            <div className="text-primary-input-text font-bold w-40">Address</div>
            <div className="grow">
              <TextInput
                testId="person-address-1"
                placeholder="Enter Address 1"
                className="text-primary-input-text font-bold w-full max-w-96"
                onChange={(event) => handleChange('address1', event.target.value)}
                value={address1}
              />
              <TextInput
                testId="person-address-2"
                placeholder="Enter Address 2"
                className="text-primary-input-text font-bold w-full mt-2 max-w-96"
                onChange={(event) => handleChange('address2', event.target.value)}
                value={address2}
              />
              <TextInput
                testId="person-address-3"
                placeholder="Enter Address 3"
                className="text-primary-input-text font-bold w-full mt-2 max-w-96"
                onChange={(event) => handleChange('address3', event.target.value)}
                value={address3}
              />
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-primary-input-text font-bold w-40">Town</div>
            <div className="grow">
              <TextInput
                testId="person-town"
                placeholder="Enter Town"
                className=" text-primary-input-text font-bold w-full max-w-96"
                onChange={(event) => handleChange('town', event.target.value)}
                value={town}
              />
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-primary-input-text font-bold w-40">Postcode</div>
            <div className="grow">
              <TextInput
                testId="person-postcode"
                placeholder="Enter Postcode"
                className=" text-primary-input-text font-bold w-full max-w-96"
                onChange={(event) => handleChange('postcode', event.target.value)}
                value={postcode}
              />
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-primary-input-text font-bold w-40">Country</div>
            <div className="grow">
              <Select
                testId="person-country"
                onChange={(value) => handleChange('country', value as number)}
                className="bg-primary-white w-26 mr-3 max-w-96"
                placeholder="Please select.."
                options={countryOptionList}
                value={country}
                isClearable
                isSearchable
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-4">
            <div className="text-primary-input-text font-bold w-44">Email Address</div>
            <div className="grow">
              <TextInput
                testId="person-email"
                placeholder="Enter Email Address"
                className="text-primary-input-text font-bold w-full max-w-96"
                onChange={(event) => handleChange('email', event.target.value)}
                value={email}
              />
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="text-primary-input-text font-bold w-44">Landline Number</div>
            <div className="grow">
              <TextInput
                testId="person-landline"
                placeholder="Enter Landline Number"
                className="text-primary-input-text font-bold w-full max-w-96"
                onChange={(event) => handleChange('landline', event.target.value)}
                value={landline}
              />
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="text-primary-input-text font-bold w-44">Mobile Number</div>
            <div className="grow">
              <TextInput
                testId="person-mobile-number"
                placeholder="Enter Mobile Number"
                className="text-primary-input-text font-bold w-full max-w-96"
                onChange={(event) => handleChange('mobileNumber', event.target.value)}
                value={mobileNumber}
              />
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="text-primary-input-text font-bold w-44">Full Name as it appears on Passport</div>
            <div className="max-w-96">
              <TextInput
                testId="person-passport-name"
                placeholder="Enter Name on Passport"
                className="text-primary-input-text font-bold w-full max-w-96"
                onChange={(event) => handleChange('passportName', event.target.value)}
                value={passportName}
              />
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="text-primary-input-text font-bold w-44">Passport Number</div>
            <div className="max-w-96">
              <TextInput
                testId="person-passport-number"
                placeholder="Enter Passport Number"
                className="text-primary-input-text font-bold w-full max-w-96"
                onChange={(event) => handleChange('passportNumber', event.target.value)}
                value={passportNumber}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-primary-input-text font-bold w-44">Passport Expiry Date</div>
            <div className="max-w-96 flex items-center">
              <DateInput
                testId="person-passport-expiry-date"
                onChange={(value) => handleChange('passportExpiryDate', value?.toISOString?.() || '')}
                value={passportExpiryDate}
              />
              <div className="text-xs text-primary-input-text font-bold ml-4">
                (<span className="underline">NOTE:</span> Expiry date is 10 years from{' '}
                <span className="text-red-500 underline">PASSPORT ISSUE DATE</span>)
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-primary-input-text font-bold w-44">Eligible to Work in the UK</div>
            <div className="max-w-96  flex items-center">
              <Select
                testId="person-uk-work-eligibility"
                onChange={(value) => handleChange('hasUKWorkPermit', value as string)}
                value={hasUKWorkPermit}
                className="bg-primary-white w-40"
                placeholder="YES/NO"
                options={booleanOptions}
                isClearable
                isSearchable
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-primary-input-text font-bold  w-44">Checked</div>
            <div className="max-w-96 grow flex items-center">
              <Select
                testId="person-checked-by"
                onChange={(value) => handleChange('checkedBy', value as number)}
                value={checkedBy}
                className="bg-primary-white w-full"
                placeholder="Please select..."
                options={userOptionList}
                isClearable
                isSearchable
              />
            </div>
          </div>
          <div className="flex items-center gap-4 justify-between w-full">
            <div className="text-primary-input-text font-bold ">
              Is FEU (Foreign Entertainer Union) permission required
            </div>
            <div className="grow float-right">
              <Select
                testId="person-is-feu-required"
                onChange={(value) => handleChange('isFEURequired', value as string)}
                value={isFEURequired}
                className="bg-primary-white w-40 mr-3 max-w-96"
                placeholder="YES/NO"
                options={booleanOptions}
                isClearable
                isSearchable
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center my-2">
        <div className="w-40  text-primary-input-text font-bold">General Notes</div>
        <div className="grow">
          <TextInput
            testId="person-general-notes"
            className="w-full text-primary-input-text font-bold max-w-96"
            placeholder="Notes"
            onChange={(event) => handleChange('generalNotes', event.target.value)}
            value={generalNotes}
          />
        </div>
      </div>
      <div className="flex items-center mb-2">
        <div className="w-40  text-primary-input-text font-bold">Relevant Health Details</div>
        <div className="grow">
          <TextInput
            testId="person-health-details"
            className="w-full text-primary-input-text font-bold max-w-96"
            placeholder="Notes"
            onChange={(event) => handleChange('healthDetails', event.target.value)}
            value={healthDetails}
          />
        </div>
      </div>

      <div className="flex items-center mb-2">
        <div className="w-40  text-primary-input-text font-bold">Advisory Notes</div>
        <div className="grow">
          <TextInput
            testId="person-advisory-notes"
            className="w-full text-primary-input-text font-bold max-w-96"
            placeholder="Notes"
            onChange={(event) => handleChange('advisoryNotes', event.target.value)}
            value={advisoryNotes}
          />
        </div>
      </div>
      <div className="w-1/2 flex mt-2 items-center">
        <div className=" grow flex items-start">
          <div className="text-primary-input-text font-bold w-40">Type of Work</div>
          <div className="grow flex flex-col gap-4">
            <Select
              testId="person-roles"
              onChange={(value) => handleChange('workType', value as number[])}
              value={workType}
              className="bg-primary-white w-full max-w-96"
              placeholder="Please select.."
              options={workTypeOptions}
              renderOption={(option) => <CustomOption option={option} isMulti={true} />}
              isMulti
              isClearable
              isSearchable
            />
            {otherWorkTypes.map((otherWorkType: IOtherWorkType, i) => (
              <div key={i} className="flex items-center gap-2 w-full">
                <TextInput
                  key={i}
                  testId={`person-other-role-${i + 1}`}
                  className="text-primary-input-text font-bold w-full max-w-96"
                  onChange={(event) =>
                    handleChange(
                      'otherWorkTypes',
                      replaceAtPos(
                        otherWorkTypes,
                        { ...otherWorkType, name: event.target.value },
                        i,
                      ) as IOtherWorkType[],
                    )
                  }
                  placeholder="Other Type of Work"
                  value={otherWorkType.name}
                />
                {i === 0 && (
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      handleChange(
                        'otherWorkTypes',
                        insertAtPos(otherWorkTypes, { name: '' }, i + 1) as IOtherWorkType[],
                      )
                    }
                  >
                    <Icon iconName="plus-circle-solid" />
                  </div>
                )}
                {i > 0 && (
                  <div
                    className="cursor-pointer"
                    onClick={() => handleChange('otherWorkTypes', removeAtPos(otherWorkTypes, i) as string[])}
                  >
                    <Icon iconName="minus-circle-solid" />
                  </div>
                )}
              </div>
            ))}

            <TextInput
              testId="person-notes"
              className=" text-primary-input-text font-bold w-full max-w-96"
              onChange={(event) => handleChange('notes', event.target.value)}
              value={notes}
              placeholder="Notes Field"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalDetails;
