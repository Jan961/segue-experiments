import { Button, Checkbox, ConfirmationDialog, Label, PopupModal, Select, TextInput } from 'components/core-ui-lib';
import TreeSelect from 'components/global/TreeSelect';
import { TreeItemOption } from 'components/global/TreeSelect/types';
import { useEffect, useState } from 'react';
import { generateRandomHash } from 'utils/crypto';
import useUser from 'hooks/useUser';
import Spinner from 'components/core-ui-lib/Spinner';
import { newUserSchema } from 'validators/user';
import FormError from 'components/core-ui-lib/FormError';
import axios from 'axios';
import { PermissionGroup, Production } from './config';
import { isNullOrEmpty, mapRecursive } from 'utils';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { CustomOption } from 'components/core-ui-lib/Table/renderers/SelectCellRenderer';
import classNames from 'classnames';

type UserDetails = {
  accountUserId?: number;
  email: string;
  firstName: string;
  lastName: string;
  pin: string;
  password?: string;
  permissions: TreeItemOption[];
  accountId: number;
  isSystemAdmin: boolean;
  productions: Production[];
};

interface AdEditUserProps {
  permissions: TreeItemOption[];
  productions: Production[];
  onClose: (refresh?: boolean) => void;
  visible: boolean;
  selectedUser?: Partial<UserDetails>;
  groups: PermissionGroup[];
}

const DEFAULT_USER_DETAILS: UserDetails = {
  accountId: NaN,
  email: '',
  firstName: '',
  lastName: '',
  pin: '',
  password: '',
  permissions: [],
  productions: [],
  isSystemAdmin: false,
};

