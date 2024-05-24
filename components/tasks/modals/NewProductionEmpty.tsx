import Button from 'components/core-ui-lib/Button';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Select from 'components/core-ui-lib/Select';
import { useState } from 'react';
import { NewProductionTaskOptions } from './constants';

interface NewProductionEmptyProps {
  visible: boolean;
  onClose: () => void;
}

const NewProductionEmpty = ({ visible, onClose }: NewProductionEmptyProps) => {
  const [newProductionTask, setNewProductionTask] = useState('master');

  const handleOnChange = (value: string) => {
    setNewProductionTask(value);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <PopupModal
      show={visible}
      onClose={handleClose}
      title={'New Production Task List'}
      titleClass="text-primary-navy text-xl mb-4"
    >
      <form className="flex flex-col gap-4">
        <p>
          The selected production has no tasks.
          <br />
          Would you like to...
        </p>
        <Select
          onChange={handleOnChange}
          value={newProductionTask}
          options={NewProductionTaskOptions}
          placeholder="Select Assignee"
          className="w-64"
          isClearable={false}
        />
        <div className="flex">
          <Button variant="secondary" onClick={onClose} className="mr-4 w-[132px]" text="Cancel" />
          <Button variant="primary" className="w-[132px]" onClick={handleClose} text={'Ok'} />
        </div>
      </form>
    </PopupModal>
  );
};

export default NewProductionEmpty;
