import Layout from 'components/Layout'
import Licence from 'components/accounts/manage-users/licence'
import { UserList } from 'components/accounts/manage-users/userList'

const Index = () => (
    <Layout title="Account | Segue">
        <h1 className="text-5xl font-semibold tracking-tight text-primary-orange sm:text-5xl md:text-5xl mt-5 text-center">
            <span className="block xl:inline">Manage Users</span>

        </h1>
        <Licence></Licence>
        <UserList></UserList>
    </Layout>
)

export default Index
