import { Button, Checkbox, ConfirmationDialog, PopupModal, TextInput } from 'components/core-ui-lib';
import TreeSelect from 'components/global/TreeSelect';
import { TreeItemOption } from 'components/global/TreeSelect/types';
import { useEffect, useState } from 'react';
import FormError from 'components/core-ui-lib/FormError';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { userPermissionsState } from 'state/account/userPermissionsState';

type GroupDetails = {
  groupName: string;
  permissions: TreeItemOption[];
  productions: TreeItemOption[];
};

type PermissionGroup = {
  groupId: number;
  groupName: string;
  permissions: { id: number; name: string }[];
};

interface AdEditPermissionGroupProps {
  permissions: TreeItemOption[];
  productions: TreeItemOption[];
  groups: PermissionGroup[];
  onClose: (refresh?: boolean) => void;
  visible: boolean;
  selectedGroup?: Partial<GroupDetails>;
}

const DEFAULT_GROUP_DETAILS: GroupDetails = {
  groupName: '',
  permissions: [],
  productions: [],
};

const AdEditPermissionGroup = ({
  visible,
  onClose,
  permissions,
  productions = [],
  selectedGroup,
  groups = [],
}: AdEditPermissionGroupProps) => {
  const { accountId } = useRecoilValue(userPermissionsState);
  const [groupDetails, setGroupDetails] = useState<GroupDetails>(DEFAULT_GROUP_DETAILS);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [allProductionsChecked, setAllProductionsChecked] = useState(false);
  console.log(selectedGroup);
  const handleInputChange = (e) => {
    setIsFormDirty(true);
    setGroupDetails({ ...groupDetails, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (selectedGroup) {
      setGroupDetails({ groupName: selectedGroup.groupName, permissions, productions });
    }
  }, [productions, permissions, selectedGroup]);

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

  const savePermissionGroup = async () => {
    // check if group name already exists
    const existingGroup = groups.find(
      (g) => g.groupName.trim().toLowerCase() === groupDetails.groupName.trim().toLowerCase(),
    );
    if (existingGroup) {
      setValidationErrors({ groupName: 'Group name already exists' });
      return;
    }
    try {
      const permissions = groupDetails.permissions
        .flatMap((perm) => [perm, ...perm.options])
        .filter(({ checked }) => checked)
        .map(({ id }) => id);

      const selectedProductions = groupDetails.productions.filter(({ checked }) => checked).map(({ id }) => id);
      const payload = { ...groupDetails, permissions, productions: selectedProductions };
      await axios.post('/api/admin/permissions-group/create', { permissionGroup: payload, accountId });
    } catch (error) {
      console.log(error);
    }
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
                placeholder="Enter Name of Group, e.g. Admin, Standard, Management"
                className="w-full"
                value={groupDetails.groupName}
                onChange={handleInputChange}
                testId="permission-group-name"
              />
              <FormError error={validationErrors.groupName} className="mt-2 ml-2" />
            </div>
          </div>
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
                  values={selectedGroup?.permissions || []}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-5">
            <Button onClick={handleModalClose} variant="secondary">
              Cancel
            </Button>
            <Button onClick={savePermissionGroup}>Save and Close</Button>
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
