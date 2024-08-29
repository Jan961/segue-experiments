import { Button, Label, PopupModal, TextInput } from 'components/core-ui-lib';
import TreeSelect from 'components/global/TreeSelect';
import { TreeItemOption } from 'components/global/TreeSelect/types';
import { useState } from 'react';
import { generateRandomHash } from 'utils/crypto';

interface AdEditUserProps {
  permissions: TreeItemOption[];
  state: any;
  onClose: () => void;
  visible: boolean;
}

type UserDetails = {
  email: string;
  firstName: string;
  lastName: string;
  pin: string;
  password?: string;
};

const DEFAULT_USER_DETAILS: UserDetails = {
  email: '',
  firstName: '',
  lastName: '',
  pin: '',
  password: '',
};

const AdEditUser = ({ visible, onClose, permissions }: AdEditUserProps) => {
  const [userDetails, setUserDetails] = useState<UserDetails>(DEFAULT_USER_DETAILS);

  const handleInputChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const saveUser = async () => {};

  return (
    <PopupModal
      show={visible}
      onClose={onClose}
      titleClass="text-xl text-primary-navy text-bold"
      title="Add/Edit User"
      panelClass="relative"
      hasOverlay={false}
    >
      <div className="w-full h-full max-h-[80vh] overflow-y-auto">
        <div className="flex flex-col w-full gap-4 mb-4">
          <div className="w-full">
            <Label text="First Name" />
            <TextInput
              name="firstName"
              placeholder="Enter First Name"
              className="w-full"
              value={userDetails.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full">
            <Label text="Last Name" />
            <TextInput
              name="lastName"
              placeholder="Enter Last Name"
              className="w-full"
              value={userDetails.lastName}
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full">
            <Label text="Email Address" />
            <TextInput
              name="email"
              placeholder="Enter Email Address"
              className="w-full"
              value={userDetails.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full">
            <Label text="Password" />
            <div className="w-full flex justify-between items-center gap-2">
              <TextInput
                className="tracking-widest text-center"
                name="password"
                value={userDetails.password}
                disabled
              />
              <Button onClick={() => setUserDetails({ ...userDetails, password: generateRandomHash(4) })}>
                Generate Password
              </Button>
            </div>
          </div>
          <div className="w-full">
            <Label text="PIN" />
            <div className="w-full flex justify-between items-center gap-2">
              <TextInput className="tracking-widest text-center" name="pin" value={userDetails.pin} disabled />
              <Button onClick={() => setUserDetails({ ...userDetails, pin: generateRandomHash(2) })}>
                Generate PIN
              </Button>
            </div>
          </div>
        </div>
        <TreeSelect options={permissions} onChange={null} defaultOpen />
        <div className="flex justify-end gap-4 mt-5">
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button onClick={saveUser}>Save and Close</Button>
        </div>
      </div>
    </PopupModal>
  );
};

export default AdEditUser;
