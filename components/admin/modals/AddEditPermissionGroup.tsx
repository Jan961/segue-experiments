import { Button, Checkbox, ConfirmationDialog, Label, PopupModal, TextInput } from 'components/core-ui-lib';
import TreeSelect from 'components/global/TreeSelect';
import { TreeItemOption } from 'components/global/TreeSelect/types';
import { useEffect, useState } from 'react';
import { generateRandomHash } from 'utils/crypto';
import useUser from 'hooks/useUser';
import Spinner from 'components/core-ui-lib/Spinner';
import { newUserSchema } from 'validators/user';
import FormError from 'components/core-ui-lib/FormError';
import axios from 'axios';

type GroupDetails = {
  accountUserId?: number;
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

interface AdEditPermissionGroupProps {
  permissions: TreeItemOption[];
  productions: TreeItemOption[];
  onClose: (refresh?: boolean) => void;
  visible: boolean;
  selectedGroup?: Partial<GroupDetails>;
}

const DEFAULT_GROUP_DETAILS: GroupDetails = {
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

const AdEditPermissionGroup = ({
  visible,
  onClose,
  permissions,
  productions = [],
  selectedGroup,
}: AdEditPermissionGroupProps) => {
  const [groupDetails, setGroupDetails] = useState<GroupDetails>(DEFAULT_GROUP_DETAILS);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [allProductionsChecked, setAllProductionsChecked] = useState(false);

  const { isSignUpLoaded, createUser, updateUser, error } = useUser();

  const handleInputChange = (e) => {
    setIsFormDirty(true);
    setGroupDetails({ ...groupDetails, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!selectedGroup) {
      setGroupDetails((prev) => ({ ...prev, productions, permissions }));
    }
  }, [productions, permissions, selectedGroup]);

  const fetchPermissionsForSelectedUser = async () => {
    const { data } = await axios.get(`/api/admin/user-permissions/${selectedGroup.accountUserId}`);
    const prodPermissions = productions.map((p) => (data.productions.includes(p.id) ? { ...p, checked: true } : p));
    const userPermissions = permissions.map((p) => (data.permissions.includes(p.id) ? { ...p, checked: true } : p));
    setGroupDetails({
      accountId: selectedGroup.accountId,
      accountUserId: selectedGroup.accountUserId,
      email: selectedGroup.email,
      firstName: selectedGroup.firstName,
      lastName: selectedGroup.lastName,
      pin: data.pin,
      password: 'xxxx',
      permissions: userPermissions,
      productions: prodPermissions,
      isSystemAdmin: data.isAdmin,
    });
  };

  useEffect(() => {
    if (selectedGroup) {
      fetchPermissionsForSelectedUser();
    }
  }, [selectedGroup, productions]);

  async function validateUser() {
    try {
      await newUserSchema.validate({ ...groupDetails }, { abortEarly: false });
      return true;
    } catch (validationErrors) {
      const errors = {};
      validationErrors.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
      setValidationErrors(errors);
      return false;
    }
  }

  const handleProductionToggle = (e) => {
    setIsFormDirty(true);
    const { id, checked } = e.target;
    const updatedProductions = groupDetails.productions.map((p) => (p.id === id ? { ...p, checked } : p));
    setGroupDetails({ ...groupDetails, productions: updatedProductions });
    if (!checked) {
      setAllProductionsChecked(false);
    }
  };

  const handleConfirmClick = () => {
    setShowConfirmationDialog(false);
    onClose();
  };

  const saveUser = async () => {
    const isValid = await validateUser();
    if (!isValid) {
      return;
    }
    const permissions = groupDetails.permissions
      .flatMap((perm) => [perm, ...perm.options])
      .filter(({ checked }) => checked)
      .map(({ id }) => id);

    const selectedProductions = groupDetails.productions.filter(({ checked }) => checked).map(({ id }) => id);
    const payload = { ...groupDetails, permissions, productions: selectedProductions };
    selectedGroup ? await updateUser(payload) : await createUser(payload);
    // reset the state
    setGroupDetails(DEFAULT_GROUP_DETAILS);
    onClose(true);
  };

  const handleAllProductionsToggle = (e) => {
    setIsFormDirty(true);
    setAllProductionsChecked(e.target.checked);
    const updatedProductions = groupDetails.productions.map((p) => ({ ...p, checked: e.target.checked }));
    setGroupDetails({ ...groupDetails, productions: updatedProductions });
  };

  const handleModalClose = () => {
    isFormDirty ? setShowConfirmationDialog(true) : onClose();
  };

  return isSignUpLoaded ? (
    <>
      <PopupModal
        show={visible}
        onClose={handleModalClose}
        titleClass="text-xl text-primary-navy text-bold"
        title={selectedGroup ? 'Edit Permission Group' : 'Set Up Permission Group'}
        panelClass="relative"
        hasOverlay={false}
      >
        <div className="w-[640px] h-full max-h-[95vh]">
          <div className="flex flex-col w-full gap-1 mb-4">
            <div className="w-full">
              <TextInput
                name="firstName"
                placeholder="Enter Name of Group, e.g. Admin, Standard, Management"
                className="w-full"
                value={groupDetails.firstName}
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
                value={groupDetails.lastName}
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
                value={groupDetails.email}
                onChange={handleInputChange}
                testId="user-email"
              />
              <FormError error={validationErrors.email} className="mt-2 ml-2" />
            </div>
            <div className="w-full flex items-center justify-between">
              <div>
                <Label text="Password" required />
                <div className="flex items-center gap-3">
                  <TextInput
                    className="tracking-widest text-center"
                    name="password"
                    value={groupDetails.password}
                    disabled
                    testId="user-password"
                  />
                  <Button
                    disabled={!!selectedGroup}
                    onClick={() => setGroupDetails({ ...groupDetails, password: generateRandomHash(4) })}
                  >
                    Generate Password
                  </Button>
                </div>
                <FormError error={validationErrors.password} className="mt-2 ml-2" />
              </div>
              <div>
                <Label text="PIN" required />
                <div className="flex items-center gap-3">
                  <TextInput
                    testId="user-pin"
                    className="tracking-widest text-center w-24"
                    name="pin"
                    value={groupDetails.pin}
                    disabled
                  />
                  <Button onClick={() => setGroupDetails({ ...groupDetails, pin: generateRandomHash(2) })}>
                    Generate PIN
                  </Button>
                </div>
                <FormError error={validationErrors.pin} className="mt-2 ml-2" />
              </div>
            </div>
          </div>
          <Checkbox
            className="mb-4"
            id="isSystemAdmin"
            testId="user-is-system-admin"
            checked={groupDetails.isSystemAdmin}
            labelClassName="font-semibold"
            label="This user wil be a System Administrator"
            onChange={(e) => setGroupDetails({ ...groupDetails, isSystemAdmin: e.target.checked })}
          />
          <div className="flex flex-row gap-4 w-full">
            <div className="w-full max-h-[400px] overflow-y-hidden">
              <h2 className="text-xl text-bold mb-2">Productions</h2>
              <div className="w-full max-h-[400px] overflow-y-auto">
                <Checkbox
                  id="allProductions"
                  name="allProductions"
                  label="All Productions"
                  checked={allProductionsChecked}
                  onChange={handleAllProductionsToggle}
                />
                {groupDetails.productions.map((production) => (
                  <Checkbox
                    key={production.id}
                    id={`${production.label}${production.id}`}
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
                  options={groupDetails.permissions}
                  onChange={(permissions) => setGroupDetails({ ...groupDetails, permissions })}
                  selectAllLabel="Select All Areas"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-5">
            <Button onClick={handleModalClose} variant="secondary">
              Cancel
            </Button>
            <Button onClick={saveUser}>Save and Close</Button>
          </div>
          <FormError error={error} className="mt-2 flex justify-end" variant="md" />
        </div>
      </PopupModal>
      {showConfirmationDialog && (
        <ConfirmationDialog
          testId="confirmation-dialog"
          show={showConfirmationDialog}
          onNoClick={() => setShowConfirmationDialog(false)}
          onYesClick={handleConfirmClick}
          hasOverlay={false}
          variant="leave"
        />
      )}
    </>
  ) : (
    <Spinner size="md" />
  );
};

export default AdEditPermissionGroup;
