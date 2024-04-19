import Layout from 'components/Layout';
import Toolbar from 'components/marketing/venue/toolbar';
import SideMenu from 'components/sideMenu';
import HistoryLoad from 'components/marketing/sales/historyload';
import TemplateHelper from 'components/marketing/sales/templates-helper';

const pagetitle = 'Marketing - Sale Entry';

const Index = () => (
  <Layout title={pagetitle + '| Segue'}>
    <Toolbar title={pagetitle} searchFilter={''} />
    <div className="flex flex-auto">
      <SideMenu />
      <HistoryLoad />
      <TemplateHelper />
    </div>
  </Layout>
);

export default Index;
