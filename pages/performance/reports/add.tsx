import ReportWrapper from 'components/performance/reportWrapper';
import { tourEditorMapper } from 'lib/mappers';
import { GetServerSideProps } from 'next';
import { getActiveTours } from 'services/TourService';
import { getAccountIdFromReq } from 'services/userService';
import { Tour } from '@prisma/client';
import Layout from 'components/Layout';

type Props = {
  tours: any & Tour[];
};

export default function Reports({ tours = [] }: Props) {
  return (
    <Layout title="Performance Reports | Add Report | Segue">
      <ReportWrapper>
        {tours.map(({ Id, ShowName }) => (
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
  const activeTours = await getActiveTours(AccountId);
  return {
    props: {
      tours: activeTours.map((tour: any & Tour) => tourEditorMapper(tour)),
    },
  };
};