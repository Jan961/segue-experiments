import { Button, Select, TextInput } from 'components/core-ui-lib';
import PopupModal from 'components/core-ui-lib/PopupModal';
import { useCallback, useMemo, useState } from 'react';
import { ContractNewPersonModal } from './ContractNewPersonModal';
import { BuildNewContract } from './BuildNewContract';
import { transformToOptions } from 'utils';
import { useRecoilState, useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import { contractDepartmentOptions, contractTemplateOptions } from 'config/contracts';
import { personState } from 'state/contracts/PersonState';
import axios from 'axios';
import { objectify } from 'radash';
import { PersonMinimalDTO } from 'interfaces';
import { IContractSchedule } from '../types';

const defaultContractSchedule = {
  production: null,
  department: null,
  role: '',
  personId: null,
  templateId: null,
};

export const ContractScheduleModal = ({ openContract, onClose }: { openContract: boolean; onClose: () => void }) => {
  const { productions } = useRecoilValue(productionJumpState);
  const [personMap, setPersonMap] = useRecoilState(personState);
  const personOptions = useMemo(
    () =>
      transformToOptions(Object.values(personMap), null, 'id', ({ firstName, lastName }) => `${firstName} ${lastName}`),
    [personMap],
  );
  const productionOptions = useMemo(
    () =>
      transformToOptions(productions, null, 'Id', ({ ShowCode, Code, ShowName }) => `${ShowCode}${Code} ${ShowName}`),
    [productions],
  );
  const [openNewPersonContract, setOpenNewPersonContract] = useState(false);
  const [openNewBuildContract, setOpenNewBuildContract] = useState(false);
  const [contractSchedule, setContractSchedule] = useState<IContractSchedule>(defaultContractSchedule);
  const { production, department, role, personId, templateId } = contractSchedule;
  const handleChange = useCallback(
    (key: string, value: number | string | boolean | null) => {
      const updatedData = { ...contractSchedule, [key]: value };
      setContractSchedule(updatedData);
    },
    [contractSchedule, setContractSchedule],
  );
  const onCloseCreateNewPerson = useCallback(
    async (saveStatus = false) => {
      setOpenNewPersonContract(false);
      if (saveStatus) {
        const personsMinList: PersonMinimalDTO[] = await axios.get('/api/person/list');
        const idToPersonMap = objectify(
          personsMinList ?? [],
          (p) => p.id,
          (p) => p,
        );
        setPersonMap(idToPersonMap);
      }
    },
    [setOpenNewPersonContract, setPersonMap],
  );

  return (
    <PopupModal
      show={openContract}
      title="Contract Schedule"
      titleClass="text-xl text-primary-navy font-bold -mt-2"
      onClose={onClose}
    >
      <div className="w-[430px] h-auto">
        <Select
          label="Production"
          testId="cs-production-selector"
          value={production}
          options={productionOptions}
          onChange={(productionId) => handleChange('production', productionId as number)}
        />
        <div className="flex mt-4 mb-4 items-center">
          <div className=" text-primary-input-text mr-4">Person</div>
          <Select
            onChange={(value) => handleChange('personId', value as number)}
            className="bg-primary-white w-full"
            value={personId}
            disabled={!production}
            placeholder="Please select person"
            options={personOptions}
            isClearable
            isSearchable
          />
        </div>
        <div className="flex justify-end mr-2">
          <Button
            disabled={!production}
            className="w-33"
            variant="secondary"
            text="Add New Person"
            onClick={() => setOpenNewPersonContract(true)}
          />
        </div>
        <div className="flex items-center mt-4 w-full">
          <div className=" text-primary-input-text mr-4">Role</div>
          <TextInput
            disabled={!production}
            id="venueText"
            className="w-full ml-3"
            value={role}
            onChange={(event) => handleChange('role', event.target.value)}
          />
        </div>
        <div className="flex mt-4">
          <div className=" text-primary-input-text mr-4">Department</div>
          <Select
            disabled={!production}
            onChange={(value) => handleChange('department', value as number)}
            value={department}
            className="bg-primary-white"
            placeholder="Please select department"
            options={contractDepartmentOptions}
            isClearable
            isSearchable
          />
        </div>
        <div className="flex mt-4">
          <div className=" text-primary-input-text mr-4">Contract Template</div>
          <Select
            onChange={(value) => handleChange('templateId', value as number)}
            className="bg-primary-white mr-2"
            value={templateId}
            disabled={!production}
            placeholder="Please select a template"
            options={contractTemplateOptions}
            isClearable
            isSearchable
          />
        </div>
        <div className=" text-primary-input-text font-bold text-sm mr-1 mt-4 mb-4">
          Please contact sales@seguetheatre.com to arrange upload of Contract Templates
        </div>
        <div className="flex justify-end mr-2">
          <Button
            disabled={!production}
            className="text-sm leading-8"
            text="Start Building Contract"
            onClick={() => setOpenNewBuildContract(true)}
          />
        </div>
      </div>
      {openNewPersonContract && (
        <ContractNewPersonModal openNewPersonContract={openNewPersonContract} onClose={onCloseCreateNewPerson} />
      )}
      {openNewBuildContract && (
        <BuildNewContract
          contractSchedule={contractSchedule}
          openNewPersonContract={openNewBuildContract}
          onClose={() => setOpenNewBuildContract(false)}
        />
      )}
    </PopupModal>
  );
};
