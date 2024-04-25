import Layout from 'components/Layout';
import { SearchBox } from 'components/global/SearchBox';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { MenuButton } from 'components/global/MenuButton';
import { Tab } from '@headlessui/react';
import { StyledTab } from 'components/global/StyledTabs';
import ProductionList from 'components/productions/ProductionList';
import { ProductionDTO } from 'interfaces';
import { BreadCrumb } from 'components/global/BreadCrumb';
import React from 'react';

interface Props {
  productions?: ProductionDTO[];
  code?: string;
  name?: string;
}

export const Productions = ({ code, productions = [], name }: Props) => {
  const [query, setQuery] = React.useState('');
  const active = [];
  const archived = [];

  for (const production of productions) {
    if (production.Code?.toLowerCase().includes(query) || production.ShowName?.toLowerCase().includes(query)) {
      if (production.IsArchived) archived.push(production);
      else active.push(production);
    }
  }

  return (
    <Layout title="Productions | Segue">
      <div className="float-right">
        <SearchBox onChange={(e) => setQuery(e.target.value)} value={query} />
        <MenuButton href={`/account/shows/${code}/create`} iconRight={faPlus}>
          Add Production
        </MenuButton>
      </div>
      <BreadCrumb>
        <BreadCrumb.Item href="/">Home</BreadCrumb.Item>
        <BreadCrumb.Item href={'/account'}>Account</BreadCrumb.Item>
        <BreadCrumb.Item href={'/account/shows/'}>Shows</BreadCrumb.Item>
        <BreadCrumb.Item>{name}</BreadCrumb.Item>
      </BreadCrumb>
      <Tab.Group className="max-w-screen-md mx-auto" as="div">
        <Tab.List className="mb-2">
          <StyledTab>Active ({active.length})</StyledTab>
          <StyledTab>Archived ({archived.length})</StyledTab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <ProductionList items={active} editable />
          </Tab.Panel>
          <Tab.Panel>
            <ProductionList items={archived} editable />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </Layout>
  );
};
