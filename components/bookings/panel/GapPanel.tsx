import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { FormInputButton } from 'components/global/forms/FormInputButton';
import { useRecoilValue } from 'recoil';
import { viewState } from 'state/booking/viewState';
import { bookingState } from 'state/booking/bookingState';
import { FormInputSelect, SelectOption } from 'components/global/forms/FormInputSelect';
import { venueState } from 'state/booking/venueState';
import { findPrevAndNextBookings } from './utils/findPrevAndNextBooking';
import { debounce } from 'radash';
import {
  GapSuggestionResponse,
  GapSuggestionUnbalancedProps,
  VenueWithDistance,
} from 'services/booking/gapSuggestion/types';
import { timeFormat } from 'services/dateService';
import { Spinner } from 'components/global/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faSliders } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import classNames from 'classnames';
import { NumericSliderRange } from './components/NumericSliderRange';
import { FormInputCheckbox } from 'components/global/forms/FormInputCheckbox';
import { FormInputNumeric } from 'components/global/forms/FormInputNumeric';

interface ToggleButtonProps {
  icon: IconProp;
  className: string;
  active?: boolean;
  onClick: (e: any) => void;
}

const ToggleButton = ({ icon, className, active, onClick }: ToggleButtonProps) => {
  let baseClass = 'rounded-tl-0 rounded-tl-0 p-2 w-12 rounded bg-gray-200 border cursor-pointer border-gray-300';
  if (active) baseClass = classNames(baseClass, 'bg-primary-blue text-white border-primary-blue');

  return (
    <button onClick={onClick} className={classNames(baseClass, className)}>
      <FontAwesomeIcon icon={icon} />
    </button>
  );
};

interface GapPanelProps {
  finish: () => void;
  setGapVenueIds: (ids: VenueWithDistance[]) => void;
}

