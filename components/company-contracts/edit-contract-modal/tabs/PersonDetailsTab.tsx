import { useCallback, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { booleanOptions } from 'config/contracts';
import { countryState } from 'state/global/countryState';
import { transformToOptions } from 'utils';
import { userState } from 'state/account/userState';
import { Checkbox } from 'components/core-ui-lib';
import AgencyDetails, { defaultAgencyDetails } from '../../../contracts/PersonForm/AgencyDetails';
import PersonalDetails, { defaultPersonDetails } from '../../../contracts/PersonForm/PersonalDetails';
import AccountDetailsForm, { defaultBankAccount } from '../../../contracts/PersonForm/AccountDetailsForm';
import EmergencyContact, { defaultEmergencyContactData } from '../../../contracts/PersonForm/EmergencyContact';
import { IPerson } from '../../../contracts/types';

const defaultContractDetails = {
  personDetails: defaultPersonDetails,
  emergencyContact1: defaultEmergencyContactData,
  emergencyContact2: defaultEmergencyContactData,
  agencyDetails: defaultAgencyDetails,
  salaryAccountDetails: defaultBankAccount,
  expenseAccountDetails: defaultBankAccount,
};

interface ContractPersonDataFormProps {
  person?: Partial<IPerson>;
  height: string;
  updateFormData: (data: Partial<IPerson>) => void;
}

const mergeContractData = (contractDetailsD, contractDetailsV) => {
  const {
    personDetails: personDetailsD,
    emergencyContact1: emergencyContact1D,
    emergencyContact2: emergencyContact2D,
    agencyDetails: agencyDetailsD,
    salaryAccountDetails: salaryAccountDetailsD,
    expenseAccountDetails: expenseAccountDetailsD,
  } = contractDetailsD;

  const {
    personDetails: personDetailsV,
    emergencyContact1: emergencyContact1V,
    emergencyContact2: emergencyContact2V,
    agencyDetails: agencyDetailsV,
    salaryAccountDetails: salaryAccountDetailsV,
    expenseAccountDetails: expenseAccountDetailsV,
  } = contractDetailsV;

  return {
    personDetails: { ...personDetailsD, ...personDetailsV },
    emergencyContact1: { ...emergencyContact1D, ...emergencyContact1V },
    emergencyContact2: { ...emergencyContact2D, ...emergencyContact2V },
    agencyDetails: { ...agencyDetailsD, ...agencyDetailsV },
    salaryAccountDetails: { ...salaryAccountDetailsD, ...salaryAccountDetailsV },
    expenseAccountDetails: { ...expenseAccountDetailsD, ...expenseAccountDetailsV },
  };
};

export const PersonDetailsTab = ({ person = {}, height, updateFormData }: ContractPersonDataFormProps) => {
  const [personData, setPersonData] = useState<IPerson>(mergeContractData(defaultContractDetails, person));
  const {
    personDetails,
    emergencyContact1,
    emergencyContact2,
    agencyDetails,
    salaryAccountDetails,
    expenseAccountDetails,
  } = personData;
  const [hideAgencyDetails, setHideAgencyDetails] = useState(!agencyDetails?.id && true);
  const countryList = useRecoilValue(countryState) || [];
  const { users = [] } = useRecoilValue(userState);
  const userOptionList = useMemo(
    () =>
      transformToOptions(
        Object.values(users),
        null,
        'AccUserId',
        ({ FirstName = '', LastName = '', Email = '' }) => `${FirstName || ''} ${LastName || ''} | ${Email || ''}`,
      ),
    [users],
  );
  const countryOptionList = useMemo(() => transformToOptions(countryList, 'Name', 'Id'), [countryList]);

  const onChange = useCallback(
    (key: string, data: any) => {
      const updatedFormData = {
        ...personData,
        [key]: data,
      };
      setPersonData(updatedFormData);
      updateFormData?.(updatedFormData);
    },
    [personData, updateFormData, setPersonData],
  );

  return (
    <>
      <div className={`${height} w-full`}>
        <div className="text-xl text-primary-navy font-bold mb-3">Person Details</div>
        <PersonalDetails
          details={personDetails}
          countryOptionList={countryOptionList}
          booleanOptions={booleanOptions}
          userOptionList={userOptionList}
          onChange={(data) => onChange('personDetails', data)}
        />
        <div className="grid grid-cols-2 mt-10 gap-x-4">
          <div>
            <h3 className="text-xl text-primary-navy font-bold mb-3">Emergency Contact 1</h3>
            <EmergencyContact
              emergencyContact={emergencyContact1}
              countryOptionList={countryOptionList}
              onChange={(data) => onChange('emergencyContact1', data)}
            />
          </div>
          <div>
            <h3 className="text-xl text-primary-navy font-bold mb-3">Emergency Contact 2</h3>
            <EmergencyContact
              emergencyContact={emergencyContact2}
              countryOptionList={countryOptionList}
              onChange={(data) => onChange('emergencyContact2', data)}
            />
          </div>
        </div>
        <div className="flex gap-4 mt-8 mb-3">
          <h3 className="text-xl text-primary-navy font-bold">Agency Details</h3>
          <Checkbox
            id="toggle-agency-details"
            testId="toggle-agency-details"
            label="N/A"
            checked={hideAgencyDetails}
            onChange={(e) => {
              setHideAgencyDetails(e.target.checked);
              const updatedFormData = {
                ...personData,
                agencyDetails: {
                  ...personData.agencyDetails,
                  hasAgent: !e.target.checked,
                },
              };
              setPersonData(updatedFormData);
              updateFormData?.(updatedFormData);
            }}
          />
        </div>
        <AgencyDetails
          details={agencyDetails}
          disabled={hideAgencyDetails}
          countryOptionList={countryOptionList}
          onChange={(data) => onChange('agencyDetails', data)}
        />
        <h3 className="text-xl text-primary-navy font-bold mt-10">Salary Details</h3>
        <div className="grid grid-cols-2 gap-x-4 my-8">
          <div>
            <h3 className="text-base text-primary-navy font-bold mb-3">Salary</h3>
            <AccountDetailsForm
              details={salaryAccountDetails}
              accountType="Salary"
              countryOptionList={countryOptionList}
              onChange={(data) => onChange('salaryAccountDetails', data)}
            />
          </div>
          <div>
            <h3 className="text-base text-primary-navy font-bold mb-3">Expenses</h3>
            <AccountDetailsForm
              details={expenseAccountDetails}
              accountType="Expenses"
              countryOptionList={countryOptionList}
              onChange={(data) => onChange('expenseAccountDetails', data)}
            />
          </div>
        </div>
      </div>
    </>
  );
};
