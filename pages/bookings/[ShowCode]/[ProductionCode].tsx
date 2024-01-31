import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import GlobalToolbar from 'components/toolbar';
import BookingsButtons from 'components/bookings/bookingsButtons';
import Layout from 'components/Layout';
import { getProductionWithContent } from 'services/productionService';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  DateTypeMapper,
  bookingMapper,
  dateBlockMapper,
  getInFitUpMapper,
  otherMapper,
  performanceMapper,
  rehearsalMapper,
} from 'lib/mappers';
import { getAllVenuesMin } from 'services/venueService';
import { InitialState } from 'lib/recoil';
import { BookingsWithPerformances } from 'services/bookingService';
import { objectify, all } from 'radash';
import { getDayTypes } from 'services/dayTypeService';
import { filterState, intialBookingFilterState } from 'state/booking/filterState';
import { filteredScheduleSelector } from 'state/booking/selectors/filteredScheduleSelector';
import { productionJumpState } from 'state/booking/productionJumpState';
import { Spinner } from 'components/global/Spinner';
import { MileageCalculator } from 'components/bookings/MileageCalculator';
import { useState } from 'react';

import { getProductionJumpState } from 'utils/getProductionJumpState';
import { viewState } from 'state/booking/viewState';
import { getAccountIdFromReq } from 'services/userService';
import BookingFilter from 'components/bookings/BookingFilter';
import { bookingState } from 'state/booking/bookingState';
import { rehearsalState } from 'state/booking/rehearsalState';
import { getInFitUpState } from 'state/booking/getInFitUpState';
import { otherState } from 'state/booking/otherState';
import useBookingFilter from 'hooks/useBookingsFilter';
import Select from 'components/core-ui-lib/Select';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import TextInput from 'components/core-ui-lib/TextInput/TextInput';
import Report from 'components/bookings/modal/Report';
import Button from 'components/core-ui-lib/Button';
import BookingsTable from 'components/bookings/BookingsTable';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  /*
      We get the data for the whole booking page here. We pass it to the constructor, then store it in state management.
      This means we can update a single booking, and the schedule will update without having to redownload all the data.
      We have effectively cloned the database for this production, and populate it using the results of a single query which includes 'everything we want
      to display'.
  
      The itinery or miles will be different however, as this relies on the preview booking, and has to be generateed programatically
    */
  const AccountId = await getAccountIdFromReq(ctx.req);
  const productionJump = await getProductionJumpState(ctx, 'bookings', AccountId);

  const ProductionId = productionJump.selected;
  // ProductionJumpState is checking if it's valid to access by accountId
  if (!ProductionId) return { notFound: true };

  // Get in parallel
  const [venues, production, dateTypeRaw] = await all([
    getAllVenuesMin(),
    getProductionWithContent(ProductionId),
    getDayTypes(),
  ]);

  const dateBlock = [];
  const rehearsal = {};
  const booking = {};
  const getInFitUp = {};
  const performance = {};
  const other = {};
  const venue = objectify(
    venues,
    (v) => v.Id,
    (v: any) => {
      const Town: string | null = v.VenueAddress.find((address: any) => address?.TypeName === 'Main')?.Town ?? null;
      return { Id: v.Id, Code: v.Code, Name: v.Name, Town, Seats: v.Seats, Count: 0 };
    },
  );
  // Map to DTO. The database can change and we want to control. More info in mappers.ts
  for (const db of production.DateBlock) {
    dateBlock.push(dateBlockMapper(db));
    db.Other.forEach((o) => {
      other[o.Id] = otherMapper(o);
    });
    db.Rehearsal.forEach((r) => {
      rehearsal[r.Id] = rehearsalMapper(r);
    });
    db.GetInFitUp.forEach((gifu) => {
      getInFitUp[gifu.Id] = getInFitUpMapper(gifu);
    });
    db.Booking.forEach((b) => {
      booking[b.Id] = bookingMapper(b as BookingsWithPerformances);
      b.Performance.forEach((p) => {
        performance[p.Id] = {
          ...performanceMapper(p),
          Time: performanceMapper(p).Time ?? null, // Example of setting a default value
        };
      });
      const venueId = booking[b.Id].VenueId;
      if (venue[venueId]) venue[venueId].Count++;
    });
  }

  const distance = {
    stops: [],
    outdated: true,
    productionCode: production.Code,
  };

  // See _app.tsx for how this is picked up
  const initialState: InitialState = {
    global: {
      productionJump,
    },
    booking: {
      distance,
      rehearsal,
      booking,
      getInFitUp,
      other,
      dateType: dateTypeRaw.map(DateTypeMapper),
      performance,
      dateBlock: dateBlock.sort((a, b) => {
        return b.StartDate < a.StartDate ? 1 : -1;
      }),
      // Remove extra info
      venue,
    },
  };

  return {
    props: {
      ProductionId,
      initialState,
    },
  };
};

