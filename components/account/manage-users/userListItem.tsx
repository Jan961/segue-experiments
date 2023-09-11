import { StyledDialog } from 'components/global/StyledDialog'
import { UserDto } from 'interfaces'
import React from 'react'
import { UserEditor } from '../editors/UserEditor'
import { Table } from 'components/global/table/Table'

type Props = {
  data: UserDto;
}

// @ts-ignore
// @ts-ignore
const UserListItem = ({ data }: Props) => {
  const [modalOpen, setModalOpen] = React.useState(false)

  return (
    <Table.Row hover onClick={() => setModalOpen(true)}>
      <Table.Cell>
        <StyledDialog title='Edit User' open={modalOpen} onClose={() => setModalOpen(false)}>
          <UserEditor user={data} triggerClose={() => setModalOpen(false)} />
        </StyledDialog>
        {data.Name}
      </Table.Cell>
      <Table.Cell>
        {data.Email}
      </Table.Cell>
    </Table.Row>
  )
}

export default UserListItem
