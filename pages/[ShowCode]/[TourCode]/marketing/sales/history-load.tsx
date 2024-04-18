import Layout from 'components/Layout';
import Toolbar from 'components/marketing/venue/toolbar';
import SideMenu from 'components/sideMenu';
import { Show } from 'interfaces';
import HistoryLoad from 'components/marketing/sales/historyload';
import TemplateHelper from 'components/marketing/sales/templates-helper';

type Props = {
  items: Show[];
};
const pagetitle = 'Marketing - Sale Entry';

const Index = ({ items }: Props) => (
  <Layout title={pagetitle + '| Segue'}>
    <Toolbar title={pagetitle} searchFilter={''}></Toolbar>
    <div className="flex flex-auto">
      <SideMenu></SideMenu>
      <HistoryLoad></HistoryLoad>
      <TemplateHelper></TemplateHelper>
    </div>
  </Layout>
);

export default Index;
