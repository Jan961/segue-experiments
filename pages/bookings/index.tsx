import React, { PropsWithChildren } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Layout from 'components/Layout';
import { getProductionsWithContent } from 'services/ProductionService';
import { InfoPanel } from 'components/bookings/InfoPanel';
import { DateViewModel, ScheduleSectionViewModel } from 'state/booking/selectors/scheduleSelector';
import {
  DateTypeMapper,
  bookingMapper,
  dateBlockMapper,
  getInFitUpMapper,
  otherMapper,
  performanceMapper,
  rehearsalMapper,
} from 'lib/mappers';
import { ScheduleRow } from 'components/bookings/ScheduleRow';
import { getAllVenuesMin } from 'services/venueService';
import { InitialState } from 'lib/recoil';
import { BookingsWithPerformances } from 'services/bookingService';
import { objectify, all } from 'radash';
import { getDayTypes } from 'services/dayTypeService';
import { filteredScheduleSelector } from 'state/booking/selectors/filteredScheduleSelector';
import { productionJumpState } from 'state/booking/productionJumpState';
import { Spinner } from 'components/global/Spinner';
import classNames from 'classnames';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import { getAccountIdFromReq } from 'services/userService';
import { bookingState } from 'state/booking/bookingState';
import { rehearsalState } from 'state/booking/rehearsalState';
import { getInFitUpState } from 'state/booking/getInFitUpState';
import { otherState } from 'state/booking/otherState';
import useBookingFilter from 'hooks/useBookingsFilter';
import Filters from 'components/bookings/Filters';
import { useRecoilValue } from 'recoil';

const toolbarHeight = 136;

interface ScrollablePanelProps {
  className: string;
  reduceHeight: number;
}

// Based on toolbar height. Adds a tasteful shadow when scrolled to prevent strange cut off
const ScrollablePanel = ({ children, className, reduceHeight }: PropsWithChildren<ScrollablePanelProps>) => {
  const [scrolled, setScrolled] = React.useState(false);

  const handleScroll = (e) => {
    setScrolled(e.target.scrollTop > 0);
  };

  const panelClasses = classNames('overflow-y-auto relative', {
    'shadow-inner': scrolled,
  });

  return (
    <div
      onScroll={handleScroll}
      className={classNames(className, panelClasses)}
      style={{
        height: `calc(100vh - ${reduceHeight}px)`,
      }}
    >
      {children}
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BookingPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const schedule = useRecoilValue(filteredScheduleSelector);
  const bookingDict = useRecoilValue(bookingState);
  const rehearsalDict = useRecoilValue(rehearsalState);
  const gifuDict = useRecoilValue(getInFitUpState);
  const otherDict = useRecoilValue(otherState);
  const { Sections } = schedule;
  const { loading } = useRecoilValue(productionJumpState);
  const { filteredSections, rows } = useBookingFilter({ Sections, bookingDict, rehearsalDict, gifuDict, otherDict });
  console.table(rows);
  return (
    <Layout title="Booking | Segue" flush>
      <div className="mb-8">
        <Filters />
      </div>
      <div className="grid grid-cols-12">
        <ScrollablePanel className="mx-0 col-span-7 lg:col-span-8 xl:col-span-9" reduceHeight={toolbarHeight}>
          {loading && <Spinner size="lg" className="mt-32 mb-8" />}
          {!loading && (
            <>
              <div
                className="grid grid-cols-12 font-bold
                text-center
                text-sm xl:text-md
                sticky inset-x-0 top-0 bg-gray-50 z-10
                shadow-lg
                text-gray-400"
              >
                <div className="col-span-1 p-2 hidden xl:inline-block ">Production</div>
                <div className="col-span-1 lg:col-span-1 xl:col-span-1 p-2 whitespace-nowrap">Week No.</div>
                <div className="col-span-4 lg:col-span-3 xl:col-span-2 p-2 whitespace-nowrap">Date</div>
                <div className="col-span-7 lg:col-span-8 grid grid-cols-10">
                  <div className="col-span-4 p-2">Venue</div>
                  <div className="col-span-2 p-2">Town</div>
                  <div className="col-span-1 p-2">Seats</div>
                  <div className="col-span-1 p-2">Perf(s)</div>
                  <div className="col-span-1 p-2">Miles</div>
                  <div className="col-span-1 p-2">Time</div>
                </div>
              </div>
              <ul className="grid w-full shadow">
                {filteredSections.map((section: ScheduleSectionViewModel) => (
                  <li key={section.Name}>
                    <h3 className="font-bold p-3 bg-gray-300">{section.Name}</h3>{' '}
                    {section.Dates.map((date: DateViewModel) => (
                      <ScheduleRow key={date.Date} date={date} />
                    ))}
                  </li>
                ))}
              </ul>
            </>
          )}
        </ScrollablePanel>
        <ScrollablePanel
          reduceHeight={toolbarHeight}
          className="col-span-5 lg:col-span-4 xl:col-span-3 p-2 bg-primary-blue"
        >
          <InfoPanel />
        </ScrollablePanel>
      </div>
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
  const AccountId = await getAccountIdFromReq(ctx.req);
  const productionJump = await getProductionJumpState(ctx, 'bookings', AccountId);
  const ProductionId = productionJump.selected;
  // ProductionJumpState is checking if it's valid to access by accountId
  //   if (!ProductionId) return { notFound: true };

  // Get in parallel
  const [venues, productions, dateTypeRaw] = await all([
    getAllVenuesMin(),
    getProductionsWithContent(ProductionId === -1 ? null : ProductionId),
    getDayTypes(),
  ]);

  console.log(`Retrieved main content. Production: ${productions}`);

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
  for (const production of productions) {
    for (const db of production.DateBlock) {
      dateBlock.push(dateBlockMapper(db));
      db.Other.forEach((o) => {
        other[o.Id] = { ...otherMapper(o), ProductionId: production?.Id };
      });
      db.Rehearsal.forEach((r) => {
        rehearsal[r.Id] = { ...rehearsalMapper(r), ProductionId: production?.Id };
      });
      db.GetInFitUp.forEach((gifu) => {
        getInFitUp[gifu.Id] = { ...getInFitUpMapper(gifu), ProductionId: production?.Id };
      });
      db.Booking.forEach((b) => {
        booking[b.Id] = {
          ...bookingMapper(b as BookingsWithPerformances),
          ProductionId: production?.Id,
          performanceIds: b.Performance.map((perf) => perf.Id),
        };
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
  }
  const distance = {
    stops: [],
    outdated: true,
    productionCode: ProductionId ? productions?.[0]?.Code || null : null,
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
