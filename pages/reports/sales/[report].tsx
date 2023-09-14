import Layout from 'components/Layout'
import Salesmarketsearch from 'components/reports/sales/salesmarketsearch'
import SalesSummaryExcel from 'components/reports/excelTemplates/salesSummaryExcel'

const ShowId = () => (
  <Layout title="ShowId | Segue">
    <div className="flex flex-auto">
      <SalesSummaryExcel></SalesSummaryExcel>
      <Salesmarketsearch></Salesmarketsearch>
    </div>
  </Layout>
)

export default ShowId
