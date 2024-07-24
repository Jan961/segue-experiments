import Button from 'components/core-ui-lib/Button';
import GlobalToolbar from 'components/toolbar';
import Select from 'components/core-ui-lib/Select';
import ContractsDateFilter from '../contracts/ContractsDateFilter';
import TextInput from 'components/core-ui-lib/TextInput';
import { useRecoilState, useRecoilValue } from 'recoil';
import { contractsFilterState, intialContractsFilterState } from 'state/contracts/contractsFilterState';
import { allStatusOptions } from 'config/contracts';
import { productionJumpState } from 'state/booking/productionJumpState';
import { ContractScheduleModal } from './modal/ContractSchedule';
import { useState } from 'react';

const CompanyContractFilters = () => {
  const [filter, setFilter] = useRecoilState(contractsFilterState);
  const { selected: productionId } = useRecoilValue(productionJumpState);
  const [openContract, setOpenContract] = useState(false);
  const onChange = (e) => {
    setFilter({ ...filter, [e.target.id]: e.target.value });
  };

  const onClearFilters = () => {
    setFilter({
      ...intialContractsFilterState,
      startDate: filter.scheduleStartDate,
      endDate: filter.scheduleEndDate,
      scheduleStartDate: filter.scheduleStartDate,
      scheduleEndDate: filter.scheduleEndDate,
    });
  };

  const openContractSchedule = () => {
    setOpenContract(true);
  };

  return (
    <div className="w-full  items-center justify-between flex-wrap">
      <div className="mx-0">
        <div className="px-4">
          <GlobalToolbar
            searchFilter={filter.contractText}
            setSearchFilter={(contractText) => setFilter({ contractText })}
            titleClassName="text-primary-blue"
            title="Company Contracts"
          >
            <TextInput
              id="contractText"
              disabled={!productionId}
              placeholder="Search contracts..."
              className="w-[33vw]"
              iconName="search"
              value={filter.contractText}
              onChange={onChange}
            />
          </GlobalToolbar>
        </div>
        <div className="px-4 flex items-center gap-4 flex-wrap  py-1">
          <div className=" text-primary-input-text font-bold">First Name</div>
          <Select
            onChange={(value) => onChange({ target: { id: 'dealMemoStatusDropDown', value } })}
            className="bg-primary-white w-[20vw]"
            value={filter.dealMemoStatusDropDown}
            disabled={!productionId}
            placeholder="Deal Memo Status"
            options={allStatusOptions}
            isClearable
            isSearchable
          />
          <div className=" text-primary-input-text font-bold ml-4">Last Name</div>
          <Select
            onChange={(value) => onChange({ target: { id: 'contractStatusDropDown', value } })}
            className="bg-white w-[20vw]"
            value={filter.contractStatusDropDown}
            disabled={!productionId}
            placeholder="Contract Status"
            options={allStatusOptions}
            isClearable
            isSearchable
          />
          <div className=" text-primary-input-text font-bold ml-4">Department</div>
          <Select
            onChange={(value) => onChange({ target: { id: 'contractStatusDropDown', value } })}
            className="bg-white w-[20vw]"
            value={filter.contractStatusDropDown}
            disabled={!productionId}
            placeholder="Contract Status"
            options={allStatusOptions}
            isClearable
            isSearchable
          />
          <Button className="text-sm leading-8 w-[120px] ml-6" text="Clear Filters" onClick={onClearFilters} />
        </div>
      </div>
      <div className="px-4 flex items-center gap-4 flex-wrap  mt-2">
        <div className=" text-primary-input-text font-bold">Contract Status</div>
        <Select
          onChange={(value) => onChange({ target: { id: 'contractStatusDropDown', value } })}
          className="bg-white w-[16vw]"
          value={filter.contractStatusDropDown}
          // disabled={!productionId}
          placeholder="Contract Status"
          options={allStatusOptions}
          isClearable
          isSearchable
        />

        <div className=" text-primary-input-text font-bold ml-6">Date Issued</div>

        <ContractsDateFilter />
        <div className="flex ml-[15.5vw]">
          <Button className="text-sm leading-8 w-[120px]" text="Start New Contract" onClick={openContractSchedule} />

          <Button
            className="text-sm leading-8 w-[120px] ml-4"
            text="View / Edit Contract Templates"
            onClick={onClearFilters}
          />
        </div>
      </div>
      {openContract && <ContractScheduleModal openContract={openContract} onClose={() => setOpenContract(false)} />}
    </div>
  );
};

export default CompanyContractFilters;
