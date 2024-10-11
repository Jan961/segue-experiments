import { Button, ConfirmationDialog, PopupModal, TextInput } from 'components/core-ui-lib';
import TreeSelect from 'components/global/TreeSelect';
import { TreeItemOption } from 'components/global/TreeSelect/types';
import { useEffect, useState } from 'react';
import FormError from 'components/core-ui-lib/FormError';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { userPermissionsState } from 'state/account/userPermissionsState';
import { PermissionGroup } from './config';
import { flattenHierarchicalOptions } from 'utils';

type GroupDetails = {
  groupName: string;
  permissions: TreeItemOption[];
};

interface AdEditPermissionGroupProps {
  permissions: TreeItemOption[];
  groups: PermissionGroup[];
  onClose: (refresh?: boolean) => void;
  visible: boolean;
  selectedGroup?: Partial<GroupDetails>;
}

const DEFAULT_GROUP_DETAILS: GroupDetails = {
  groupName: '',
  permissions: [],
};

const AdEditPermissionGroup = ({
  visible,
  onClose,
  permissions,
  selectedGroup,
  groups = [],
}: AdEditPermissionGroupProps) => {
  const { accountId } = useRecoilValue(userPermissionsState);
  const [groupDetails, setGroupDetails] = useState<GroupDetails>(DEFAULT_GROUP_DETAILS);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e) => {
    setIsFormDirty(true);
    setGroupDetails({ ...groupDetails, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (selectedGroup) {
      setGroupDetails(selectedGroup as GroupDetails);
    } else {
      setGroupDetails((prev) => ({ ...prev, permissions }));
    }
  }, [permissions, selectedGroup]);

  const handleConfirmClick = () => {
    setShowConfirmationDialog(false);
    onClose();
  };

  const savePermissionGroup = async (isNew = true) => {
    if (!groupDetails.groupName) {
      setValidationErrors({ groupName: 'Group name is required' });
      return;
    }
    // check if group name already exists if it is a new group
    if (isNew) {
      const existingGroup = groups.find(
        (g) => g.groupName.trim().toLowerCase() === groupDetails.groupName.trim().toLowerCase(),
      );
      if (existingGroup) {
        setValidationErrors({ groupName: 'Group name already exists' });
        return;
      }
    }

    try {
      const permissions = flattenHierarchicalOptions(groupDetails.permissions)
        .filter(({ checked }) => checked)
        .map(({ id }) => id);

      const payload = { ...groupDetails, permissions };
      await axios.post(`/api/admin/permissions-group/${isNew ? 'create' : 'update'}`, {
        permissionGroup: payload,
        accountId,
      });
    } catch (error) {
      console.log(error);
    }
    setGroupDetails(DEFAULT_GROUP_DETAILS);
    onClose(true);
  };

  const handlePermissionsSelected = (permissions: TreeItemOption[]) => {
    setIsFormDirty(true);
    setGroupDetails({ ...groupDetails, permissions });
  };

  const handleModalClose = () => {
    isFormDirty ? setShowConfirmationDialog(true) : onClose();
  };

  return (
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
                name="groupName"
                placeholder="Enter Name of Group, e.g. Admin; Bookings; Marketing Team"
                className="w-full"
                value={groupDetails.groupName}
                onChange={handleInputChange}
                testId="permission-group-name"
              />
              <FormError error={validationErrors.groupName} className="mt-2 ml-2" />
            </div>
          </div>
          <div className="flex flex-row gap-4 w-full">
            <div className="w-full max-h-[400px]  overflow-y-hidden">
              <h2 className="text-xl text-bold mb-2">Permissions</h2>
              <div className="w-full max-h-[400px] overflow-y-auto">
                <TreeSelect
                  options={groupDetails.permissions}
                  onChange={handlePermissionsSelected}
                  selectAllLabel="Select All Areas"
                />
              </div>
            </div>
          </div>
          {selectedGroup && (
            <div className="flex justify-end mt-5">
              <Button onClick={() => savePermissionGroup()}>Save as New Permission Group</Button>
            </div>
          )}
          <div className="flex justify-end gap-4 mt-5">
            <Button onClick={handleModalClose} variant="secondary">
              Cancel
            </Button>
            <Button onClick={() => savePermissionGroup(!selectedGroup)}>Save and Close</Button>
          </div>
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
  );
};

export default AdEditPermissionGroup;
