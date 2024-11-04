import { Button, notify } from 'components/core-ui-lib';
import PopupModal from 'components/core-ui-lib/PopupModal';
import { PersonDetailsTab } from './edit-contract-modal/tabs/PersonDetailsTab';
import { useState } from 'react';
import axios from 'axios';
import { createPersonSchema } from 'validators/person';
import { debug } from 'utils/logging';
import { ContractPermissionGroup } from 'interfaces';

interface ContractNewPersonModalProps {
  openNewPersonContract: boolean;
  onClose: (flag?: boolean) => void;
  permissions: ContractPermissionGroup;
}

export const ContractNewPersonModal = ({
  openNewPersonContract,
  onClose,
  permissions,
}: ContractNewPersonModalProps) => {
  const [formData, setFormData] = useState({});
  // const [validationErrors, setValidationErrors] = useState({});
  const validateForm = async (data) => {
    try {
      await createPersonSchema.validate({ ...data }, { abortEarly: false });
      return true;
    } catch (validationErrors) {
      const errors = {};
      validationErrors.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
      // setValidationErrors(errors);
      debug('validationErrors:', errors);
      return false;
    }
  };

  const onSave = async () => {
    const validation = await validateForm(formData);
    if (!validation) {
      notify.error('Person FirstName, LastName are required');
      return;
    }
    try {
      await axios.post('/api/company-contracts/create/person', formData);
      onClose(true);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <PopupModal
      show={openNewPersonContract}
      title="Add New Person"
      titleClass="text-xl text-primary-navy font-bold -mt-2"
      onClose={() => onClose?.()}
    >
      <div className="overflow-y-scroll">
        <PersonDetailsTab
          type="New"
          updateFormData={setFormData}
          height="h-[80vh]"
          permissions={permissions}
          departmentId={0}
        />
      </div>
      <div className="w-full mt-4 flex justify-end items-center">
        <Button onClick={() => onClose?.()} className="w-33" variant="secondary" text="Cancel" />
        <Button onClick={onSave} className="ml-4 w-33" variant="primary" text="Save and Return to Contracts" />
      </div>
    </PopupModal>
  );
};
