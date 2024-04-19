import Layout from 'components/Layout';
import Toolbar from 'components/marketing/activity/toolbar';
import { useState } from 'react';
import GlobalActivites from 'components/marketing/activity/globa';
import GlobalToolbar from 'components/toolbar';

const Index = () => {
  const [searchFilter, setSearchFilter] = useState('');

  return (
    <Layout title="Global Activites | Segue">
      <div className="flex flex-col px-4 flex-auto">
        <GlobalToolbar
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          title={'Global Activities'}
         />
        <Toolbar />
        {/* <SideMenu></SideMenu> */}
        <GlobalActivites />
      </div>
    </Layout>
  );
};

export default Index;
