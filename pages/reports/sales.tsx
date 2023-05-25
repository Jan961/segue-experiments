import Layout from '../../components/Layout'
import Toolbar from '../../components/reports/toolbar'
import Salesmarketsearch from '../../components/reports/sales/salesmarketsearch'
import SalesMarketingSummary from '../../components/reports/modals/SalesMarketingSummary'

const ShowId = () => (
  <Layout title="ShowId | Segue">
    <Toolbar></Toolbar>
    <div className="flex flex-auto">
      <SalesMarketingSummary></SalesMarketingSummary>
      <Salesmarketsearch></Salesmarketsearch>
    </div>
  </Layout>
)

export default ShowId
