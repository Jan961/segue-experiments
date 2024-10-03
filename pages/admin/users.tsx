import axios from 'axios';
import { permissionGroupColDef, styleProps, usersColDef } from 'components/admin/tableConfig';
import { Button, ConfirmationDialog, Table } from 'components/core-ui-lib';
import AddEditUser from 'components/admin/modals/AddEditUser';
import AddEditPermissionGroup from 'components/admin/modals/AddEditPermissionGroup';
import Layout from 'components/Layout';
import { useEffect, useRef, useState } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType, NextApiRequest } from 'next';
import { getPermissionGroupsList, getPermissionsList } from 'services/permissionService';
import { getAllProductions } from 'services/productionService';
import { useRouter } from 'next/router';
import { mapRecursive } from 'utils';
import { TreeItemOption } from 'components/global/TreeSelect/types';
import { dateBlockMapper } from 'lib/mappers';

export default function Users({
  permissionsList,
  productionsList,
  permisisonGroups,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const deleteType = useRef<'user' | 'group'>(null);
  const [userRowData, setUserRowData] = useState([]);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showPermissionGroupModal, setShowPermissionGroupModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const router = useRouter();

  const populateUserTable = async () => {
    try {
      const users = await axios.get('/api/admin/users/read');

      if (Array.isArray(users.data)) {
        setUserRowData(
          users.data
            .map((user) => {
              const firstName = user.UserFirstName || '';
              const lastName = user.UserLastName || '';

              return {
                accountUserId: user.AccUserId,
                firstName,
                lastName,
                name: `${firstName} ${lastName}`,
                email: user.UserEmail,
                permissionDesc: user.AllPermissions,
                licence: 'Standard',
              };
            })
            .sort((a, b) => a.lastName.localeCompare(b.lastName)),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updatePermissions = (options: TreeItemOption[], values: TreeItemOption[]) => {
    const updatedOptions = mapRecursive(options, (o) => {
      const value = values.find((v) => v.id === o.id);
      return { ...o, checked: !!value };
    });
    return updatedOptions;
  };

  useEffect(() => {
    if (userRowData.length === 0) {
      populateUserTable();
    }
  }, [userRowData]);

  const handleUsersModalClose = (refresh = false) => {
    setSelectedUser(null);
    setShowUsersModal(false);
    if (refresh) {
      populateUserTable();
    }
  };

  const handlePermissionGroupModalClose = (refresh = false) => {
    setSelectedGroup(null);
    setShowPermissionGroupModal(false);
    if (refresh) {
      router.replace(router.asPath);
    }
  };

  const handleUserEdit = async (type, data) => {
    if (type === 'edit') {
      setSelectedUser(data);
      setShowUsersModal(true);
    } else if (type === 'delete') {
      deleteType.current = 'user';
      setSelectedGroup(data);
      setShowConfirmationDialog(true);
    }
  };

  const handlePermissionGroupEdit = async (type, data) => {
    if (type === 'edit') {
      const updatedPermissions = updatePermissions(permissionsList, data.permissions);
      setSelectedGroup({ ...data, permissions: updatedPermissions });
      setShowPermissionGroupModal(true);
    } else if (type === 'delete') {
      deleteType.current = 'group';
      setSelectedGroup(data);
      setShowConfirmationDialog(true);
    }
  };

  const deletePermissionGroup = async () => {
    await axios.delete('/api/admin/permissions-group/delete', {
      data: {
        groupId: selectedGroup.groupId,
      },
    });
    setSelectedGroup(null);
  };

  const deleteUser = async () => {
    // Add API call to deactivate user
    setSelectedUser(null);
  };

  const handleConfirmClick = async () => {
    setShowConfirmationDialog(false);
    deleteType.current === 'user' ? deleteUser() : deletePermissionGroup();
    router.replace(router.asPath);
  };

  return (
    <Layout title="Users | Segue" flush>
      <h1 className="mt-3 text-4xl font-bold text-primary-pink">Users</h1>

      <div className="flex flex-row my-3">
        <div className="flex flex-col">
          <div className="text-primary-navy text-xl font-bold">Number of User Licences</div>
        </div>
        <div className="flex flex-col">
          <Button className="ml-4 w-32 mr-1" variant="primary" text="Add Licences" testId="add-licences-button" />
        </div>
      </div>

      <div className="flex flex-row">
        <div className="flex flex-col mr-2">
          <div className="text-base primary-dark-blue">Total Number of Full Licences:</div>
        </div>
        <div className="flex flex-col mr-[60px]">
          <div className="text-base primary-dark-blue font-bold" data-testid="no-of-full-licences">
            0
          </div>
        </div>

        <div className="flex flex-col mr-2">
          <div className="text-base primary-dark-blue">Total Number of Touring Management Licences:</div>
        </div>
        <div className="flex flex-col">
          <div className="text-base primary-dark-blue font-bold" data-testid="no-of-touring-licences">
            0
          </div>
        </div>
      </div>

      <div className="flex flex-row">
        <div className="flex flex-col mr-2">
          <div className="text-base primary-dark-blue">Total Number of Full Licences Used:</div>
        </div>
        <div className="flex flex-col mr-[24px]">
          <div className="text-base primary-dark-blue font-bold" data-testid="no-of-full-licences-used">
            0
          </div>
        </div>

        <div className="flex flex-col mr-2">
          <div className="text-base primary-dark-blue">Total Number of Touring Management Licences Used:</div>
        </div>
        <div className="flex flex-col">
          <div className="text-base primary-dark-blue font-bold" data-testid="no-of-touring-licences-used">
            0
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-between items-center my-4">
        <div className="text-primary-navy text-xl font-bold">All Users</div>
        <div className="flex flex-row gap-4">
          <Button
            className="px-8 mt-2 -mb-1"
            variant="secondary"
            text="Add New Touring Management User"
            testId="add-new-touring-mgmt-user-button"
          />
          <Button
            className="px-8 mt-2 -mb-1"
            variant="secondary"
            text="Add New Full User"
            onClick={() => setShowUsersModal(true)}
            testId="add-new-full-user-button"
          />
        </div>
      </div>

      <Table
        testId="admin-users-table"
        columnDefs={usersColDef(handleUserEdit)}
        rowData={userRowData}
        styleProps={styleProps}
        tableHeight={300}
      />

      <div className="flex justify-end mt-5 mb-5">
        <div className="w-[700px]">
          <div className="flex flex-row justify-between items-center my-4">
            <div className="text-primary-navy text-xl font-bold">Your Permission Groups</div>
            <div className="flex flex-row gap-4">
              <Button
                className="px-8 mt-2 -mb-1"
                variant="secondary"
                text="Add New Permission Group"
                onClick={() => setShowPermissionGroupModal(true)}
                testId="add-new-permission-group-button"
              />
            </div>
          </div>

          <Table
            testId="admin-permission-group-table"
            columnDefs={permissionGroupColDef(handlePermissionGroupEdit)}
            rowData={permisisonGroups}
            styleProps={styleProps}
            tableHeight={300}
            gridOptions={{ suppressHorizontalScroll: true }}
          />
        </div>
      </div>
      {showUsersModal && (
        <AddEditUser
          visible={showUsersModal}
          onClose={handleUsersModalClose}
          permissions={permissionsList}
          productions={productionsList}
          selectedUser={selectedUser}
          groups={permisisonGroups}
        />
      )}
      {showPermissionGroupModal && (
        <AddEditPermissionGroup
          visible={showPermissionGroupModal}
          onClose={handlePermissionGroupModalClose}
          permissions={permissionsList}
          groups={permisisonGroups}
          selectedGroup={selectedGroup}
        />
      )}
      {showConfirmationDialog && (
        <ConfirmationDialog
          testId="confirmation-dialog"
          show={showConfirmationDialog}
          onNoClick={() => setShowConfirmationDialog(false)}
          onYesClick={handleConfirmClick}
          hasOverlay={false}
          variant="delete"
        />
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const permisisonGroups = await getPermissionGroupsList(ctx.req);
  const permissionsList = await getPermissionsList();
  const productions = await getAllProductions(ctx.req as NextApiRequest);

  const formattedProductions = productions
    .map((t: any) => {
      let db = t.DateBlock.find((block) => block.IsPrimary);
      if (db) {
        db = dateBlockMapper(db);
      }
      return {
        id: t.Id.toString(),
        code: t.Code,
        isArchived: t.IsArchived,
        showCode: t.Show.Code,
        showName: t.Show.Name,
        label: `${t.Show.Code}${t.Code} ${t.Show.Name}`,
        startDate: db?.StartDate || null,
        checked: false,
      };
    })
    .sort((a, b) => {
      if (a.isArchived !== b.isArchived) {
        return a.isArchived ? 1 : -1;
      }
      return new Date(a.startDate).valueOf() > new Date(b.startDate).valueOf();
    });

  return {
    props: {
      productionsList: formattedProductions || [],
      permissionsList: permissionsList || [],
      permisisonGroups: permisisonGroups || [],
    },
  };
};
