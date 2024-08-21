import { PopupModal, Button } from 'components/core-ui-lib';

interface ExistingTasksProps {
  visible: boolean;
  onCancel: (val?: string) => void;
  duplicateList?: any[];
  onConfirm: () => Promise<void>;
  productionId?: number;
  isMaster?: boolean;
}

const ExistingTasks = ({ visible, duplicateList, onCancel, onConfirm }: ExistingTasksProps) => {
  return (
    <PopupModal show={visible} onClose={onCancel} title="Existing Tasks">
      <p className="text-primary">This / these task(s) already exist.</p>

      {duplicateList.map((task) => (
        <p key={task.Id} className="text-primary">{`- Task ${task.Code} ${task.Name}`}</p>
      ))}

      <div className="pt-3">
        <p className="text-primary">Do you wish to continue and create duplicate task(s)?</p>
        <div className="flex float-right pt-3">
          <Button variant="secondary" onClick={onCancel} className="w-36">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="ml-4 w-36">
            OK
          </Button>
        </div>
      </div>
    </PopupModal>
  );
};

export default ExistingTasks;
