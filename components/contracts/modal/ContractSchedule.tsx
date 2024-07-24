import { Button, Select, TextInput } from 'components/core-ui-lib';
import PopupModal from 'components/core-ui-lib/PopupModal';
// import { ARCHIVED_OPTION_STYLES } from 'components/global/nav/ProductionJumpMenu';
import ProductionOption from 'components/global/nav/ProductionOption';
import { useState } from 'react';
import { ContractNewPersonModal } from './ContractNewPersonModal';
import { BuildNewContract } from './BuildNewContract';
import { allStatusOptions } from 'config/bookings';
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

export const ContractScheduleModal = ({ openContract, onClose }: { openContract: boolean; onClose: () => void }) => {
  const [openNewPersonContract, setOpenNewPersonContract] = useState(false);
  const [openNewBuildContract, setOpenNewBuildContract] = useState(false);

  return (
    <PopupModal
      show={openContract}
      title="Contract Schedule"
      titleClass="text-xl text-primary-navy font-bold -mt-2"
      onClose={onClose}
      // hasOverlay={showSalesSnapshot}
    >
      <div className="w-[430px] h-auto">
        {/* <div className="text-xl text-primary-navy font-bold mb-4">{venueDesc}</div> */}
        <Select
          testId="pjm-production-selector"
          className=" shadow-none w-[420px] border-solid "
          // value={selected}
          onChange={() => {
            return null;
          }}
          label="Production"
          placeholder="Please select a Production"
          renderOption={(option) => <ProductionOption option={option} />}
          customStyles={ARCHIVED_OPTION_STYLES}
          options={allStatusOptions}
          // onChange={goToProduction}
          isSearchable
          isClearable={false}
        />
        <div className="flex mt-4 mb-4 items-center">
          <div className=" text-primary-input-text mr-4">Person</div>

          <Select
            onChange={() => {
              return null;
            }}
            className="bg-primary-white w-[25vw]"
            // value={filter.dealMemoStatusDropDown}
            // disabled={!productionId}
            placeholder="Deal Memo Status"
            options={allStatusOptions}
            isClearable
            isSearchable
          />
        </div>
        <div className="flex justify-end mr-2">
          <Button
            className="w-33"
            variant="secondary"
            text="Add New Person"
            onClick={() => setOpenNewPersonContract(true)}
          />
        </div>
        <div className="flex items-center mt-4">
          {/* <div className=" text-primary-input-text font-bold text-sm mr-1">Role</div> */}
          <div className=" text-primary-input-text mr-4">Role</div>

          <TextInput id="venueText" className="w-[25vw] ml-3" />
        </div>
        <div className="flex mt-4">
          <div className=" text-primary-input-text mr-4">Department</div>

          <Select
            onChange={() => {
              return null;
            }}
            className="bg-primary-white w-[22.5vw]"
            // value={filter.dealMemoStatusDropDown}
            // disabled={!productionId}
            placeholder="Deal Memo Status"
            options={allStatusOptions}
            isClearable
            isSearchable
          />
        </div>
        <div className="flex mt-4">
          <div className=" text-primary-input-text mr-4 w-[11vw]">Contract Template</div>

          <Select
            onChange={() => {
              return null;
            }}
            className="bg-primary-white w-[24vw] mr-2"
            // value={filter.dealMemoStatusDropDown}
            // disabled={!productionId}
            placeholder="Deal Memo Status"
            options={allStatusOptions}
            isClearable
            isSearchable
          />
        </div>
        <div className=" text-primary-input-text font-bold text-sm mr-1 mt-4 mb-4">
          Please contact sales@seguetheatre.com to arrange upload of COntract Templates
        </div>
        <div className="flex justify-end mr-2">
          <Button
            className="text-sm leading-8 w-[120px]"
            text="Start Building Contract"
            onClick={() => setOpenNewBuildContract(true)}
          />
        </div>
      </div>
      {openNewPersonContract && (
        <ContractNewPersonModal
          openNewPersonContract={openNewPersonContract}
          onClose={() => setOpenNewPersonContract(false)}
        />
      )}
      {openNewBuildContract && (
        <BuildNewContract openNewPersonContract={openNewBuildContract} onClose={() => setOpenNewBuildContract(false)} />
      )}
    </PopupModal>
  );
};
