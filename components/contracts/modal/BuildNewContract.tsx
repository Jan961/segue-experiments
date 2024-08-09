import { Button } from 'components/core-ui-lib';
import PopupModal from 'components/core-ui-lib/PopupModal';

import { ContractPersonDataForm } from '../ContractPersonDataForm';
import { useState } from 'react';
import { ContractPreviewDetailsForm } from '../ContractPreviewDetailsDataForm';
import { noop } from 'utils';

interface BuildNewContractProps {
  openNewPersonContract: boolean;
  onClose: () => void;
}

export const BuildNewContract = ({ openNewPersonContract, onClose }: BuildNewContractProps) => {
  const [mainButtonSelection, setMainButtonSelection] = useState({ name: true, details: false, preview: false });

  const handleButtons = (key: string) => {
    const buttons = { name: false, details: false, preview: false };
    buttons[key] = true;
    setMainButtonSelection(buttons);
  };
  return (
    <PopupModal
      show={openNewPersonContract}
      title="Contract Details"
      titleClass="text-xl text-primary-navy font-bold -mt-2"
      hasOverflow={false}
      onClose={onClose}
      hasOverlay={true}
    >
      <div className="w-[82vw]">
        <div className="text-xl text-primary-navy font-bold w-[50vw]">PROD CODE</div>
        <div className="text-xl text-primary-navy font-bold w-[50vw]">Department</div>
      </div>
      <div className="flex justify-center w-[100%] pt-2 pb-2">
        <div
          className="w-[24vw] border-solid border-2 border-primary-navy text-center rounded cursor-pointer"
          style={{ background: mainButtonSelection.name ? '#0093C0' : 'white' }}
          onClick={() => handleButtons('name')}
        >
          First Name Details
        </div>
        <div
          className="w-[24vw] border-solid border-2 border-primary-navy text-center rounded cursor-pointer"
          style={{ background: mainButtonSelection.details ? '#0093C0' : 'white' }}
          onClick={() => handleButtons('details')}
        >
          Contract Details
        </div>
        <div
          className="w-[24vw] border-solid border-2 border-primary-navy text-center rounded cursor-pointer"
          style={{ background: mainButtonSelection.preview ? '#0093C0' : 'white' }}
          onClick={() => handleButtons('preview')}
        >
          Contract Preview
        </div>
      </div>
      <div className="border-solid border-2 border-primary-navy  rounded p-2">
        {mainButtonSelection.name && <ContractPersonDataForm height="h-[70vh]" updateFormData={noop} />}
        {mainButtonSelection.details && <ContractPersonDataForm height="h-[70vh]" updateFormData={noop} />}
        {mainButtonSelection.preview && <ContractPreviewDetailsForm height="h-[70vh]" />}
      </div>

      <div className="w-full mt-4 flex justify-end items-center">
        <Button className="w-33" variant="secondary" text="Cancel" onClick={onClose} />
        <Button className="ml-4 w-33" variant="primary" text="Save and Return to Contracts" onClick={onClose} />
      </div>
    </PopupModal>
  );
};
