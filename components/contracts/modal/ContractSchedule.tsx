import { Button, Select, TextInput } from 'components/core-ui-lib';
import PopupModal from 'components/core-ui-lib/PopupModal';
// import { ARCHIVED_OPTION_STYLES } from 'components/global/nav/ProductionJumpMenu';
import ProductionOption from 'components/global/nav/ProductionOption';
import { useState } from 'react';
import { ContractNewPersonModal } from './ContractNewPersonModal';
export const ARCHIVED_OPTION_STYLES = {
  option: (styles, { isDisabled, isSelected, isFocused, data }) => {
    return {
      ...styles,
      fontSize: '1rem',
      lineHeight: '1.5rem',
      backgroundColor: isDisabled
        ? undefined
        : isSelected && !data.IsArchived
        ? '#21345BCC'
        : isSelected && data.IsArchived
        ? '#707070'
        : isFocused && !data.IsArchived
        ? '#21345B99'
        : isFocused && data.IsArchived
        ? '#464646b3'
        : data.IsArchived
        ? '#4646464d'
        : '#FFF',
      color: isDisabled ? '#ccc' : isSelected || isFocused ? '#FFF' : '#617293',
      cursor: isDisabled ? 'not-allowed' : 'default',
      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled ? (isSelected ? '#FDCE74' : '#41A29A') : undefined,
      },
      ':hover': {
        ...styles[':hover'],
        color: '#FFF',
        backgroundColor: data.IsArchived ? '#464646b3' : '#21345B99',
      },
    };
  },
};

export const ContractScheduleModal = ({ openContract }: { openContract: boolean }) => {
  const [openNewPersonContract, setopenNewPersonContract] = useState(false);
  return (
    <PopupModal
      show={openContract}
      title="Contract Schedule"
      titleClass="text-xl text-primary-navy font-bold -mt-2"
      // onClose={handleModalCancel}
      // hasOverlay={showSalesSnapshot}
    >
      <div className="w-[430px] h-auto">
        {/* <div className="text-xl text-primary-navy font-bold mb-4">{venueDesc}</div> */}
        <Select
          testId="pjm-production-selector"
          className=" shadow-none w-[420px] border-solid "
          // value={selected}
          label="Production"
          placeholder="Please select a Production"
          renderOption={(option) => <ProductionOption option={option} />}
          customStyles={ARCHIVED_OPTION_STYLES}
          // options={productions}
          // onChange={goToProduction}
          isSearchable
          isClearable={false}
        />
        <div className="flex">
          <div className=" text-primary-input-text">Person</div>

          <Select
            // onChange={(value) => onChange({ target: { id: 'dealMemoStatusDropDown', value } })}
            className="bg-primary-white w-52"
            // value={filter.dealMemoStatusDropDown}
            // disabled={!productionId}
            placeholder="Deal Memo Status"
            // options={allStatusOptions}
            isClearable
            isSearchable
          />
        </div>
        <Button onClick={() => null} className="w-33" variant="secondary" text="Add New Person" />
        <div className="flex">
          <div className=" text-primary-input-text font-bold text-sm mr-1">Role</div>

          <TextInput id="venueText" className="w-[100px]" />
        </div>
        <div className="flex">
          <div className=" text-primary-input-text">Department</div>

          <Select
            // onChange={(value) => onChange({ target: { id: 'dealMemoStatusDropDown', value } })}
            className="bg-primary-white w-52"
            // value={filter.dealMemoStatusDropDown}
            // disabled={!productionId}
            placeholder="Deal Memo Status"
            // options={allStatusOptions}
            isClearable
            isSearchable
          />
        </div>
        <div className="flex">
          <div className=" text-primary-input-text">Contract Template</div>

          <Select
            // onChange={(value) => onChange({ target: { id: 'dealMemoStatusDropDown', value } })}
            className="bg-primary-white w-52"
            // value={filter.dealMemoStatusDropDown}
            // disabled={!productionId}
            placeholder="Deal Memo Status"
            // options={allStatusOptions}
            isClearable
            isSearchable
          />
        </div>
        <div className=" text-primary-input-text font-bold text-sm mr-1">
          Please contact sales@seguetheatre.com to arrange upload of COntract Templates
        </div>

        <Button
          className="text-sm leading-8 w-[120px]"
          text="Start Building Contract"
          onClick={() => setopenNewPersonContract(true)}
        />
      </div>
      {openNewPersonContract && <ContractNewPersonModal openNewPersonContract={openNewPersonContract} />}
    </PopupModal>
  );
};