const statusOptions: SelectOption[] = [
  { text: 'ALL', value: '' },
  { text: 'Confirmed (C)', value: 'C' },
  { text: 'Unconfirmed (U)', value: 'U' },
  { text: 'Cancelled (X)', value: 'X' },
];

const BookingForProductionPage = ({ ProductionId }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const schedule = useRecoilValue(filteredScheduleSelector);
  const bookingDict = useRecoilValue(bookingState);
  const rehearsalDict = useRecoilValue(rehearsalState);
  const gifuDict = useRecoilValue(getInFitUpState);
  const otherDict = useRecoilValue(otherState);
  const { Sections } = schedule;
  const [filter, setFilter] = useRecoilState(filterState);
  const [view, setView] = useRecoilState(viewState);
  const [showProductionSummary, setShowProductionSummary] = useState(false);
  const { loading } = useRecoilValue(productionJumpState);
  const todayKey = new Date().toISOString().substring(0, 10);
  const todayOnSchedule =
    Sections.map((x) => x.Dates)
      .flat()
      .filter((x) => x.Date === todayKey).length > 0;
  const filteredSections = useBookingFilter({ Sections, bookingDict, rehearsalDict, gifuDict, otherDict });
  console.log(!!filteredSections);
  const gotoToday = () => {
    const idToScrollTo = `booking-${todayKey}`;
    if (todayOnSchedule) {
      document.getElementById(`${idToScrollTo}`).scrollIntoView({ behavior: 'smooth' });
      setView({ ...view, selectedDate: todayKey });
    }
  };

  const onChange = (e: any) => {
    setFilter({ ...filter, [e.target.id]: e.target.value });
  };

  const onClearFilters = () => {
    setFilter(intialBookingFilterState);
  };

  return (
    <Layout title="Booking | Segue" flush>
      <div className="grid grid-cols-12 mb-8">
        <div className="mx-0 col-span-7 lg:col-span-8 xl:col-span-9">
          <div className="px-4">
            <GlobalToolbar
              searchFilter={filter.venueText}
              setSearchFilter={(venueText) => setFilter({ venueText })}
              titleClassName="text-primary-orange"
              title={'Bookings'}
            >
              <div className="flex items-center gap-2">
                <Button disabled={!todayOnSchedule} text="Go To Today" onClick={() => gotoToday()}></Button>
                <Button text="Production Summary" onClick={() => setShowProductionSummary(true)}></Button>
                {showProductionSummary && (
                  <Report
                    visible={showProductionSummary}
                    onClose={() => setShowProductionSummary(false)}
                    ProductionId={ProductionId}
                  />
                )}
              </div>
            </GlobalToolbar>
          </div>
          <div className="px-4 flex items-center gap-4 flex-wrap  py-1">
            <MileageCalculator />
            <Select
              onChange={(value) => onChange({ target: { id: 'status', value } })}
              value={filter.status}
              className="bg-white"
              label="Status"
              options={statusOptions}
            />
            <BookingFilter />
            <TextInput
              id={'venueText'}
              placeHolder="search bookings..."
              className="!w-fit"
              iconName="search"
              value={filter.venueText}
              onChange={onChange}
            />
            <Button text="Clear Filters" onClick={onClearFilters}></Button>
          </div>
        </div>
        <div className="col-span-5 lg:col-span-4 xl:col-span-3 p-2">
          <BookingsButtons />
        </div>
      </div>

      {loading && <Spinner size="lg" className="mt-32 mb-8" />}
      {!loading && <BookingsTable />}
    </Layout>
  );
};

export default BookingForProductionPage;