export const GapPanel = ({ finish, setGapVenueIds }: GapPanelProps) => {
  const { selectedDate } = useRecoilValue(viewState);
  const venueDict = useRecoilValue(venueState);
  const bookingDict = useRecoilValue(bookingState);
  const [results, setResults] = useState<GapSuggestionResponse>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [sliderActive, setSlidersActive] = useState(false);
  const { nextBookings, prevBookings } = findPrevAndNextBookings(bookingDict, selectedDate, selectedDate);
  const startVIds = prevBookings.map((id) => bookingDict[id].VenueId);
  const endVIds = nextBookings.map((id) => bookingDict[id].VenueId);
  const [sliderMax, setSliderMax] = useState<number>(null);

  const startDropDown = startVIds.map(
    (vId): SelectOption => ({
      text: venueDict[vId].Name,
      value: venueDict[vId].Id.toString(),
    }),
  );

  const endDropDown = endVIds.map(
    (vId): SelectOption => ({
      text: venueDict[vId].Name,
      value: venueDict[vId].Id.toString(),
    }),
  );

  const [inputs, setInputs] = useState({
    From: [25, 200] as [number, number],
    To: [25, 200] as [number, number],
    VenueId: 0,
    StartVenue: Number(startDropDown[0]?.value),
    EndVenue: Number(endDropDown[0]?.value),
    ExcludeLondonVenues: false,
    MinSeats: 0,
  });

  const [venueInputs, setVenueInputs] = useState({
    StartVenue: Number(startDropDown[0]?.value),
    EndVenue: Number(endDropDown[0]?.value),
  });

  const next = () => {
    setGapVenueIds(results.VenueInfo);
  };

  const search = useCallback(async (inputs: any) => {
    const body: GapSuggestionUnbalancedProps = {
      ...inputs,
      StartVenue: inputs.StartVenue,
      EndVenue: inputs.EndVenue,
      MinFromMiles: inputs.From[0],
      MaxFromMiles: inputs.From[1],
      MinToMiles: inputs.To[0],
      MaxToMiles: inputs.To[1],
      ExcludeLondonVenues: inputs.ExcludeLondonVenues,
      MinSeats: inputs.MinSeats,
    };
    const { data } = await axios.post<GapSuggestionResponse>('/api/venue/read/distance', body);
    setResults(data);
    setRefreshing(false);
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce({ delay: 500 }, (inputs) => {
        search(inputs);
      }),
    [search],
  );

  useEffect(() => {
    if (refreshing) debouncedSearch(inputs);
  }, [inputs, debouncedSearch, refreshing]);

  useEffect(() => {
    const intitalSearch = async (initialInputs) => {
      setResults(undefined);

      const body: GapSuggestionUnbalancedProps = {
        StartVenue: venueInputs.StartVenue,
        EndVenue: venueInputs.EndVenue,
      };

      const { data } = await axios.post<GapSuggestionResponse>('/api/venue/read/distance', body);

      const { DefaultMin, SliderMax } = data;

      setResults(data);
      setInputs({ ...initialInputs, From: [DefaultMin, SliderMax], To: [DefaultMin, SliderMax] });
      setSliderMax(SliderMax);
    };

    intitalSearch(venueInputs);
  }, [venueInputs]); // Trigger the debounced search here

  const handleVenueChange = (e: any) => {
    e.persist();
    setVenueInputs((prev) => ({
      ...prev,
      [e.target.id]: Number(e.target.value),
    }));
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: Number(e.target.value),
    }));
  };

  const handleRangeChange = (value: number[], name: string) => {
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
    setRefreshing(true);
  };

  const handleInputsChange = (event: any) => {
    setInputs((prev) => ({
      ...prev,
      [event.target.id]: event.target.value,
    }));
    setRefreshing(true);
  };

  const resultVenues = results?.VenueInfo?.length ? results?.VenueInfo?.length : 0;

  return (
    <>
      <h3 className="text-lg mb-2 text-center">Gap Suggest</h3>
      <FormInputSelect
        name="StartVenue"
        label="Start"
        onChange={handleVenueChange}
        value={venueInputs.StartVenue}
        disabled={startDropDown.length <= 1}
        options={startDropDown}
      />
      <FormInputSelect
        name="EndVenue"
        label="End"
        onChange={handleVenueChange}
        value={venueInputs.EndVenue}
        disabled={endDropDown.length <= 1}
        options={endDropDown}
      />
      {!results && (
        <div className="p-16 mb-4 bg-gray-100 rounded">
          <Spinner size="md" />
        </div>
      )}
      {results && (
        <div className="pb-px mb-4 bg-gray-100 rounded p-2">
          <div className="float-right mb-2">
            <ToggleButton
              active={!sliderActive}
              onClick={() => {
                setSlidersActive(!sliderActive);
              }}
              className="rounded-r-none border-r-0"
              icon={faCalculator}
            />
            <ToggleButton
              active={sliderActive}
              onClick={() => {
                setSlidersActive(!sliderActive);
              }}
              className="rounded-l-none"
              icon={faSliders}
            />
          </div>
          <div>
            <label className="mr-2 text-bold">Current</label>
            <br />
            <span>
              {results.OriginalMiles} mi - {timeFormat(results.OriginalMins)}
            </span>
          </div>
          <NumericSliderRange
            value={inputs.From}
            label="From"
            name="From"
            isSlider={sliderActive}
            handleRangeChange={handleRangeChange}
            min={0}
            max={sliderMax}
          />
          <NumericSliderRange
            value={inputs.To}
            label="To"
            name="To"
            isSlider={sliderActive}
            handleRangeChange={handleRangeChange}
            min={0}
            max={sliderMax}
          />
          <FormInputNumeric
            value={inputs.MinSeats}
            label="Min Num Seats"
            name="MinSeats"
            onChange={(value) => handleInputsChange({ target: { value, id: 'MinSeats' } })}
          />
          <FormInputCheckbox
            value={inputs.ExcludeLondonVenues}
            label="EXCLUDE LONDON VENUES"
            name="ExcludeLondonVenues"
            onChange={handleInputsChange}
          />
          <br />
          {refreshing && (
            <div className="p-2 pt-0">
              <Spinner size="sm" />
            </div>
          )}
          {!refreshing && <div className="text-lg text-center p-2">{resultVenues} Venue(s) matched</div>}
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <FormInputButton onClick={finish} text="Cancel" />
        <FormInputButton onClick={next} disabled={!results?.VenueInfo} intent="PRIMARY" text="Next" />
      </div>
    </>
  );
};
