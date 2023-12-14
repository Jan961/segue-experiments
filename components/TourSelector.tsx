import { TourDTO } from 'interfaces';
import TourList from './tours/TourList';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Tab } from '@headlessui/react';
import archived from 'pages/api/marketing/sales/read/archived';
import { title } from 'radash';
import Layout from './Layout';
import { BreadCrumb } from './global/BreadCrumb';
import { MenuButton } from './global/MenuButton';
import { SearchBox } from './global/SearchBox';
import { StyledTab } from './global/StyledTabs';
import { useRouter } from 'next/router';
import React from 'react';

interface TourSelectorProps {
  tours: TourDTO[];
  ToolbarButtons?: JSX.Element;
}

export const TourSelector = ({ tours }: TourSelectorProps) => {
  const [search, setSearch] = React.useState('');
  const router = useRouter();
  const path = router.pathname.split('/')[1];

  const active = [];
  const archived = [];

  const query = search.toLowerCase();

  for (const t of tours) {
    if (t.Code?.toLowerCase().includes(query) || t.ShowName?.toLowerCase().includes(query)) {
      if (t.IsArchived) archived.push(t);
      else active.push(t);
    }
  }

  return (
    <Layout title="Shows | Segue">
      <div className="float-right">
        <SearchBox onChange={(e) => setSearch(e.target.value)} value={search} />
      </div>
      <BreadCrumb>
        <BreadCrumb.Item href="/">Home</BreadCrumb.Item>
        <BreadCrumb.Item>{title(path)}</BreadCrumb.Item>
      </BreadCrumb>
      <Tab.Group className="max-w-screen-md mx-auto" as="div">
        <Tab.List className="mb-2">
          <StyledTab>Active ({active.length})</StyledTab>
          <StyledTab>Archived ({archived.length})</StyledTab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <TourList items={active} showDateBlock={false} />
          </Tab.Panel>
          <Tab.Panel>
            <TourList items={archived} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </Layout>
  );
};
