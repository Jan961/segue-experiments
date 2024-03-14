import Layout from 'components/Layout';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import { getAccountIdFromReq } from 'services/userService';
import { InitialState } from 'lib/recoil';
import { getShowsByAccountId } from 'services/ShowService';
import ShowsTable from 'components/bookings/ShowsTable';
import { showMapper } from 'lib/mappers';
import Checkbox from 'components/core-ui-lib/Checkbox';
import Button from 'components/core-ui-lib/Button';

export default function Index(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { showsList = [] } = props;
  return (
    <Layout title="Shows | Segue" flush>
      <div className="flex items-center justify-between py-5">
        <h1 className="text-primary-orange text-4xl font-bold">Shows</h1>
        <div className="flex gap-2 items-center">
          <Checkbox className="flex flex-row-reverse" label="Include archived" id={''} onChange={console.log} />
          <Button text="Add New Show" />
        </div>
      </div>
      <ShowsTable rowsData={showsList} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const AccountId = await getAccountIdFromReq(ctx.req);
  const productionJump = await getProductionJumpState(ctx, 'bookings', AccountId);
  const shows = (await getShowsByAccountId(AccountId)) || [];
  const showsList = shows.map(showMapper);
  const initialState: InitialState = {
    global: {
      productionJump,
    },
  };
  return {
    props: {
      showsList,
      initialState,
    },
  };
};
