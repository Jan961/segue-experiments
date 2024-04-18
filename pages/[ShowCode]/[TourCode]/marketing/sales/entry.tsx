import Layout from 'components/Layout';
import Toolbar from 'components/marketing/venue/toolbar';
import SideMenu from 'components/sideMenu';
import { Show } from 'interfaces';
import EmailLoader from 'components/marketing/sales/email-loader';
import Entry from 'components/marketing/sales/entry';

type Props = {
  items: Show[];
};
const pagetitle = 'Marketing - Sale Entry';

const Index = ({ items }: Props) => (
  <Layout title={pagetitle + '| Segue'}>
    <Toolbar title={pagetitle} searchFilter={''}></Toolbar>
    <div className="flex flex-auto">
      <SideMenu></SideMenu>
      <Entry searchFilter={''}></Entry>
      <EmailLoader></EmailLoader>
    </div>
  </Layout>
);

export default Index;
