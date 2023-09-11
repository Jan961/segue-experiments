
import UserListItem from './userListItem'

interface UserListProps {
  users: any[]
}

export const UserList = ({ users }: UserListProps) => {
  return (
    <div className="my-8 mt-2">
      <table className="min-w-full table-fixed divide-y divide-gray-300 [&>tbody>*:nth-child(odd)]:bg-white [&>tbody>*:nth-child(even)]:bg-table-row-alternating">
        <thead className="bg-gray-50 text-sm">
          <tr>
            <th
              scope="col"
              className="border-r border-white border-1 bg-primary-orange text-left min-w-[12rem] py-2 px-3 text-white"
            >
                Name
            </th>
            <th
              scope="col"
              className="border-r border-white border-1 bg-primary-orange text-left min-w-[12rem] py-2 px-3 text-white"
            >
                Email
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <UserListItem key={user.UserId} data={user} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
