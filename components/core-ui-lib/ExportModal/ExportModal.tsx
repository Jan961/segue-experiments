import Modal from 'components/core-ui-lib/PopupModal';
import { exportToExcel, exportToPDF } from 'utils/export';
import Icon from '../Icon/Icon';
import { ExportModalProps } from './interface';

const ExportModal = ({ visible, onClose, ExportList, tableRef, pdfStyles }: ExportModalProps) => {
  const handleClick = (key: string) => {
    switch (key?.toLowerCase()) {
      case 'excel':
        exportToExcel(tableRef);
        break;
      case 'pdf':
        exportToPDF(tableRef, pdfStyles);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Modal show={visible} showCloseIcon={false} panelClass="rounded-lg" closeOnOverlayClick={true} onClose={onClose}>
        <div className="flex flex-wrap max-w-md justify-center items-center gap-8 mt-5">
          {ExportList?.map((type) => (
            <div
              key={type.key}
              className="flex flex-col items-center w-full sm:w-auto cursor-pointer"
              onClick={() => handleClick(type.key)}
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
