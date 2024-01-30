import { GetServerSideProps } from 'next';
import { getActiveProductions } from 'services/ProductionService';
import Layout from '../../components/Layout';
import Switchboard from '../../components/reports/switchboard';
import { productionEditorMapper } from 'lib/mappers';
import { getAccountIdFromReq } from 'services/userService';
import { Production } from '@prisma/client';

type ReportsProps = {
  activeProductions: any & Production[];
};

const Index = ({ activeProductions = [] }: ReportsProps) => {
  return (
    <Layout title="Reports | Segue">
      <Switchboard activeProductions={activeProductions}></Switchboard>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const AccountId = await getAccountIdFromReq(ctx.req);
  const activeProductions = await getActiveProductions(AccountId);
  return {
    props: {
      activeProductions: activeProductions.map((production: any & Production) => productionEditorMapper(production)),
    },
  };
};

export default Index;
