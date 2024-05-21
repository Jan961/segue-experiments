import PopupModal from 'components/core-ui-lib/PopupModal';
import ProductionsView from './Views/ProductionsView';

interface ProductionsProps {
  visible: boolean;
  onClose: (production?: any) => void;
  showData: any;
}

const Productions = ({ visible, onClose, showData }: ProductionsProps) => {
  return (
    <PopupModal
      show={visible}
      onClose={() => onClose()}
      titleClass="text-xl text-primary-navy text-bold"
      title={'Productions'}
      panelClass="relative"
      hasOverlay={false}
    >
      <ProductionsView onClose={onClose} showData={showData} showName={showData.Name} />
    </PopupModal>
  );
};

export default Productions;
