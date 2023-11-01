import Layout from 'components/Layout';
import Toolbar from 'components/marketing/activity/toolbar';
import { useState } from 'react';
import GlobalActivites from 'components/marketing/activity/globa';
import GlobalToolbar from 'components/toolbar';
import { Show } from 'interfaces';

type Props = {
  items: Show[];
};

const Index = ({ items }: Props) => {
  const [searchFilter, setSearchFilter] = useState('');

  return (
    <Layout title="Global Activites | Seque">
      <div className="flex flex-col px-4 flex-auto">
        <GlobalToolbar
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          title={'Global Activities'}
        ></GlobalToolbar>
        <Toolbar title={'Global Activities'}></Toolbar>
        {/* <SideMenu></SideMenu> */}
        <GlobalActivites></GlobalActivites>
      </div>
    </Layout>
  );
};

export default Index;
