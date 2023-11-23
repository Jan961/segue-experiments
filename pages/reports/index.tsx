import { GetServerSideProps } from 'next';
import { getActiveTours } from 'services/TourService';
import Layout from '../../components/Layout';
import Switchboard from '../../components/reports/switchboard';
import { tourEditorMapper } from 'lib/mappers';
import { getAccountIdFromReq } from 'services/userService';
import { Tour } from '@prisma/client';
import { getToursByStartDate } from 'utils/getToursByStartDate';

type ReportsProps = {
  activeTours: any & Tour[];
};

const Index = ({ activeTours = [] }: ReportsProps) => {
  return (
    <Layout title="Reports | Segue">
      <Switchboard activeTours={activeTours}></Switchboard>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const AccountId = await getAccountIdFromReq(ctx.req);
  const activeTours = await getActiveTours(AccountId);
  return {
    props: {
      activeTours: getToursByStartDate(activeTours).map((tour: any & Tour) => tourEditorMapper(tour)),
    },
  };
};

export default Index;
