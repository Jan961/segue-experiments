import { Button, Select, TextInput, notify } from 'components/core-ui-lib';
import PopupModal from 'components/core-ui-lib/PopupModal';
import { useCallback, useMemo, useState } from 'react';
import { ContractNewPersonModal } from './ContractNewPersonModal';
import { BuildNewContract } from './edit-contract-modal/BuildNewContract';
import { transformToOptions } from 'utils';
import { useRecoilState, useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import { personState } from 'state/contracts/PersonState';
import axios from 'axios';
import { objectify } from 'radash';
import { ContractPermissionGroup, PersonMinimalDTO } from 'interfaces';
import { IContractSchedule } from '../contracts/types';
import { contractDepartmentState } from 'state/contracts/contractDepartmentState';
import { contractTemplateState } from 'state/contracts/contractTemplateState';

export const defaultContractSchedule = {
  production: null,
  department: null,
  role: '',
  personId: null,
  templateId: null,
};

export const ContractScheduleModal = ({
  openContract,
  onClose,
  accessNewPerson,
  accessPermissions,
}: {
  openContract: boolean;
  onClose: () => void;
  accessNewPerson: ContractPermissionGroup;
  accessPermissions: ContractPermissionGroup;
}) => {
  const { productions } = useRecoilValue(productionJumpState);
  const [personMap, setPersonMap] = useRecoilState(personState);
  const departmentMap = useRecoilValue(contractDepartmentState);
  const templateMap = useRecoilValue(contractTemplateState);

  const departmentOptions = useMemo(
    () => transformToOptions(Object.values(departmentMap), 'name', 'id'),
    [departmentMap],
  );
  const personOptions = useMemo(
    () =>
      transformToOptions(
        Object.values(personMap),
        null,
        'id',
        ({ firstName, lastName }) => `${firstName} ${lastName}`,
      ).sort((a, b) => a.text.localeCompare(b.text)),
    [personMap],
  );
  const productionOptions = useMemo(() => {
    const filteredProductions = productions.filter((production) => !production.IsArchived);

    return transformToOptions(
      filteredProductions,
      null,
      'Id',
      ({ ShowCode, Code, ShowName }) => `${ShowCode}${Code} ${ShowName}`,
    );
  }, [productions]);

  const templateOptions = useMemo(() => transformToOptions(Object.values(templateMap), 'name', 'id'), [templateMap]);

  const [openNewPersonContract, setOpenNewPersonContract] = useState<boolean>(false);
  const [openNewBuildContract, setOpenNewBuildContract] = useState<boolean>(false);
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
        const response = await axios.get('/api/person/list');
        const idToPersonMap = objectify(
          response.data ?? [],
          (p: PersonMinimalDTO) => p.id,
          (p) => p,
        );
        setPersonMap(idToPersonMap);
      }
    },
    [setOpenNewPersonContract, setPersonMap],
  );

  const getDepartmentOptions = useMemo(() => {
    return departmentOptions.filter(
      (x) =>
        (x.value === 1 && accessPermissions.artisteContracts) ||
        (x.value === 2 && accessPermissions.creativeContracts) ||
        (x.value === 3 && accessPermissions.smTechCrewContracts),
    );
  }, [accessPermissions]);

  const onOpenBuildContract = useCallback(() => {
    if (production && department && role && personId && templateId) {
      setOpenNewBuildContract(true);
    } else {
      notify.error('Please complete all the fields');
    }
  }, [production, department, role, personId, templateId, setOpenNewBuildContract]);

  const isNewPersonDisabled = () => {
    return !(
      accessNewPerson.artisteContracts ||
      accessNewPerson.creativeContracts ||
      accessNewPerson.smTechCrewContracts
    );
  };

  return (
    <PopupModal
      show={openContract}
      title="Contract Schedule"
      titleClass="text-xl text-primary-navy font-bold -mt-2"
      onClose={onClose}
      hasOverlay={openNewPersonContract || openNewBuildContract}
    >
      <div className="w-[430px] h-auto">
        <Select
          label="Production"
          testId="cs-production-selector"
          value={production}
          options={productionOptions}
          placeholder="Please select a Production"
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
            disabled={!production || isNewPersonDisabled()}
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
            options={getDepartmentOptions}
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
            options={templateOptions}
            isClearable
            isSearchable
          />
        </div>
        <div className=" text-primary-input-text font-bold text-sm mr-1 mt-4 mb-4">
          Please contact sales@segue360.co.uk to arrange upload of Contract Templates
        </div>
        <div className="flex justify-end mr-2">
          <Button
            disabled={!production}
            className="text-sm leading-8 px-6"
            text="Start Building Contract"
            onClick={onOpenBuildContract}
          />
        </div>
      </div>
      {openNewPersonContract && (
        <ContractNewPersonModal
          permissions={accessNewPerson}
          openNewPersonContract={openNewPersonContract}
          onClose={onCloseCreateNewPerson}
        />
      )}
      {openNewBuildContract && (
        <BuildNewContract
          contractSchedule={contractSchedule}
          visible={openNewBuildContract}
          onClose={() => {
            setOpenNewBuildContract(false);
            onClose?.();
          }}
          editPerson={accessNewPerson}
        />
      )}
    </PopupModal>
  );
};
