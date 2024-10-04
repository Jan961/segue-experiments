import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Layout from 'components/Layout';
import { InitialState } from 'lib/recoil';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import useBookingFilter from 'hooks/useBookingsFilter';
import Filters from 'components/bookings/Filters';
import BookingsTable from 'components/bookings/BookingsTable';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BookingPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const rows = useBookingFilter();

  return (
    <Layout title="Booking | Segue" flush>
      <div className="mb-8">
        <Filters />
      </div>
      <BookingsTable rowData={rows} />
    </Layout>
  );
};

export default BookingPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  /*
    We get the data for the whole booking page here. We pass it to the constructor, then store it in state management.
    This means we can update a single booking, and the schedule will update without having to redownload all the data.
    We have effectively cloned the database for this production, and populate it using the results of a single query which includes 'everything we want
    to display'.

    The itinery or miles will be different however, as this relies on the preview booking, and has to be generateed programatically
  */
  const productionJump = await getProductionJumpState(ctx, 'bookings');
  const ProductionId = productionJump.selected;
  console.log('ProductionId', ProductionId, productionJump);
  // See _app.tsx for how this is picked up
  const initialState: InitialState = {
    global: {
      productionJump,
    },
  };

  return {
    props: {
      ProductionId,
      initialState,
    },
  };
};
