import { Button } from 'components/core-ui-lib';
import PopupModal from 'components/core-ui-lib/PopupModal';
import { ContractPersonDataForm } from '../ContractPersonDataForm';

interface ContractNewPersonModalProps {
  openNewPersonContract: boolean;
  onClose: () => void;
}

export const ContractNewPersonModal = ({ openNewPersonContract, onClose }: ContractNewPersonModalProps) => {
  return (
    <PopupModal
      show={openNewPersonContract}
      title="Add New Person"
      titleClass="text-xl text-primary-navy font-bold -mt-2"
      onClose={onClose}
      // hasOverlay={showSalesSnapshot}
    >
      <ContractPersonDataForm height="80vh" />

      <div className="w-full mt-4 flex justify-end items-center">
        <Button className="w-33" variant="secondary" text="Cancel" />
        <Button className="ml-4 w-33" variant="primary" text="Save and Return to Contracts" />
      </div>
    </PopupModal>
  );
};
