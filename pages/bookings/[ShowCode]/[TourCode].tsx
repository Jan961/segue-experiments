import { GetServerSideProps } from 'next';
import GlobalToolbar from 'components/toolbar';

import Layout from 'components/Layout';
import { getTourWithContent } from 'services/TourService';
import { InfoPanel } from 'components/bookings/InfoPanel';
import { useRecoilState, useRecoilValue } from 'recoil';
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
import { filterState } from 'state/booking/filterState';
import { filteredScheduleSelector } from 'state/booking/selectors/filteredScheduleSelector';
import { tourJumpState } from 'state/booking/tourJumpState';
import { Spinner } from 'components/global/Spinner';
import { ToolbarButton } from 'components/bookings/ToolbarButton';

import React, { PropsWithChildren } from 'react';
import classNames from 'classnames';
import { getTourJumpState } from 'utils/getTourJumpState';
import { viewState } from 'state/booking/viewState';
import { getAccountIdFromReq } from 'services/userService';
import BookingFilter from 'components/bookings/BookingFilter';
import { FormInputSelect, SelectOption } from 'components/global/forms/FormInputSelect';
import { bookingState } from 'state/booking/bookingState';
import { rehearsalState } from 'state/booking/rehearsalState';
import { getInFitUpState } from 'state/booking/getInFitUpState';
import { otherState } from 'state/booking/otherState';
import useBookingFilter from 'hooks/useBookingsFilter';
import { SearchBox } from 'components/global/SearchBox';

const toolbarHeight = 136;

interface ScrollablePanelProps {
  className: string;
  reduceHeight: number;
}

const statusOptions: SelectOption[] = [
  { text: 'ALL', value: '' },
  { text: 'Confirmed (C)', value: 'C' },
  { text: 'Unconfirmed (U)', value: 'U' },
  { text: 'Cancelled (X)', value: 'X' },
];

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

const BookingPage = () => {
  const schedule = useRecoilValue(filteredScheduleSelector);
  const bookingDict = useRecoilValue(bookingState);
  const rehearsalDict = useRecoilValue(rehearsalState);
  const gifuDict = useRecoilValue(getInFitUpState);
  const otherDict = useRecoilValue(otherState);
  const { Sections } = schedule;
  const [filter, setFilter] = useRecoilState(filterState);
  const [view, setView] = useRecoilState(viewState);
  const { loading } = useRecoilValue(tourJumpState);
  const todayKey = new Date().toISOString().substring(0, 10);
  const todayOnSchedule =
    Sections.map((x) => x.Dates)
      .flat()
      .filter((x) => x.Date === todayKey).length > 0;
  const filteredSections = useBookingFilter({ Sections, bookingDict, rehearsalDict, gifuDict, otherDict });
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

  return (
    <Layout title="Booking | Segue" flush>
      <div className="">
        <GlobalToolbar
          searchFilter={filter.venueText}
          setSearchFilter={(venueText) => setFilter({ venueText })}
          title={'Bookings'}
        >
          <div className="bg-white drop-shadow-md inline-block rounded-md">
            <div className="rounded-l-md">
              <div className="flex items-center">
                <p className="mx-2">Status: </p>
                <FormInputSelect
                  className="[&>select]:border-0 [&>select]:mb-0 [&>select]:text-primary-blue [&>select]:font-bold !mb-0"
                  label=""
                  onChange={onChange}
                  value={filter.status}
                  name={'status'}
                  options={statusOptions}
                />
              </div>
            </div>
          </div>
          <SearchBox onChange={(e) => console.log(e)} value="" placeholder="Search bookings..." />
        </GlobalToolbar>
      </div>
      <div className="px-4 flex items-center gap-4 flex-wrap  my-4">
        <BookingFilter />
        <ToolbarButton>Full Tour</ToolbarButton>
        <ToolbarButton>All Dates All Shows</ToolbarButton>
        <ToolbarButton>Venue History</ToolbarButton>
        <ToolbarButton>Tour summary</ToolbarButton>
        <ToolbarButton>Barring</ToolbarButton>
        <ToolbarButton disabled={!todayOnSchedule} onClick={() => gotoToday()}>
          Go To Today
        </ToolbarButton>
        <ToolbarButton>Add booking</ToolbarButton>
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
                <div className="col-span-1 p-2 hidden xl:inline-block ">Tour</div>
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
    We have effectively cloned the database for this tour, and populate it using the results of a single query which includes 'everything we want
    to display'.

    The itinery or miles will be different however, as this relies on the preview booking, and has to be generateed programatically
  */
  const AccountId = await getAccountIdFromReq(ctx.req);
  const tourJump = await getTourJumpState(ctx, 'bookings', AccountId);

  const TourId = tourJump.selected;
  // TourJumpState is checking if it's valid to access by accountId
  if (!TourId) return { notFound: true };

  // Get in parallel
  const [venues, tour, dateTypeRaw] = await all([getAllVenuesMin(), getTourWithContent(TourId), getDayTypes()]);

  console.log(`Retrieved main content. Tour: ${tour.Id}`);

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
  for (const db of tour.DateBlock) {
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
    tourCode: tour.Code,
  };

  // See _app.tsx for how this is picked up
  const initialState: InitialState = {
    global: {
      tourJump,
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
      TourId,
      initialState,
    },
  };
};
