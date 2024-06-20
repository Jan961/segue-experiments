import Layout from 'components/Layout';
import SalesEntryFilters from 'components/marketing/SalesEntryFilters';
import Entry, { SalesEntryRef } from 'components/marketing/sales/entry';
import { bookingMapperWithVenue, venueRoleMapper } from 'lib/mappers';
import { InitialState } from 'lib/recoil';
import { GetServerSideProps } from 'next';
import { objectify } from 'radash';
import { useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { getSaleableBookings } from 'services/bookingService';
import { getRoles } from 'services/contactService';
import { getAccountId, getEmailFromReq, getUsers } from 'services/userService';
import { getAllVenuesMin, getUniqueVenueTownlist } from 'services/venueService';
import { BookingJump, bookingJumpState } from 'state/marketing/bookingJumpState';
import { getProductionJumpState } from 'utils/getProductionJumpState';

const Index = () => {
  const bookings = useRecoilValue(bookingJumpState);
  const salesEntryRef = useRef<SalesEntryRef>();

  return (
    <div>
      <Layout title="Marketing | Segue">
        <div className="mb-8">
          <SalesEntryFilters onDateChanged={(salesWeek) => alert(salesWeek + ' in onDate')} />
        </div>

        {bookings.selected !== undefined && bookings.selected !== null && <Entry ref={salesEntryRef} />}
      </Layout>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const email = await getEmailFromReq(ctx.req);
  const accountId = await getAccountId(email);
  const productionJump = await getProductionJumpState(ctx, 'marketing/sales/entry', accountId);

  const productionId = productionJump.selected;
  const users = await getUsers(accountId);

  let initialState: InitialState = null;

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

export default Index;
