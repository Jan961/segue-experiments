import Layout from 'components/Layout'
import { UserList } from 'components/account/manage-users/userList'
import { CreateUserModal } from 'components/account/modal/CreateUserModal'
import { GetServerSideProps } from 'next'
import { getAccountIdFromReq, getUsers } from 'services/userService'

interface Props {
  users: any[]
}

const Index = ({ users }: Props) => (
  <Layout title="Account | Segue">
    <h1 className="text-5xl font-semibold tracking-tight text-primary-orange sm:text-5xl md:text-5xl mt-5 text-center">
      <span className="block xl:inline">Users</span>
    </h1>
    <div className="max-w-xl mx-auto">
      <CreateUserModal />
      <UserList users={users}/>
    </div>
  </Layout>
)

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const accountId = await getAccountIdFromReq(ctx.req)
  const users = await getUsers(accountId)

  return {
    props: {
      users
    }
  }
}

export default Index
