
import Layout from '../../components/Layout'
import Switchboard from "../../components/reports/switchboard";
import Toolbar from "../../components/reports/toolbar";
const Index = () => (
    <Layout title="ShowId | Segue">
        <div className="flex flex-col flex-auto">
        <Toolbar></Toolbar>

        <Switchboard></Switchboard>
        </div>
    </Layout>
)

export default Index
