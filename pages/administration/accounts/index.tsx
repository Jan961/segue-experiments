import Layout from 'components/Layout'
import { UserList } from 'components/accounts/manage-users/userList'

const Index = () => (
    <Layout title="Accounts | Segue">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mt-5 text-center">
            <span className="block xl:inline">Accounts</span>

        </h1>

        <UserList></UserList>
    </Layout>
)

export default Index
