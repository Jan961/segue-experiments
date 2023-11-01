import { StyledDialog } from 'components/global/StyledDialog';
import { FormInputButton } from 'components/global/forms/FormInputButton';
import React from 'react';
import { UserEditor } from '../editors/UserEditor';

export const CreateUserModal = () => {
  const [modalOpen, setModalOpen] = React.useState(false);

  const triggerClose = () => setModalOpen(false);

  return (
    <>
      <div className="text-right">
        <FormInputButton intent="PRIMARY" onClick={() => setModalOpen(true)} text="Add User" />
      </div>
      <StyledDialog open={modalOpen} onClose={triggerClose} title="Add User">
        <UserEditor triggerClose={triggerClose} />
      </StyledDialog>
    </>
  );
};
