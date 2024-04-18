import Layout from '../../../components/Layout';
import { useState } from 'react';
import Entry from '../../../components/marketing/sales/entry';
import { GetServerSideProps } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';
import { getActiveProductions } from 'services/productionService';

type Props = {
  activeProductions: any[];
};
const pagetitle = 'Marketing - Sale Entry';

const Index = ({ activeProductions }: Props) => {
  const [searchFilter] = useState('');

  return (
    <Layout title={pagetitle + '| Segue'}>
      <div className="flex flex-col flex-auto">
        <h1 className="mb-4 text-3xl font-bold text-primary-green ">{pagetitle + ' | Segue'}</h1>
        <Entry productions={activeProductions} searchFilter={searchFilter}></Entry>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const email = await getEmailFromReq(ctx.req);
  const AccountId = await getAccountId(email);
  const productionsRaw = await getActiveProductions(AccountId);
  return {
    props: {
      activeProductions: productionsRaw.map((t: any) => ({
        Id: t.Id,
        Code: t.Code,
        IsArchived: t.IsArchived,
        ShowCode: t.Show.Code,
        ShowName: t.Show.Name,
      })),
    },
  };
};

export default Index;
