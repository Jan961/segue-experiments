import Layout from 'components/Layout';
import { GetServerSideProps } from 'next';
import { ProductionEditor } from 'components/productions/ProductionEditor';
import { ProductionDTO } from 'interfaces';
import { getShowById, lookupShowCode } from 'services/ShowService';
import { getEmailFromReq, getAccountId } from 'services/userService';

type CreateProps = {
  production: ProductionDTO;
  showCode: string;
};

const DEFAULT_PRODUCTION: Pick<ProductionDTO, 'DateBlock' | 'IsArchived' | 'Code'> = {
  Code: '',
  IsArchived: false,
  DateBlock: [
    {
      Name: 'Production',
      StartDate: '',
      EndDate: '',
    },
    {
      Name: 'Rehearsal',
      StartDate: '',
      EndDate: '',
    },
  ],
};

const Create = ({ production, showCode }: CreateProps) => {
  return (
    <Layout title="Add Production | Segue">
      <ProductionEditor showCode={showCode} production={production} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ShowCode } = ctx.params;

  const email = await getEmailFromReq(ctx.req);
  const accountId = await getAccountId(email);

  const ShowId = await lookupShowCode(ShowCode as string, accountId);

  if (!ShowId) return { notFound: true };

  // No need to check access, we are looking up based on AccountId

  const show = await getShowById(ShowId);

  const production = { ...DEFAULT_PRODUCTION, ShowId, ShowName: show.Name };
  return { props: { production, showCode: ShowCode } };
};

export default Create;
