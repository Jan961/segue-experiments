import { PopupModal } from 'components/core-ui-lib';
import TreeSelect from 'components/global/TreeSelect';
import { TreeItemOption } from 'components/global/TreeSelect/types';

interface AdEditUserProps {
  permissions: TreeItemOption[];
  state: any;
  onClose: () => void;
  visible: boolean;
}

const AdEditUser = ({ visible, onClose, permissions }: AdEditUserProps) => {
  console.log('AddEditUser', permissions);
  return (
    <PopupModal
      show={visible}
      onClose={onClose}
      titleClass="text-xl text-primary-navy text-bold"
      title="Add/Edit User"
      panelClass="relative"
      hasOverlay={false}
    >
      <div className="w-full h-full">
        <TreeSelect options={permissions} onChange={null} />
      </div>
    </PopupModal>
  );
};

export default AdEditUser;
