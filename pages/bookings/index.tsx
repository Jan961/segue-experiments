import GlobalToolbar from 'components/toolbar';
import BookingsButtons from 'components/bookings/bookingsButtons';
import { styleProps, columnDefs } from 'components/bookings/table/tableConfig';
import Layout from 'components/Layout';

import { useRecoilState, useRecoilValue } from 'recoil';

import { filterState, intialBookingFilterState } from 'state/booking/filterState';
import { filteredScheduleSelector } from 'state/booking/selectors/filteredScheduleSelector';

import { MileageCalculator } from 'components/bookings/MileageCalculator';
import { useState } from 'react';

import { viewState } from 'state/booking/viewState';

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
import Table from 'components/core-ui-lib/Table';

const statusOptions: SelectOption[] = [
  { text: 'ALL', value: '' },
  { text: 'Confirmed (C)', value: 'C' },
  { text: 'Unconfirmed (U)', value: 'U' },
  { text: 'Cancelled (X)', value: 'X' },
];

const BookingPage = () => {
  const schedule = useRecoilValue(filteredScheduleSelector);
  const bookingDict = useRecoilValue(bookingState);
  const rehearsalDict = useRecoilValue(rehearsalState);
  const gifuDict = useRecoilValue(getInFitUpState);
  const otherDict = useRecoilValue(otherState);
  const { Sections } = schedule;
  const [filter, setFilter] = useRecoilState(filterState);
  const [view, setView] = useRecoilState(viewState);
  const [showProductionSummary, setShowProductionSummary] = useState(false);

  const todayKey = new Date().toISOString().substring(0, 10);
  const todayOnSchedule =
    Sections.map((x) => x.Dates)
      .flat()
      .filter((x) => x.Date === todayKey).length > 0;
  const filteredSections = useBookingFilter({ Sections, bookingDict, rehearsalDict, gifuDict, otherDict });
  console.log(filteredSections);
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

  const rows = [
    {
      production: 'MTM23 - Name',
      date: '12/12/23',
      week: 3,
      venue: 'Alhambra',
      town: 'Dunfermline',
      dayType: 'xxx',
      bookingStatus: 'uncomfirmed',
      capacity: 1000,
      noOfPrefs: 6,
      performanceTimes: '3pm to 5pm',
      miles: 400,
      travelTime: '6hrs',
      note: 'Hey you!',
    },
    {
      production: 'MTM23 - Name',
      date: '12/12/23',
      week: 3,
      venue: 'Alhambra',
      town: 'Dunfermline',
      dayType: 'xxx',
      bookingStatus: 'uncomfirmed',
      capacity: 1000,
      noOfPrefs: 6,
      performanceTimes: '3pm to 5pm',
      miles: 400,
      travelTime: '6hrs',
      note: '',
    },
  ];

  const handleCellClick = (e) => {
    console.log(e);
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
                    ProductionId={0}
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
      {/* Bookings Grid */}
      <div className="w-full h-full">
        <Table columnDefs={columnDefs} rowData={rows} styleProps={styleProps} onCellClicked={handleCellClick} />
      </div>
    </Layout>
  );
};

export default BookingPage;
