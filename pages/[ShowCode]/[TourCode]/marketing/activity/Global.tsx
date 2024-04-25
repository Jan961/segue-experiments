import Layout from 'components/Layout';
import Toolbar from 'components/marketing/activity/toolbar';
import SideMenu from 'components/sideMenu';
import GlobalActivites from 'components/marketing/activity/globa';

const Index = () => (
  <Layout title="Global Activites | Segue">
    <Toolbar />
    <div className="flex flex-auto">
      <SideMenu />
      <GlobalActivites />
    </div>
  </Layout>
);

export default Index;
