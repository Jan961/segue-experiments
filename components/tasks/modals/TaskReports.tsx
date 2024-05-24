import Button from 'components/core-ui-lib/Button';
import PopupModal from 'components/core-ui-lib/PopupModal';

interface TaskReportsProps {
  visible: boolean;
  onClose: () => void;
}

const TaskReports = ({ visible, onClose }: TaskReportsProps) => {
  return (
    <PopupModal show={visible} onClose={onClose} title="Task Reports" titleClass="text-primary-navy text-xl mb-2">
      <div className="flex mt-2 flex-col">
        <Button text="Production Task List" className="w-[262px] mb-3" sufixIconName="excel" onClick={null} />
        <Button text="Master Task List" className="w-[262px]" sufixIconName="excel" onClick={null} />
      </div>
    </PopupModal>
  );
};

export default TaskReports;
