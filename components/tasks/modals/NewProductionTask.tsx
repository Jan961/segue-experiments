import Button from 'components/core-ui-lib/Button';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Select from 'components/core-ui-lib/Select';
import { useState } from 'react';
import { AddTaskOptions } from './constants';

interface NewProductionTaskProps {
  visible: boolean;
  onClose: () => void;
  handleNewProductionTaskSubmit: (val: string) => void;
}

const NewProductionTask = ({ visible, onClose, handleNewProductionTaskSubmit }: NewProductionTaskProps) => {
  const [newProductionTask, setNewProductionTask] = useState('master');

  const handleOnChange = (value: string) => {
    setNewProductionTask(value);
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    handleNewProductionTaskSubmit(newProductionTask);
    setNewProductionTask('master');
  };

  return (
    <PopupModal show={visible} onClose={handleClose} title={'Add Task'} titleClass="text-primary-navy text-xl mb-4">
      <form className="flex flex-col gap-4">
        <p>Would you like to...</p>
        <Select
          onChange={handleOnChange}
          value={newProductionTask}
          options={AddTaskOptions}
          placeholder="Select Assignee"
          className="w-64"
          isClearable={false}
        />
        <div className="flex">
          <Button variant="secondary" onClick={onClose} className="mr-4 w-[132px]" text="Cancel" />
          <Button variant="primary" className="w-[132px]" onClick={handleSubmit} text={'Ok'} />
        </div>
      </form>
    </PopupModal>
  );
};

export default NewProductionTask;
