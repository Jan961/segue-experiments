import Layout from 'components/Layout';
import Filters from 'components/marketing/Filters';
import MarketingHome from 'components/marketing/MarketingHome';
import { getAccountIdFromReq } from 'services/userService';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import { InitialState } from 'lib/recoil';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getSaleableBookings } from 'services/bookingService';
import { getRoles } from 'services/contactService';
import { BookingJump } from 'state/marketing/bookingJumpState';
import { bookingMapperWithVenue, venueRoleMapper } from 'lib/mappers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MarketingPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout title="Marketing | Segue" flush>
      <div className="mb-8">
        <Filters />
      </div>
      <MarketingHome />
    </Layout>
  );
};

export default MarketingPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const accountId = await getAccountIdFromReq(ctx.req);
  const productionJump = await getProductionJumpState(ctx, 'marketing', accountId);
  const productionId = productionJump.selected;
  let initialState: InitialState;

  if (productionId !== null) {
    const bookings = await getSaleableBookings(productionId);
    const venueRoles = await getRoles();
    const selected = null;
    const bookingJump: BookingJump = {
      selected,
      bookings: bookings.map(bookingMapperWithVenue),
    };

    // See _app.tsx for how this is picked up
    initialState = {
      global: {
        productionJump,
      },
      marketing: {
        bookingJump,
        venueRole: venueRoles.map(venueRoleMapper),
      },
    };
  } else {
    initialState = {
      global: {
        productionJump,
      },
    };
  }

  return { props: { initialState } };
};
