import Layout from 'components/Layout'
import Toolbar from 'components/marketing/venue/toolbar'
import SideMenu from 'components/sideMenu'
import Status from 'components/marketing/venue/status'

const Index = (Tour) => (
    <Layout title="Marketing | Seque">
        <Toolbar></Toolbar>
        <div className="flex flex-auto">
            <SideMenu></SideMenu>
            <Status searchFilter={""} ></Status>

        </div>
    </Layout>
)


export default Index


