import Layout from 'components/Layout';
import Toolbar from 'components/marketing/activity/toolbar';
import SideMenu from 'components/sideMenu';
import { Show } from 'interfaces';
import GlobalActivites from 'components/marketing/activity/globa';

type Props = {
  items: Show[];
};

const Index = ({ items }: Props) => (
  <Layout title="Global Activites | Seque">
    <Toolbar title={'Global Activities'}></Toolbar>
    <div className="flex flex-auto">
      <SideMenu></SideMenu>
      <GlobalActivites></GlobalActivites>
    </div>
  </Layout>
);

export default Index;
