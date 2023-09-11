type Props = {
  data: any;
}

// @ts-ignore
// @ts-ignore
const UserListItem = ({ data }: Props) => (
  <tr>
    <td className="whitespace-nowrap py-4 pr-3 text-sm text-gray-900 pl-4 border-r border-1 border-soft-table-row-separation">
      {data.Name}
    </td>
    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 pl-4 border-r border-1 border-soft-table-row-separation">
      {data.Email}
    </td>
  </tr>
)

export default UserListItem
