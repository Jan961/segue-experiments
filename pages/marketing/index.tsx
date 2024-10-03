import Layout from 'components/Layout';
import Filters from 'components/marketing/Filters';
import MarketingHome from 'components/marketing/MarketingHome';
import { getUserNameFromReq } from 'services/userService';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import { InitialState } from 'lib/recoil';
import { GetServerSideProps, InferGetServerSidePropsType, NextApiRequest } from 'next';
import { getSaleableBookings } from 'services/bookingService';
import { getRoles } from 'services/contactService';
import { BookingJump } from 'state/marketing/bookingJumpState';
import { bookingMapperWithVenue, venueRoleMapper } from 'lib/mappers';
import { getAllVenuesMin, getUniqueVenueTownlist } from 'services/venueService';
import { objectify } from 'radash';

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
  const currentUser = await getUserNameFromReq(ctx.req);
  const productionJump = await getProductionJumpState(ctx, 'marketing');
  const productionId = productionJump.selected;
  let initialState: InitialState;

  if (productionId !== null) {
    const bookings = await getSaleableBookings(productionId, ctx.req as NextApiRequest);
    const venueRoles = await getRoles(ctx.req as NextApiRequest);
    const selected = null;

    const bookingJump: BookingJump = {
      selected,
      bookings: bookings.map(bookingMapperWithVenue),
    };

    const townList = await getUniqueVenueTownlist(ctx.req as NextApiRequest);

    const venues = await getAllVenuesMin(ctx.req as NextApiRequest);

    const venue = objectify(
      venues,
      (v) => v.Id,
      (v: any) => {
        const Town: string | null = v.VenueAddress.find((address: any) => address?.TypeName === 'Main')?.Town ?? null;
        return { Id: v.Id, Code: v.Code, Name: v.Name, Town, Seats: v.Seats, Count: 0 };
      },
    );

    // See _app.tsx for how this is picked up
    initialState = {
      global: {
        productionJump,
      },
      marketing: {
        bookingJump,
        venueRole: venueRoles.map(venueRoleMapper),
        towns: townList,
        venueList: venue,
        currencySymbol: '',
        defaultTab: 0,
        currentUser,
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
