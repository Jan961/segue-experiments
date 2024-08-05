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
    <PopupModal show={visible} onClose={onCancel}>
      <h1 className="text-2xl font-semibold text-primary">Existing Tasks</h1>
      This/ these task(s) already exist.
      <ul className="list-disc pl-3 pt-3">
        {duplicateList.map((task) => (
          <li key={task.Id}>{`Task ${task.Code} ${task.Name}`}</li>
        ))}
      </ul>
      <div className="pt-3">
        Do you wish to continue and create duplicate task(s)?
        <div className="flex justify-between pt-3">
          <Button variant="secondary" onClick={onCancel} className="w-28">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="w-28">
            OK
          </Button>
        </div>
      </div>
    </PopupModal>
  );
};

export default ExistingTasks;
