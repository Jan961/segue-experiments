import { booleanOptions } from 'config/contracts';
import { useCallback, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { countryState } from 'state/global/countryState';
import { transformToOptions } from 'utils';
import EmergencyContact from './PersonForm/EmergencyContact';
import AccountDetailsForm from './PersonForm/AccountDetailsForm';
import PersonalDetails from './PersonForm/PersonalDetails';
import AgencyDetails from './PersonForm/AgencyDetails';
import { userState } from 'state/account/userState';

interface ContractPersonDataFormProps {
  height: string;
  updateFormData: (data: any) => void;
}

export const ContractPersonDataForm = ({ height, updateFormData }: ContractPersonDataFormProps) => {
  const [personData, setPersonData] = useState({});
  const countryList = useRecoilValue(countryState) || [];
  const { users = [] } = useRecoilValue(userState);
  const userOptionList = useMemo(
    () =>
      transformToOptions(
        Object.values(users),
        null,
        'Id',
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
      <div className={`${height} w-[82vw] overflow-y-scroll`}>
        <div className="text-xl text-primary-navy font-bold mb-3">Person Details</div>
        <PersonalDetails
          countryOptionList={countryOptionList}
          booleanOptions={booleanOptions}
          userOptionList={userOptionList}
          onChange={(data) => onChange('personDetails', data)}
        />
        <div className="grid grid-cols-2 mt-10">
          <div>
            <h3 className="text-xl text-primary-navy font-bold mb-3">Emergency Contact 1</h3>
            <EmergencyContact
              countryOptionList={countryOptionList}
              onChange={(data) => onChange('emergencyContact1', data)}
            />
          </div>
          <div>
            <h3 className="text-xl text-primary-navy font-bold mb-3">Emergency Contact 2</h3>
            <EmergencyContact
              countryOptionList={countryOptionList}
              onChange={(data) => onChange('emergencyContact2', data)}
            />
          </div>
        </div>
        <div className="mt-8">
          <div className="text-xl text-primary-navy font-bold mb-3">Agency Details</div>
          <AgencyDetails countryOptionList={countryOptionList} onChange={(data) => onChange('agencyDetails', data)} />
        </div>
        <div className="mt-10">
          <div className="text-xl text-primary-navy font-bold">Salary Details</div>
          <div className="grid grid-cols-2 mt-8">
            <div>
              <h3 className="text-lg text-primary-navy font-bold mb-3">Salary</h3>
              <AccountDetailsForm
                accountType="Salary"
                countryOptionList={countryOptionList}
                onChange={(data) => onChange('salaryAccountDetails', data)}
              />
            </div>
            <div>
              <h3 className="text-lg text-primary-navy font-bold mb-3">Expenses</h3>
              <AccountDetailsForm
                accountType="Expenses"
                countryOptionList={countryOptionList}
                onChange={(data) => onChange('expenseAccountDetails', data)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
