import { useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { filterState } from 'state/booking/filterState';
import { filteredScheduleSelector } from 'state/booking/selectors/filteredScheduleSelector';
import { productionJumpState } from 'state/booking/productionJumpState';
import moment from 'moment';
import Button from 'components/core-ui-lib/Button';
import GlobalToolbar from 'components/toolbar';
import Select from 'components/core-ui-lib/Select';
import Iframe from 'components/core-ui-lib/Iframe';
import MarketingButtons from './marketingButtons';
import { venueState } from 'state/booking/venueState';
import { bookingState } from 'state/booking/bookingState';

const Filters = () => {
  const [filter, setFilter] = useRecoilState(filterState);
  const { selected: ProductionId } = useRecoilValue(productionJumpState);
  const schedule = useRecoilValue(filteredScheduleSelector);
  const todayKey = useMemo(() => new Date().toISOString().substring(0, 10), []);
  const venueDict = useRecoilValue(venueState);
  const bookingDict = useRecoilValue(bookingState);
  const todayOnSchedule = useMemo(
    () =>
      schedule.Sections.map((x) => x.Dates)
        .flat()
        .filter((x) => x.Date === todayKey).length > 0,
    [schedule.Sections, todayKey],
  );

  const gotoToday = () => {
    const dateToScrollTo = moment(new Date()).format('ddd DD/MM/YY');
    if (todayOnSchedule) {
      setFilter({ ...filter, scrollToDate: dateToScrollTo });
    }
  };

    const venueOptions = useMemo(() => {
      const options = [];
      const currentProductionVenues = Object.values(bookingDict).map((booking) => booking.VenueId);
      for (const venueId in venueDict) {
        const venue = venueDict[venueId];
        const option = {
          text: `${venue.Code} ${venue?.Name} ${venue?.Town}`,
          value: venue?.Id,
        };
        if (currentProductionVenues.includes(parseInt(venueId, 10))) {
          continue;
        }
        options.push(option);
      }
      return options;
    }, [venueDict, bookingDict]);
  

  return (
    <div className="w-full flex items-end justify-between flex-wrap">
      <div className="flex flex-col gap-4">
        <GlobalToolbar
          searchFilter={filter.venueText}
          setSearchFilter={(venueText) => setFilter({ venueText })}
          titleClassName="text-primary-green"
          title={'Marketing'}
        />

        <div className="flex items-center gap-4">
          <Select
            onChange={(value) => alert('temp onChange till options are added')}
            disabled={!ProductionId}
            value={filter.status}
            placeholder='Select a Venue/Date'
            className="bg-white w-96"
            options={venueOptions}
          />

          <Button text="Go To Today" disabled={!todayOnSchedule || !ProductionId} className="text-sm leading-8 w-[132px]" onClick={gotoToday} />
          <Button text="Previous Date" disabled={!todayOnSchedule || !ProductionId} className="text-sm leading-8 w-[132px]" onClick={gotoToday} />
          <Button text="Next Date" disabled={!todayOnSchedule || !ProductionId} className="text-sm leading-8 w-[132px]" onClick={gotoToday} />

          {/* Iframe placed next to buttons but in the same flex container */}
          <div className="self-end -mt-[60px]">
            <Iframe variant="xs" src="https://www.gordon-craig.co.uk/" />
          </div>
        </div>
      </div>

      <MarketingButtons />
    </div>
  );
};

export default Filters;
