import Layout from '../../components/Layout'
import Salesmarketsearch from '../../components/reports/sales/salesmarketsearch'
import SalesMarketingSummary from '../../components/reports/modals/SalesMarketingSummary'

const ShowId = () => (
  <Layout title="ShowId | Segue">
    <div className="flex flex-auto">
      <SalesMarketingSummary></SalesMarketingSummary>
      <Salesmarketsearch></Salesmarketsearch>
    </div>
  </Layout>
)

export default ShowId
