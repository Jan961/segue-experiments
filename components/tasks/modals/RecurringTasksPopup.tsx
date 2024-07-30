import Button from 'components/core-ui-lib/Button';
import PopupModal from 'components/core-ui-lib/PopupModal';

interface RecurringTasksProps {
  visible: boolean;
  onClose: () => void;
  numTaskChange: number;
  onSubmit: () => void;
  isNewTask: any;
}

export const RecurringTasksPopup = ({ visible, onClose, numTaskChange, onSubmit, isNewTask }: RecurringTasksProps) => {
  if (isNewTask) {
    return (
      <PopupModal show={visible} onClose={onClose}>
        <div>
          <h1>This task is set to repeat</h1>
          <p>This task is set to repeat. There will be {numTaskChange} new tasks added</p>
        </div>
        <Button variant="primary" className="bg-primary-red" onClick={onClose} testId="btn-cancel-add-recurring">
          Cancel
        </Button>
        <Button variant="secondary" onClick={onSubmit} testId="btn-continue-add-recurring">
          Continue
        </Button>
      </PopupModal>
    );
  } else {
    return (
      <PopupModal show={visible} onClose={onClose}>
        <div>
          <h1>This task is set to repeat</h1>
          <p>The time and/ or frequency of this task has been {numTaskChange > 0 ? ` increased` : `decreased`}.</p>
          <p>
            {Math.abs(numTaskChange)} tasks will be {numTaskChange > 0 ? `added to` : `removed from`} the task list.
          </p>
        </div>
        <Button variant="primary" className="bg-primary-red" onClick={onClose} testId="btn-recurring-cancel-changes">
          Cancel
        </Button>
        <Button variant="secondary" onClick={onSubmit} testId="btn-recurring-accept-changes">
          Continue
        </Button>
      </PopupModal>
    );
  }
};
