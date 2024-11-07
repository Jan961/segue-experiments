import { Button, notify } from 'components/core-ui-lib';
import PopupModal from 'components/core-ui-lib/PopupModal';
import { PersonDetailsTab } from './edit-contract-modal/tabs/PersonDetailsTab';
import { useState } from 'react';
import axios from 'axios';
import { createPersonSchema } from 'validators/person';
import { debug } from 'utils/logging';
import { IPerson } from 'components/contracts/types';
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
  const [formData, setFormData] = useState<Partial<IPerson>>({});
  const validateForm = async (data) => {
    try {
      await createPersonSchema.validate({ ...data }, { abortEarly: false });
      return { status: true };
    } catch (validationErrors) {
      const errors = {};
      validationErrors.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
      debug('validationErrors:', errors);
      return { status: false, errors };
    }
  };

  const onSave = async () => {
    const validation = await validateForm(formData);
    if (!validation.status) {
      Object.values(validation?.errors || {}).forEach((error) => notify.error(error));
      return;
    }
    const personFirstName = formData?.personDetails?.firstName;
    try {
      notify.promise(
        axios.post('/api/company-contracts/create/person', formData).then(() => onClose(true)),
        {
          loading: `Creating ${personFirstName || 'person'}`,
          success: `${personFirstName || 'Person'} Created successfully`,
          error: `Error creating ${personFirstName || 'person'}`,
        },
      );
    } catch (error) {
      debug(error);
    }
  };
  return (
    <PopupModal
      show={openNewPersonContract}
      title="Add New Person"
      titleClass="text-xl text-primary-navy font-bold"
      panelClass="h-[90vh]"
      onClose={() => onClose?.()}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 min-h-0">
          <PersonDetailsTab
            type="New"
            updateFormData={setFormData}
            permissions={permissions}
            departmentId={0}
            className="h-full overflow-y-auto pb-4"
            height="100%"
          />
        </div>
        <div className="mt-4 flex justify-end items-center pt-4 bg-white">
          <Button onClick={() => onClose?.()} className="w-33" variant="secondary" text="Cancel" />
          <Button onClick={onSave} className="ml-4 w-33 px-6" variant="primary" text="Save and Return to Contracts" />
        </div>
      </div>
    </PopupModal>
  );
};
