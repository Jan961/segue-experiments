import { useMemo, useState } from 'react';
import Button from 'components/core-ui-lib/Button';
import GlobalToolbar from 'components/toolbar';
import Select from 'components/core-ui-lib/Select';
import ContractsDateFilter from '../contracts/ContractsDateFilter';
import TextInput from 'components/core-ui-lib/TextInput';
import { useRecoilState, useRecoilValue } from 'recoil';
import { contractsFilterState, intialContractsFilterState } from 'state/contracts/contractsFilterState';
import { companyContractStatusOptions, contractDepartmentOptions } from 'config/contracts';
import { productionJumpState } from 'state/booking/productionJumpState';
import { ContractScheduleModal } from './ContractSchedule';
import { Label } from 'components/core-ui-lib';
import { personState } from 'state/contracts/PersonState';
import { getAllOptions, noop, transformToOptions } from 'utils';
import { ContractPermissionGroup } from 'interfaces';
import { getContractDropdownOptions } from 'utils/contracts';

interface Props {
  permissions: {
    accessNewPerson: ContractPermissionGroup;
    accessNewContract: ContractPermissionGroup;
    accessContracts: ContractPermissionGroup;
  };
}

const CompanyContractFilters = (props: Props) => {
  const [filter, setFilter] = useRecoilState(contractsFilterState);
  const { selected: productionId } = useRecoilValue(productionJumpState);
  const personMap = useRecoilValue(personState);
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
  const [openContract, setOpenContract] = useState(false);
  const onChange = (e) => {
    setFilter({ ...filter, [e.target.id]: e.target.value });
  };

  const onClearFilters = () => {
    setFilter({
      ...intialContractsFilterState,
    });
  };

  const hasAnyPermissions = (perms: ContractPermissionGroup) => {
    return perms.artisteContracts || perms.creativeContracts || perms.smTechCrewContracts;
  };

  const canCreateContract = useMemo(() => {
    return hasAnyPermissions(props.permissions.accessNewContract);
  }, [props.permissions.accessNewContract]);

  // Change dropdown-options based on permissions
  const getDropdownOptions = useMemo(() => {
    const options = getContractDropdownOptions(props.permissions.accessContracts);
    if (options.length > 1) {
      options.unshift(contractDepartmentOptions.find((x) => x.text === 'All')); // Add "All" to the top if multiple options are available
    }
    return options;
  }, [props.permissions]);

  const openContractSchedule = () => {
    setOpenContract(true);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="px-4 w-full">
        <GlobalToolbar
          searchFilter={filter.contractText}
          setSearchFilter={(contractText) => setFilter({ contractText })}
          titleClassName="text-primary-blue"
          title="Company Contracts"
        >
          <div className="grow">
            <TextInput
              id="contractText"
              disabled={!productionId}
              placeholder="Search contracts..."
              className="w-full"
              iconName="search"
              value={filter.contractText}
              onChange={onChange}
            />
          </div>
        </GlobalToolbar>
      </div>
      <div className="flex justify-between gap-2">
        <div className="px-4 flex items-center gap-4 flex-wrap  py-1">
          <Label className="!text-base text-primary-input-text !font-bold" text="Name" />
          <Select
            onChange={(value) => onChange({ target: { id: 'person', value } })}
            className="bg-primary-white w-72"
            value={filter.person}
            disabled={!productionId}
            placeholder="Please Select Name"
            options={personOptions}
            isClearable
            isSearchable
          />
          <Label className="!text-base text-primary-input-text !font-bold ml-4" text="Department" />
          <Select
            onChange={(value) => onChange({ target: { id: 'department', value } })}
            className="bg-white w-80"
            value={filter.department}
            disabled={!productionId}
            placeholder="Department"
            options={getDropdownOptions}
            isClearable
            isSearchable
          />
        </div>
      </div>
      <div className="flex justify-between items-center gap-2 mt-2 ">
        <div className="px-4 flex items-center gap-4 flex-wrap  ">
          <Label className="!text-base text-primary-input-text !font-bold" text="Contract Status" />
          <Select
            onChange={(value) => onChange({ target: { id: 'status', value } })}
            className="bg-white w-60"
            value={filter.status}
            disabled={!productionId}
            placeholder="Contract Status"
            options={getAllOptions(companyContractStatusOptions)}
            isClearable
            isSearchable
          />
          <Label className="!text-base text-primary-input-text !font-bold ml-6" text="Date Issued" />
          <ContractsDateFilter />
          <Button className="text-sm leading-8 ml-6 px-6" text="Clear Filters" onClick={onClearFilters} />
        </div>
        <div className="flex">
          <Button
            className="text-sm leading-8 px-6"
            text="Start New Contract"
            onClick={openContractSchedule}
            disabled={!canCreateContract}
          />
          <Button
            disabled
            className="text-sm leading-8 ml-4 px-6"
            text="View / Edit Contract Templates"
            onClick={noop}
          />
        </div>
      </div>
      {openContract && (
        <ContractScheduleModal
          openContract={openContract}
          onClose={() => setOpenContract(false)}
          accessNewPerson={props.permissions.accessNewPerson}
          accessPermissions={props.permissions.accessNewContract}
        />
      )}
    </div>
  );
};

export default CompanyContractFilters;
