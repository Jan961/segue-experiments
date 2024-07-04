import Layout from 'components/Layout';
import { GetServerSideProps } from 'next';
import { getAccountIdFromReq, getUsers } from 'services/userService';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import { InitialState } from 'lib/recoil';
import { getSaleableBookings } from 'services/bookingService';
import { getRoles } from 'services/contactService';
import { BookingJump } from 'state/marketing/bookingJumpState';
import { bookingMapperWithVenue, venueRoleMapper } from 'lib/mappers';
import { getAllVenuesMin, getUniqueVenueTownlist } from 'services/venueService';
import { objectify } from 'radash';
import GlobalActivityFilters from 'components/marketing/GlobalActivityFilters';

const Index = () => {
  return (
    <Layout title="Marketing | Segue" flush>
      <div className="mb-8">
        <GlobalActivityFilters />
      </div>
    </Layout>
  );
};
export default Index;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const accountId = await getAccountIdFromReq(ctx.req);
  const productionJump = await getProductionJumpState(ctx, 'marketing/activity/GlobalActivity', accountId);
  const productionId = productionJump.selected;
  const users = await getUsers(accountId);

  let initialState: InitialState;

  if (productionId !== null) {
    const bookings = await getSaleableBookings(productionId);
    const venueRoles = await getRoles();
    const selected = null;
    const bookingJump: BookingJump = {
      selected,
      bookings: bookings.map(bookingMapperWithVenue),
    };
    const townList = await getUniqueVenueTownlist();
    const venues = await getAllVenuesMin();

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
        defaultTab: 0,
        currencySymbol: '',
        users,
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
