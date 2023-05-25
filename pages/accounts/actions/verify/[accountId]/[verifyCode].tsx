import Layout from 'components/Layout'
import Switchboard from 'components/accounts/switchboard'

const Verify = () => (
  <Layout title="Account | Segue">
    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mt-5 text-center">
      <span className="block xl:inline">Account</span>

    </h1>
    <Switchboard></Switchboard>
  </Layout>
)

export default Verify
