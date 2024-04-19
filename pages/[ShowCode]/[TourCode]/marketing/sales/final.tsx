import Layout from 'components/Layout';
import Toolbar from 'components/marketing/venue/toolbar';
import SideMenu from 'components/sideMenu';
import EmailLoader from 'components/marketing/sales/email-loader';
import FinalSales from 'components/marketing/sales/final';

const pagetitle = 'Marketing - Sale Entry';

const Index = () => (
  <Layout title={pagetitle + '| Segue'}>
    <Toolbar title={pagetitle} searchFilter={''} />
    <div className="flex flex-auto">
      <SideMenu />
      <FinalSales />
      <EmailLoader />
    </div>
  </Layout>
);

export default Index;
