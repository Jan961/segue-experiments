import { styleProps, usersColDef } from 'components/admin/tableConfig';
import { Button, Table } from 'components/core-ui-lib';
import Layout from 'components/Layout';
import useAxios from 'hooks/useAxios';
import { useEffect, useState } from 'react';

export default function Users() {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);

  const { fetchData } = useAxios();

  const toggleModal = (type, data) => {
    console.log('table data: ', type, data);
  };

  const populateUserTable = async () => {
    const users = await fetchData({
      url: '/api/admin/users/read',
      method: 'GET',
    });

    if (Array.isArray(users)) {
      setColDefs(usersColDef(toggleModal));
      setRowData(
        users.map((user) => {
          const firstname = user.UserFirstName === null ? '' : user.UserFirstName;
          const lastname = user.UserLastName === null ? '' : user.UserLastName;

          return {
            name: firstname + ' ' + lastname,
            email: user.UserEmail,
            permissionDesc: user.AllPermissions,
            license: 'to be added later',
          };
        }),
      );
    }
  };

  useEffect(() => {
    populateUserTable();
  });

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

      <div className="flex flex-row" />

      <div className="flex flex-row" />

      <Table testId="admin-users-table" columnDefs={colDefs} rowData={rowData} styleProps={styleProps} />
    </Layout>
  );
}
