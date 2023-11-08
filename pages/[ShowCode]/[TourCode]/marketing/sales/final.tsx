import Layout from 'components/Layout';
import Toolbar from 'components/marketing/venue/toolbar';
import SideMenu from 'components/sideMenu';
import { Show } from 'interfaces';
import EmailLoader from 'components/marketing/sales/email-loader';
import FinalSales from 'components/marketing/sales/final';

type Props = {
  items: Show[];
};
const pagetitle = 'Marketing - Sale Entry';

const Index = ({ items }: Props) => (
  <Layout title={pagetitle + '| Seque'}>
    <Toolbar title={pagetitle} searchFilter={''}></Toolbar>
    <div className="flex flex-auto">
      <SideMenu></SideMenu>
      <FinalSales></FinalSales>
      <EmailLoader></EmailLoader>
    </div>
  </Layout>
);

export default Index;
