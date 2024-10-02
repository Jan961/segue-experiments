import { GetServerSideProps, NextApiRequest } from 'next';
import { getActiveProductions } from 'services/productionService';
import Layout from '../../components/Layout';
import Switchboard from '../../components/reports/switchboard';
import { productionEditorMapper } from 'lib/mappers';
import { Production } from 'prisma/generated/prisma-client';

type ReportsProps = {
  activeProductions: any & Production[];
};

const Index = ({ activeProductions = [] }: ReportsProps) => {
  return (
    <Layout title="Reports | Segue">
      <Switchboard activeProductions={activeProductions} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const activeProductions = await getActiveProductions(ctx.req as NextApiRequest);
  return {
    props: {
      activeProductions: activeProductions.map((production: any & Production) => productionEditorMapper(production)),
    },
  };
};

export default Index;
