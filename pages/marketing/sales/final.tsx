import Layout from '../../../components/Layout';
import FinalSales from '../../../components/marketing/sales/final';
import { GetServerSideProps } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';
import { getActiveProductions } from 'services/productionService';

type Props = {
  activeProductions: any[];
};
const pagetitle = 'Marketing - Final Sales Entry';

const Index = ({ activeProductions }: Props) => (
  <Layout title={pagetitle + '| Segue'}>
    <div className="flex flex-col px-4 flex-auto">
      <h1 className="text-3xl font-bold text-primary-green ">{pagetitle + ' | Segue'}</h1>
      <FinalSales productions={activeProductions}></FinalSales>
    </div>
  </Layout>
);

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
        ShowType: t.Show.Type,
      })),
    },
  };
};

export default Index;
