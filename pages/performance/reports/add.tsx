import ReportWrapper from 'components/performance/reportWrapper';
import { productionEditorMapper } from 'lib/mappers';
import { GetServerSideProps } from 'next';
import { getActiveProductions } from 'services/ProductionService';
import { getAccountIdFromReq } from 'services/userService';
import { Production } from '@prisma/client';
import Layout from 'components/Layout';

type Props = {
  productions: any & Production[];
};

export default function Reports({ productions = [] }: Props) {
  return (
    <Layout title="Performance Reports | Add Report | Segue">
      <ReportWrapper>
        {productions.map(({ Id, ShowName }) => (
          <option key={Id} value={Id}>
            {ShowName}
          </option>
        ))}
      </ReportWrapper>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const AccountId = await getAccountIdFromReq(ctx.req);
  const activeProductions = await getActiveProductions(AccountId);
  return {
    props: {
      productions: activeProductions.map((production: any & Production) => productionEditorMapper(production)),
    },
  };
};
