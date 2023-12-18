import { getAccountUsersList, getPermissionsList } from 'services/permissionService';

import TreeSelect from 'components/global/TreeSelect';
import { TreeItemOption, TreeItemSelectedOption } from 'components/global/TreeSelect/types';
import Layout from 'components/Layout';
import Typeahead, { TypeaheadOption } from 'components/global/forms/FormTypeahead';
import axios from 'axios';
import { useState } from 'react';
import { FormInputButton } from 'components/global/forms/FormInputButton';

export async function getServerSideProps() {
  const permissions = await getPermissionsList();
  const accountUsers = await getAccountUsersList();

  return { props: { permissions, accountUsers } };
}

interface AdminProps {
  permissions: TreeItemOption[];
  accountUsers: TypeaheadOption[];
}

const formatUserPermissions = (permArr = [], userPermArr = []) => {
  const formatted = permArr.map((perm) => {
    if (perm?.options && perm.options.length > 0) {
      perm.options.forEach((option) => {
        option.checked = !!userPermArr.find(({ PermissionId }) => PermissionId === option.id);
      });

      return perm;
    }
    return perm;
  });
  return formatted;
};

export default function Admin({ permissions = [], accountUsers = [] }: AdminProps) {
  const [userPermissions, setUserPermissions] = useState(permissions);
  const [user, setUser] = useState<string>();

  const fetchPermissionsForUser = async (Id) => {
    const results = await axios({
      method: 'GET',
      url: `/api/admin/userPermissions/${Id}`,
    });

    const formattedPermissions = formatUserPermissions(permissions, results.data);
    setUserPermissions([...formattedPermissions]);
  };

  const handleUserSelect = (Id) => {
    setUser(Id);
    fetchPermissionsForUser(Id);
  };

  const togglePermission = (perm: TreeItemSelectedOption) => {
    const updatePermissions = userPermissions.map((p) => {
      if (p.id === perm.parentId) {
        const updatedOptions = p.options.map((o) => {
          if (o.id === perm.id) {
            return { ...o, checked: perm.checked };
          }
          return o;
        });
        return { ...p, options: updatedOptions };
      }
      return p;
    });

    setUserPermissions(updatePermissions);
  };

  const handlePermissionsSave = async () => {
    await axios({
      method: 'POST',
      url: `/api/admin/userPermissions`,
      data: { user, userPermissions },
    });
  };

  return (
    <Layout title="Admin | Segue">
      <div className="mt-4 max-w-5xl mx-auto text-2xl text-primary-navy">
        <h1 className="mb-8 text-center">Admin</h1>
        <Typeahead options={accountUsers} onChange={handleUserSelect} />
        <div className={`mt-8 grid grid-cols-1 gap-x-8 gap-y-10 ${!user ? 'pointer-events-none opacity-80' : ''}`}>
          <TreeSelect options={userPermissions} onChange={togglePermission} />
          <div className="flex justify-end">
            <FormInputButton className="mr-4 w-24" onClick={() => fetchPermissionsForUser(user)} text="Reset" />
            <FormInputButton intent="PRIMARY" className="mr-4 w-24" onClick={handlePermissionsSave} text="Save" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
