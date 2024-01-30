import Layout from 'components/Layout';
import { GetServerSideProps } from 'next';
import { getProductionById, lookupProductionId } from 'services/ProductionService';
import { productionEditorMapper } from 'lib/mappers';
import { ProductionDTO } from 'interfaces';
import { ProductionEditor } from 'components/productions/ProductionEditor';
import { getEmailFromReq, checkAccess, getAccountIdFromReq } from 'services/userService';

type EditProps = {
  production: ProductionDTO;
  showCode: string;
};

const Edit = ({ production, showCode }: EditProps) => {
  return (
    <Layout title="Edit Production | Segue">
      <ProductionEditor production={production} showCode={showCode} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ProductionCode, ShowCode } = ctx.params;

  const AccountId = await getAccountIdFromReq(ctx.req);
  const email = await getEmailFromReq(ctx.req);
  const { Id } = await lookupProductionId(ShowCode as string, ProductionCode as string, AccountId);

  const access = await checkAccess(email, { ProductionId: Id });
  if (!access) return { notFound: true };

  const production = await getProductionById(Id);

  return { props: { production: productionEditorMapper(production), showCode: production.Show.Code } };
};

export default Edit;
