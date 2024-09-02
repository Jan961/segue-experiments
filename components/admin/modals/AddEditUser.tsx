import { Button, Checkbox, Label, PopupModal, TextInput } from 'components/core-ui-lib';
import TreeSelect from 'components/global/TreeSelect';
import { TreeItemOption } from 'components/global/TreeSelect/types';
import { useEffect, useState } from 'react';
import { generateRandomHash } from 'utils/crypto';
import useClerk from 'hooks/useClerk';
import Spinner from 'components/core-ui-lib/Spinner';
import { newUserSchema } from 'validators/user';
import FormError from 'components/core-ui-lib/FormError';

type UserDetails = {
  email: string;
  firstName: string;
  lastName: string;
  pin: string;
  password?: string;
  permissions: TreeItemOption[];
  accountId: number;
  isSystemAdmin: boolean;
  productions: TreeItemOption[];
};

interface AdEditUserProps {
  permissions: TreeItemOption[];
  productions: any;
  state: any;
  onClose: () => void;
  visible: boolean;
}

const DEFAULT_USER_DETAILS: UserDetails = {
  accountId: 1,
  email: '',
  firstName: '',
  lastName: '',
  pin: '',
  password: '',
  permissions: [],
  productions: [],
  isSystemAdmin: false,
};

const AdEditUser = ({ visible, onClose, permissions, productions = [] }: AdEditUserProps) => {
  const [userDetails, setUserDetails] = useState<UserDetails>(DEFAULT_USER_DETAILS);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const { isSignUpLoaded, createUser, error } = useClerk();
  const handleInputChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setUserDetails({ ...userDetails, productions });
  }, [productions]);

  async function validateUser() {
    try {
      await newUserSchema.validate({ ...userDetails }, { abortEarly: false });
      return true;
    } catch (validationErrors) {
      const errors = {};
      validationErrors.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
      setValidationErrors(errors);
      console.log('validation Errors', errors);
      return false;
    }
  }

  const handleProductionToggle = (e) => {
    const { id, checked } = e.target;
    const updatedProductions = userDetails.productions.map((p) => (p.id === id ? { ...p, checked } : p));
    setUserDetails({ ...userDetails, productions: updatedProductions });
  };

  const saveUser = async () => {
    const isValid = await validateUser();
    if (!isValid) {
      return;
    }
    const permissions = userDetails.permissions
      .flatMap((perm) => [perm, ...perm.options])
      .filter(({ checked }) => checked)
      .map(({ id }) => id);

    await createUser({ ...userDetails, permissions });
  };

  return isSignUpLoaded ? (
    <PopupModal
      show={visible}
      onClose={onClose}
      titleClass="text-xl text-primary-navy text-bold"
      title="Add New User"
      panelClass="relative"
      hasOverlay={false}
    >
      <div className="w-full h-full max-h-[95vh]">
        <div className="flex flex-col w-full gap-2 mb-4">
          <div className="w-full">
            <Label text="First Name" required />
            <TextInput
              name="firstName"
              placeholder="Enter First Name"
              className="w-full"
              value={userDetails.firstName}
              onChange={handleInputChange}
              testId="user-first-name"
            />
            <FormError error={validationErrors.firstName} className="mt-2 ml-2" />
          </div>
          <div className="w-full">
            <Label text="Last Name" required />
            <TextInput
              name="lastName"
              placeholder="Enter Last Name"
              className="w-full"
              value={userDetails.lastName}
              onChange={handleInputChange}
              testId="user-last-name"
            />
            <FormError error={validationErrors.lastName} className="mt-2 ml-2" />
          </div>
          <div className="w-full">
            <Label text="Email Address" required />
            <TextInput
              name="email"
              placeholder="Enter Email Address"
              className="w-full"
              value={userDetails.email}
              onChange={handleInputChange}
              testId="user-email"
            />
            <FormError error={validationErrors.email} className="mt-2 ml-2" />
          </div>
          <div className="w-full">
            <Label text="Password" required />
            <div className="w-full flex items-center gap-3">
              <TextInput
                className="tracking-widest text-center"
                name="password"
                value={userDetails.password}
                disabled
                testId="user-password"
              />
              <Button onClick={() => setUserDetails({ ...userDetails, password: generateRandomHash(4) })}>
                Generate Password
              </Button>
            </div>
            <FormError error={validationErrors.password} className="mt-2 ml-2" />
          </div>
          <div className="w-full">
            <Label text="PIN" required />
            <div className="w-full flex items-center gap-3">
              <TextInput
                testId="user-pin"
                className="tracking-widest text-center"
                name="pin"
                value={userDetails.pin}
                disabled
              />
              <Button onClick={() => setUserDetails({ ...userDetails, pin: generateRandomHash(2) })}>
                Generate PIN
              </Button>
            </div>
            <FormError error={validationErrors.pin} className="mt-2 ml-2" />
          </div>
        </div>
        <Checkbox
          className="mb-4"
          id="isSystemAdmin"
          testId="user-is-system-admin"
          checked={userDetails.isSystemAdmin}
          labelClassName="font-semibold"
          label="This user wil be a System Administrator"
          onChange={(e) => setUserDetails({ ...userDetails, isSystemAdmin: e.target.checked })}
        />
        <div className="flex flex-row gap-4 w-full">
          <div className="w-full max-h-[400px] overflow-y-hidden">
            <h2 className="text-xl text-bold mb-2">Productions</h2>
            <div className="w-full max-h-[400px] overflow-y-auto">
              {userDetails.productions.map((production) => (
                <Checkbox
                  key={production.id}
                  id={production.id}
                  name={production.id}
                  label={production.label}
                  checked={production.checked}
                  onChange={handleProductionToggle}
                />
              ))}
            </div>
          </div>
          <div className="w-full max-h-[400px]  overflow-y-hidden">
            <h2 className="text-xl text-bold mb-2">Permissions</h2>
            <div className="w-full max-h-[400px] overflow-y-auto">
              <TreeSelect
                options={permissions}
                onChange={(permissions) => setUserDetails({ ...userDetails, permissions })}
                defaultOpen
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-5">
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button onClick={saveUser}>Save and Close</Button>
        </div>
        <FormError error={error} className="mt-2 flex justify-end" variant="md" />
      </div>
    </PopupModal>
  ) : (
    <Spinner size="md" />
  );
};

export default AdEditUser;
