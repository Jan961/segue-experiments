import axios from 'axios';
import { permissionGroupColDef, styleProps, usersColDef } from 'components/admin/tableConfig';
import { Button, Table } from 'components/core-ui-lib';
import Layout from 'components/Layout';
import { useEffect, useState } from 'react';

export default function Users() {
  const [userRowData, setUserRowData] = useState([]);

  const populateUserTable = async () => {
    try {
      const users = await axios.get('/api/admin/users/read');

      if (Array.isArray(users.data)) {
        setUserRowData(
          users.data.map((user) => {
            const firstname = user.UserFirstName || '';
            const lastname = user.UserLastName || '';

            return {
              name: `${firstname} ${lastname}`,
              email: user.UserEmail,
              permissionDesc: user.AllPermissions,
              licence: 'to be added later',
            };
          }),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userRowData.length === 0) {
      populateUserTable();
    }
  }, [userRowData]);

  return (
    <Layout title="Users | Segue" flush>
      <h1 className="mt-3 text-4xl font-bold text-primary-pink">Users</h1>

      <div className="flex flex-row my-3">
        <div className="flex flex-col">
          <div className="text-primary-navy text-xl font-bold">Number of User Licences</div>
        </div>
        <div className="flex flex-col">
          <Button className="ml-4 w-32 mr-1" variant="primary" text="Add Licences" />
        </div>
      </div>

      <div className="flex flex-row">
        <div className="flex flex-col mr-2">
          <div className="text-base primary-dark-blue">Total Number of Full Licences:</div>
        </div>
        <div className="flex flex-col mr-[60px]">
          <div className="text-base primary-dark-blue font-bold">0</div>
        </div>

        <div className="flex flex-col mr-2">
          <div className="text-base primary-dark-blue">Total Number of Touring Management Licences:</div>
        </div>
        <div className="flex flex-col">
          <div className="text-base primary-dark-blue font-bold">0</div>
        </div>
      </div>

      <div className="flex flex-row">
        <div className="flex flex-col mr-2">
          <div className="text-base primary-dark-blue">Total Number of Full Licences Used:</div>
        </div>
        <div className="flex flex-col mr-[24px]">
          <div className="text-base primary-dark-blue font-bold">0</div>
        </div>

        <div className="flex flex-col mr-2">
          <div className="text-base primary-dark-blue">Total Number of Touring Management Licences Used:</div>
        </div>
        <div className="flex flex-col">
          <div className="text-base primary-dark-blue font-bold">0</div>
        </div>
      </div>

      <div className="flex flex-row justify-between items-center my-4">
        <div className="text-primary-navy text-xl font-bold">All Users</div>
        <div className="flex flex-row gap-4">
          <Button className="px-8 mt-2 -mb-1" variant="secondary" text="Add New Touring Management User" />
          <Button className="px-8 mt-2 -mb-1" variant="secondary" text="Add New Full User" />
        </div>
      </div>

      <Table
        testId="admin-users-table"
        columnDefs={usersColDef(null)}
        rowData={userRowData}
        styleProps={styleProps}
        tableHeight={300}
      />

      <div className="flex justify-end mt-5">
        <div className="w-[700px]">
          <div className="flex flex-row justify-between items-center my-4">
            <div className="text-primary-navy text-xl font-bold">Your Permission Groups</div>
            <div className="flex flex-row gap-4">
              <Button className="px-8 mt-2 -mb-1" variant="secondary" text="Add New Permission Group" />
            </div>
          </div>

          <Table
            testId="admin-permission-group-table"
            columnDefs={permissionGroupColDef(null)}
            rowData={[]}
            styleProps={styleProps}
            tableHeight={300}
          />
        </div>
      </div>
    </Layout>
  );
}