const AdEditUser = ({ visible, onClose, permissions, productions = [], selectedUser, groups }: AdEditUserProps) => {
  const [userDetails, setUserDetails] = useState<UserDetails>(DEFAULT_USER_DETAILS);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [allProductionsChecked, setAllProductionsChecked] = useState(false);
  const [permissionGroups, setPermissionGroups] = useState<SelectOption[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const { isSignUpLoaded, isBusy, createUser, updateUser, error } = useUser();

  const handleInputChange = (e) => {
    setIsFormDirty(true);
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const applyPermissionsForSelectedGroups = () => {
    const permissionsForSelectedGroups = groups
      .filter(({ groupId }) => selectedGroups.includes(groupId))
      .map(({ permissions }) => permissions);

    const perms = [...permissions];
    const updatedPermissions = permissionsForSelectedGroups.reduce((acc, p) => {
      const updatedPermissions = mapRecursive(acc, (o) => {
        const value = p.find((v) => v.id === Number(o.id));
        return { ...o, checked: !!value || o.checked };
      });

      acc = updatedPermissions;
      return acc;
    }, perms);

    setUserDetails((prev) => ({ ...prev, permissions: updatedPermissions }));
  };

  useEffect(() => {
    if (!selectedUser) {
      setUserDetails((prev) => ({ ...prev, productions, permissions }));
    }
  }, [productions, permissions, selectedUser]);

  useEffect(() => {
    if (isNullOrEmpty(selectedGroups)) {
      setUserDetails((prev) => ({ ...prev, permissions }));
    } else {
      applyPermissionsForSelectedGroups();
    }
  }, [selectedGroups]);

  useEffect(() => {
    if (!isNullOrEmpty(groups)) {
      setPermissionGroups(
        groups.map((g: PermissionGroup) => ({
          text: g.groupName,
          value: g.groupId.toString(),
        })),
      );
    }
  }, [groups]);

  const fetchPermissionsForSelectedUser = async () => {
    const { data } = await axios.get(`/api/admin/user-permissions/${selectedUser.accountUserId}`);
    const prodPermissions = productions.map((p) => (data.productions.includes(p.id) ? { ...p, checked: true } : p));
    const userPermissions = permissions.map((p) => (data.permissions.includes(p.id) ? { ...p, checked: true } : p));
    setUserDetails({
      accountId: selectedUser.accountId,
      accountUserId: selectedUser.accountUserId,
      email: selectedUser.email,
      firstName: selectedUser.firstName,
      lastName: selectedUser.lastName,
      pin: data.pin,
      password: 'xxxx',
      permissions: userPermissions,
      productions: prodPermissions,
      isSystemAdmin: data.isAdmin,
    });
  };

  useEffect(() => {
    if (selectedUser) {
      fetchPermissionsForSelectedUser();
    }
  }, [selectedUser, productions]);

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
      return false;
    }
  }

  const handleProductionToggle = (e) => {
    setIsFormDirty(true);
    const { id, checked } = e.target;
    const updatedProductions = userDetails.productions.map((p) => ({
      ...p,
      checked: p.id === id ? checked : p.checked,
    }));

    setUserDetails((prev) => ({ ...prev, productions: updatedProductions }));
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
    const permissions = userDetails.permissions
      .flatMap((perm) => [perm, ...perm.options])
      .filter(({ checked }) => checked)
      .map(({ id }) => id);

    const selectedProductions = userDetails.productions.filter(({ checked }) => checked).map(({ id }) => id);
    const payload = { ...userDetails, permissions, productions: selectedProductions };
    const success = selectedUser ? await updateUser(payload) : await createUser(payload);
    if (!success) {
      return;
    }
    // reset the state
    setUserDetails(DEFAULT_USER_DETAILS);
    onClose(true);
  };

  const handleAllProductionsToggle = (e) => {
    setIsFormDirty(true);
    setAllProductionsChecked(e.target.checked);
    const updatedProductions = userDetails.productions.map((p) => ({ ...p, checked: e.target.checked }));
    setUserDetails({ ...userDetails, productions: updatedProductions });
  };

  const handleIsSystemAdminToggle = (e) => {
    const checked = e.target.checked;
    const updatedProductions = userDetails.productions.map((p) => ({ ...p, checked }));
    const updatedPermissions = mapRecursive(userDetails.permissions, (o) => ({ ...o, checked }));
    setAllProductionsChecked(checked);
    setUserDetails({
      ...userDetails,
      isSystemAdmin: checked,
      permissions: updatedPermissions,
      productions: updatedProductions,
    });
  };

  const handleModalClose = () => {
    isFormDirty ? setShowConfirmationDialog(true) : onClose();
  };

  return isSignUpLoaded || isBusy ? (
    <>
      <PopupModal
        show={visible}
        onClose={handleModalClose}
        titleClass="text-xl text-primary-navy text-bold"
        title={selectedUser ? 'Edit User' : 'New User'}
        panelClass="relative"
        hasOverlay={false}
      >
        <div className="w-[640px] h-full max-h-[95vh]">
          <div className="flex flex-col w-full gap-1 mb-4">
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
            <div className="mt-2 w-full flex items-center gap-3">
              <Label text="PIN" required />
              <div className="flex items-center gap-3">
                <TextInput
                  testId="user-pin"
                  className="tracking-widest text-center w-24"
                  name="pin"
                  value={userDetails.pin}
                  disabled
                />
                <Button
                  onClick={() => setUserDetails({ ...userDetails, pin: generateRandomHash(2) })}
                  testId="generate-pin-button"
                >
                  Generate PIN
                </Button>
              </div>
              <FormError error={validationErrors.pin} className="ml-2" />
            </div>
            <div className="mt-5">
              <div>
                <Label text="Add to Permission Group(s)*" variant="lg" />
                <Label text="Optional" variant="sm" />
              </div>

              <Select
                isMulti
                renderOption={(option) => <CustomOption option={option} isMulti />}
                options={permissionGroups}
                onChange={(values: string[]) => setSelectedGroups(values.map((v) => Number(v)))}
              />
            </div>
          </div>

          <Checkbox
            className="mb-4"
            id="isSystemAdmin"
            testId="user-is-system-admin"
            checked={userDetails.isSystemAdmin}
            labelClassName="font-semibold"
            label="This user will be a System Administrator"
            onChange={handleIsSystemAdminToggle}
          />
          <div className="flex flex-row gap-4 w-full">
            <div className="w-full max-h-[400px] overflow-y-hidden">
              <h2 className="text-xl text-bold mb-2">Productions</h2>
              {!isNullOrEmpty(userDetails.productions) ? (
                <div className="w-full max-h-[400px] overflow-y-auto">
                  <Checkbox
                    className="p-1"
                    id="allProductions"
                    name="allProductions"
                    label="All Productions"
                    checked={allProductionsChecked}
                    onChange={handleAllProductionsToggle}
                    testId="all-productions-checkbox"
                  />
                  {userDetails.productions.map((production) => (
                    <div
                      className={classNames('p-1', 'w-full', production.isArchived ? 'bg-secondary-list-row' : '')}
                      key={production.id}
                    >
                      <Checkbox
                        id={production.id}
                        name={production.id}
                        label={`${production.label}${production.isArchived ? ' (A)' : ''}`}
                        checked={production.checked}
                        onChange={handleProductionToggle}
                        testId={`${production.label}-checkbox`}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <Label text="No productions have been added to this account" />
              )}
            </div>
            <div className="w-full max-h-[400px]  overflow-y-hidden">
              <h2 className="text-xl text-bold mb-2">Permissions</h2>
              <div className="w-full max-h-[400px] overflow-y-auto">
                <TreeSelect
                  options={userDetails.permissions}
                  onChange={(permissions) => setUserDetails({ ...userDetails, permissions })}
                  selectAllLabel="Select All Areas"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-5">
            <Button onClick={handleModalClose} variant="secondary" testId="cancel-edited-user-info">
              Cancel
            </Button>
            <Button onClick={saveUser} testId="save-edited-user-info">
              Save and Close
            </Button>
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
    <div className="inset-0 absolute bg-white bg-opacity-50 z-50 flex justify-center items-center top-20 left-20 right-20 bottom-20">
      <Spinner size="lg" />
    </div>
  );
};

export default AdEditUser;
