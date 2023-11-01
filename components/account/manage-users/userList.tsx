import { Table } from 'components/global/table/Table';
import UserListItem from './userListItem';
import { useRecoilValue } from 'recoil';
import { userState } from 'state/account/userState';

export const UserList = () => {
  const users = useRecoilValue(userState);
  const userList = Object.values(users);

  return (
    <Table className="my-8 mt-2">
      <Table.HeaderRow bg="bg-primary-orange">
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Email</Table.HeaderCell>
      </Table.HeaderRow>
      <Table.Body>
        {userList.map((user) => (
          <UserListItem key={user.UserId} data={user} />
        ))}
      </Table.Body>
    </Table>
  );
};
