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
      <PopupModal show={visible} onClose={onClose} title="This task is set to repeat">
        <div>
          <p>This task is set to repeat. There will be {numTaskChange} new tasks added</p>
        </div>
        <div className="flex mt-2 justify-items-center items-center justify-center">
          <Button
            variant="secondary"
            onClick={onClose}
            className="mr-4 w-[132px]"
            text="Cancel"
            testId="btn-cancel-add-recurring"
          />
          <Button
            variant="primary"
            className="w-[132px]"
            onClick={onSubmit}
            text="OK"
            testId="btn-continue-add-recurring"
          />
        </div>
      </PopupModal>
    );
  } else {
    return (
      <PopupModal show={visible} onClose={onClose} title="This task is set to repeat">
        <div>
          <p>The time and/ or frequency of this task has been {numTaskChange > 0 ? ` increased` : `decreased`}.</p>
          <p>
            {Math.abs(numTaskChange)} tasks will be {numTaskChange > 0 ? `added to` : `removed from`} the task list.
          </p>
        </div>
        <div className="flex mt-2 justify-items-center items-center justify-center">
          <Button
            variant="secondary"
            onClick={onClose}
            className="mr-4 w-[132px]"
            text="Cancel"
            testId="btn-recurring-cancel-changes"
          />
          <Button
            variant="primary"
            className="w-[132px]"
            onClick={onSubmit}
            text="OK"
            testId="btn-recurring-accept-changes"
          />
        </div>
      </PopupModal>
    );
  }
};
