import Button from 'components/core-ui-lib/Button';
import Loader from 'components/core-ui-lib/Loader';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Select from 'components/core-ui-lib/Select';
import { useState } from 'react';
import { NewProductionTaskOptions } from './constants';

const LoadingOverlay = () => (
  <div className="inset-0 absolute bg-white bg-opacity-50 z-50 flex justify-center items-center">
    <Loader className="ml-2" iconProps={{ stroke: '#FFF' }} />
  </div>
);

interface EmptyProductionTaskProps {
  visible: boolean;
  onClose: () => void;
}

const EmptyProductionTask = ({ visible, onClose }: EmptyProductionTaskProps) => {

  const [loading, setLoading] = useState<boolean>(false);

  const [newProductionTask, setNewProductionTask] = useState('master');

  const handleOnChange = (e: any) => {
    let { id, value } = e.target;
  };

  const handleOnSubmit = async () => {
    setLoading(true);

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
        {loading && <LoadingOverlay />}
        <p>
          The selected production has no tasks.<br/>
          Would you like to...
        </p>
        <Select
          onChange={(value) => handleOnChange({ target: { id: 'AssignedToUserId', value } })}
          value={newProductionTask}
          options={NewProductionTaskOptions}
          placeholder="Select Assignee"
          className="w-64"
          isClearable={false}
        />
          <div className="flex">
            <Button variant="secondary" onClick={onClose} className="mr-4 w-[132px]" text="Cancel" />
            <Button
              variant="primary"
              className="w-[132px]"
              onClick={handleOnSubmit}
              text={'Ok'}
            />
          </div>
      </form>
    </PopupModal>
  );
};

export default EmptyProductionTask;
