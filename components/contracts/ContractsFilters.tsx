import Button from 'components/core-ui-lib/Button';
import GlobalToolbar from 'components/toolbar';
import Select from 'components/core-ui-lib/Select';
import ContractsDateFilter from '../contracts/ContractsDateFilter';
import TextInput from 'components/core-ui-lib/TextInput';
import { useRecoilState, useRecoilValue } from 'recoil';
import { contractsFilterState, intialContractsFilterState } from 'state/contracts/contractsFilterState';
import { allStatusOptions } from 'config/contracts';
import { productionJumpState } from 'state/booking/productionJumpState';

const ContractFilters = () => {
  const [filter, setFilter] = useRecoilState(contractsFilterState);
  const { selected: productionId } = useRecoilValue(productionJumpState);

  const onChange = (e: any) => {
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

  return (
    <div className="w-full flex items-center justify-between flex-wrap">
      <div className="mx-0">
        <div className="px-4">
          <GlobalToolbar
            searchFilter={filter.contractText}
            setSearchFilter={(contractText) => setFilter({ contractText })}
            titleClassName="text-primary-blue"
            title="Venue Contracts"
          >
            <TextInput
              id="contractText"
              disabled={!productionId}
              placeholder="Search contracts..."
              className="w-[340px]"
              iconName="search"
              value={filter.contractText}
              onChange={onChange}
            />
          </GlobalToolbar>
        </div>
        <div className="px-4 flex items-center gap-4 flex-wrap  py-1">
          <ContractsDateFilter />
          <div className=" text-primary-input-text">Deal Memo Status</div>
          <Select
            onChange={(value) => onChange({ target: { id: 'dealMemoStatusDropDown', value } })}
            className="bg-primary-white w-52"
            value={filter.dealMemoStatusDropDown}
            disabled={!productionId}
            placeholder="Deal Memo Status"
            options={allStatusOptions}
            isClearable
            isSearchable
          />
          <div className=" text-primary-input-text">Contract Status</div>
          <Select
            onChange={(value) => onChange({ target: { id: 'contractStatusDropDown', value } })}
            className="bg-white w-52"
            value={filter.contractStatusDropDown}
            disabled={!productionId}
            placeholder="Contract Status"
            options={allStatusOptions}
            isClearable
            isSearchable
          />
          <Button className="text-sm leading-8 w-[120px]" text="Clear Filters" onClick={onClearFilters} />
        </div>
      </div>
    </div>
  );
};

export default ContractFilters;
