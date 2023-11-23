import Layout from '../../../components/Layout';
import FinalSales from '../../../components/marketing/sales/final';
import { GetServerSideProps } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';
import { getActiveTours } from 'services/TourService';
import { getToursByStartDate } from 'utils/getToursByStartDate';

type Props = {
  activeTours: any[];
};
const pagetitle = 'Marketing - Sale Entry';

const Index = ({ activeTours }: Props) => (
  <Layout title={pagetitle + '| Seque'}>
    <div className="flex flex-col px-4 flex-auto">
      <h1 className="text-3xl font-bold text-primary-green ">{pagetitle + ' | Seque'}</h1>
      <FinalSales tours={activeTours}></FinalSales>
    </div>
  </Layout>
);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const email = await getEmailFromReq(ctx.req);
  const AccountId = await getAccountId(email);
  const toursRaw = await getActiveTours(AccountId);
  return {
    props: {
      activeTours: getToursByStartDate(toursRaw).map((t: any) => ({
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
