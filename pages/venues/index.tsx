import Link from 'next/link'
import Layout from '../../components/Layout'

import Toolbar from "../../components/reports/toolbar";
import Admin from "../../components/venues/admin";
const Index = () => (
    <Layout title="Admin Global Venues| Segue">
        <Toolbar></Toolbar>
        <div className="flex flex-auto">
            <Admin></Admin>

        </div>
    </Layout>
)

export default Index
