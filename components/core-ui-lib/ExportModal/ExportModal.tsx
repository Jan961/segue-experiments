import Modal from 'components/core-ui-lib/PopupModal';
import Icon from '../Icon/Icon';
import { ExportModalProps } from './interface';

const ExportModal = ({ visible, onClose, ExportList, onItemClick }: ExportModalProps) => {
  return (
    <>
      <Modal show={visible} panelClass="rounded-lg" closeOnOverlayClick={true} onClose={onClose}>
        <div className="flex flex-wrap max-w-md justify-center items-center gap-8 mt-5">
          {ExportList?.map((type) => (
            <div
              key={type.key}
              className="flex flex-col items-center w-full sm:w-auto cursor-pointer"
              onClick={() => {
                onItemClick(type.key);
                onClose();
              }}
            >
              <Icon iconName={type.iconName} variant="7xl" {...type.iconProps} />
              <div className="text-center mt-2 font-bold">{type.key}</div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default ExportModal;
