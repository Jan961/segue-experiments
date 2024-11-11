import Layout from 'components/Layout';
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
import InstructionText from 'components/marketing/load-history/InstructionText';
import LoadSalesHistory from 'components/marketing/load-history/LoadSalesHistory';

const Index = () => {
  return (
    <Layout title="Marketing | Segue">
      <h1 className="mt-3 text-4xl font-bold text-primary-green">Load Sales History</h1>
      <h2 className="text-2xl text-gray-500 font-bold pt-3 mb-4">Upload Instructions</h2>
      <InstructionText />
      <div className="w-full bg-gray-500 h-[1px] my-5" />
      <div className="w-[800px] text-primary-input-text">
        <p>
          Only archived productions can be selected for Sales Data Upload. If your production does not appear in the
          dropdown, please create and / or archive the production in the{' '}
          <a href="/bookings/shows" className="text-primary-url">
            `<u>Manage Shows / Productions</u>`
          </a>{' '}
          pages.
        </p>
      </div>
      <LoadSalesHistory />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const email = await getEmailFromReq(ctx.req);
  const accountId = await getAccountId(email);
  const currentUser = await getUserNameFromReq(ctx.req);
  const productionJump = await getProductionJumpState(ctx, 'marketing/sales/load-history');

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
