import PopupModal from 'components/core-ui-lib/PopupModal';

export const ContractNewPersonModal = ({ openNewPersonContract }: { openNewPersonContract: boolean }) => {
  return (
    <PopupModal
      show={openNewPersonContract}
      title="Add New Person"
      titleClass="text-xl text-primary-navy font-bold -mt-2"
      // onClose={handleModalCancel}
      // hasOverlay={showSalesSnapshot}
    >
      <div className="h-[80vh] w-[82vw]" />
    </PopupModal>
  );
};
