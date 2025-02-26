import Layout from 'components/Layout';
import FinalEntryFilters from 'components/marketing/FinalEntryFilters';
import { bookingMapperWithVenue, venueRoleMapper } from 'lib/mappers';
import { InitialState } from 'lib/recoil';
import { GetServerSideProps, NextApiRequest } from 'next';
import { objectify } from 'radash';
import { getSaleableBookings } from 'services/bookingService';
import { getRoles } from 'services/contactService';
import { getAccountId, getEmailFromReq, getUserNameFromReq, getUsers } from 'services/userService';
import { getAllVenuesMin, getUniqueVenueTownlist } from 'services/venueService';
import { BookingJump } from 'state/marketing/bookingJumpState';
import { getProductionJumpState } from 'utils/getProductionJumpState';

const Index = () => {
  return (
    <Layout title="Marketing | Segue">
      <div className="mb-8">
        <FinalEntryFilters />
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const email = await getEmailFromReq(ctx.req);
  const accountId = await getAccountId(email);
  const currentUser = await getUserNameFromReq(ctx.req);
  const productionJump = await getProductionJumpState(ctx, 'marketing/sales/final');

  const productionId = productionJump.selected;
  const users = await getUsers(accountId);

  let initialState: InitialState = null;

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
        defaultTab: 0,
        users,
        currencySymbol: '',
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

export default Index;
