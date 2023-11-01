import axios from 'axios';
import { StyledDialog } from 'components/global/StyledDialog';
import { FormInputButton } from 'components/global/forms/FormInputButton';
import { FormInputText } from 'components/global/forms/FormInputText';
import { UserDto } from 'interfaces';
import React from 'react';
import { useRecoilState } from 'recoil';
import { userState } from 'state/account/userState';

interface UserEditorProps {
  user?: UserDto;
  triggerClose: () => void;
}

export const UserEditor = ({ user, triggerClose }: UserEditorProps) => {
  const [inputs, setInputs] = React.useState<UserDto>(user || { FirstName: '', LastName: '', Email: '' });
  const [status, setStatus] = React.useState({ submitted: true, submitting: false });
  const [userDict, setUserDict] = useRecoilState(userState);

  const editMode = inputs.Id;

  // Modified to handle arrays
  const handleOnChange = (e) => {
    const { id, value } = e.target;
    setInputs((prev) => {
      const newInputs = { ...prev };
      newInputs[id] = value;
      return newInputs;
    });

    setStatus({
      submitted: false,
      submitting: false,
    });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitted: false, submitting: true });

    console.log(editMode);

    if (editMode) {
      axios({
        method: 'POST',
        url: '/api/user/update/',
        data: inputs,
      })
        .then(({ data }) => {
          // TODO: Update Context
          setStatus({ submitted: true, submitting: false });
          setUserDict({ ...userDict, [data.Id]: data });
          triggerClose();
        })
        .catch((error) => {
          alert(error);
          setStatus({ submitted: false, submitting: false });
        });
    } else {
      axios({
        method: 'POST',
        url: '/api/user/create/',
        data: inputs,
      })
        .then(({ data }) => {
          // TODO: Update Context
          setStatus({ submitted: true, submitting: false });
          setUserDict({ ...userDict, [data.Id]: data });
          triggerClose();
        })
        .catch((error) => {
          alert(error);
          setStatus({ submitted: false, submitting: false });
        });
    }
  };

  const handleDelete = async () => {
    setStatus({ ...status, submitting: true });
    try {
      await axios.post('/api/user/delete/', inputs);
      const newValue = { ...userDict };
      delete newValue[user.Id];
      setUserDict(newValue);
      triggerClose();
    } catch {
      setStatus({ ...status, submitting: false });
    }
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <FormInputText name="FirstName" label="FirstName" onChange={handleOnChange} value={inputs.FirstName} />
      <FormInputText name="LastName" label="LastName" onChange={handleOnChange} value={inputs.LastName} />
      <FormInputText name="Email" label="Email" onChange={handleOnChange} value={inputs.Email} />

      <StyledDialog.FooterContainer>
        {!editMode && <StyledDialog.FooterCancel onClick={triggerClose} />}
        {editMode && (
          <StyledDialog.FooterDelete onClick={handleDelete} disabled={status.submitting}>
            Delete
          </StyledDialog.FooterDelete>
        )}
        <FormInputButton
          submit
          text={editMode ? 'Save User' : 'Create User'}
          disabled={status.submitted}
          loading={status.submitting}
        />
      </StyledDialog.FooterContainer>
    </form>
  );
};
