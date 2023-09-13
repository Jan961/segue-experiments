import Layout from "components/Layout";
import { useState } from "react";
import GlobalToolbar from "components/toolbar";
import Entry from "components/marketing/sales/entry";
import { GetServerSideProps } from "next";
import { InitialState } from "lib/recoil";
import { getSaleableBookings } from "services/bookingService";
import { BookingJump } from "state/marketing/bookingJumpState";
import { bookingMapperWithVenue, venueRoleMapper } from "lib/mappers";
import { getRoles } from "services/contactService";
import { getTourJumpState } from "utils/getTourJumpState";
import { getAccountId, getEmailFromReq } from "services/userService";

type Props = {
  initialState: InitialState;
};

const Index = ({ initialState }: Props) => {
  const [searchFilter, setSearchFilter] = useState("");

  return (
    <Layout title="Marketing | Segue">
      <div className="flex flex-col px-4 flex-auto">
        <GlobalToolbar
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          page={"/sales/entry"}
          title={"Marketing"}
        />
        <Entry searchFilter={searchFilter} />
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const email = await getEmailFromReq(ctx.req);
  const AccountId = await getAccountId(email);

  const tourJump = await getTourJumpState(
    ctx,
    "marketing/sales/entry",
    AccountId
  );

  const TourId = tourJump.selected;
  // TourJumpState is checking if it's valid to access by accountId
  if (!TourId) return { notFound: true };

  const bookings = await getSaleableBookings(TourId);
  const venueRoles = await getRoles();

  const bookingJump: BookingJump = {
    selected: bookings[0] ? bookings[0].Id : undefined,
    bookings: bookings.map(bookingMapperWithVenue),
  };

  const initialState: InitialState = {
    global: {
      tourJump,
    },
    marketing: {
      bookingJump,
      venueRole: venueRoles.map(venueRoleMapper),
    },
  };

  return { props: { initialState } };
};

export default Index;
