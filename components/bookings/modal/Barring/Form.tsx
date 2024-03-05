import { useRef, useState, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import Typeahead from 'components/core-ui-lib/Typeahead';
import TextInput from 'components/core-ui-lib/TextInput';
import Checkbox from 'components/core-ui-lib/Checkbox';
import DateRange from 'components/core-ui-lib/DateRange';
import Label from 'components/core-ui-lib/Label';
import { venueState } from 'state/booking/venueState';
import Button from 'components/core-ui-lib/Button';
import { currentProductionSelector } from 'state/booking/selectors/currentProductionSelector';

const INITIAL_FORM_STATE = {
  productionId: null,
  venueId: null,
  barDistance: null,
  includeExcluded: false,
  productionOnly: false,
  seats: null,
  fromDate: null,
  toDate: null,
};

const Form = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const { productions } = useRecoilValue(productionJumpState);
  const venueDict = useRecoilValue(venueState);
  const currentProduction = useRecoilValue(currentProductionSelector);
  const [formData, setFormData] = useState({ ...INITIAL_FORM_STATE, productionId: currentProduction.Id });
  const { productionId, venueId, barDistance = '', includeExcluded, seats = '', fromDate, toDate } = formData;
  const formRef = useRef(null);
  const { minDate, maxDate } = useMemo(() => {
    const selectedProduction = productions?.find((production) => production.Id === productionId);
    return { minDate: selectedProduction?.StartDate, maxDate: selectedProduction?.EndDate };
  }, [productionId, productions]);
  const productionOptions = useMemo(
    () =>
      productions.map((production) => ({
        text: `${production.ShowCode}${production.Code} ${production.ShowName}`,
        value: production.Id,
      })),
    [productions],
  );
  const venueOptions = useMemo(
    () =>
      Object.values(venueDict).map((venue) => ({
        text: `${venue.Code} ${venue?.Name} ${venue?.Town}`,
        value: venue?.Id,
      })),
    [venueDict],
  );
  const handleOnSubmit = () => {
    onSubmit(formData);
  };

  const handleOnChange = async (change: any) => {
    setFormData((prev) => ({
      ...prev,
      ...change,
    }));
  };
  return (
    <form ref={formRef} onSubmit={handleOnSubmit}>
      <div>
        <div className=" grid grid-cols-5 gap-x-4 gap-y-3">
          <div className="col-span-3 w-[360px]">
            <Typeahead
              label="Production"
              name="production"
              value={productionId}
              options={productionOptions}
              onChange={(production) => handleOnChange({ productionId: production })}
            />
          </div>
          <div className="col-span-2 col-start-4 flex items-center justify-between pl-6">
            <Label text="Bar Distance"></Label>
            <TextInput
              className="w-24"
              id="barDistance"
              placeHolder="Enter Miles"
              onChange={(e) => handleOnChange({ barDistance: e.target.value })}
              value={barDistance}
            />
          </div>
          <div className="col-span-3 row-start-2 w-[360px]">
            <Typeahead
              name="venue"
              label="Venue"
              onChange={(selectedVenue) => handleOnChange({ venueId: selectedVenue })}
              options={[{ value: 0, text: '-- Select Venue --' }, ...venueOptions]}
              placeholder="-- Select Venue --"
              value={venueId}
            />
          </div>
          <div className="col-span-2 col-start-4 row-start-2 flex items-center justify-between pl-6">
            <Label text="Minimum Seats"></Label>
            <TextInput
              id="Seats"
              className="w-24"
              placeHolder="Enter Seats"
              onChange={(e) => handleOnChange({ seats: e.target.value })}
              value={seats}
            />
          </div>
          <div className="col-span-3 row-start-3">
            <DateRange
              className="w-fit"
              onChange={({ from, to }) => handleOnChange({ fromDate: from?.toISOString(), toDate: to?.toISOString() })}
              value={{ from: fromDate ? new Date(fromDate) : null, to: toDate ? new Date(toDate) : null }}
              minDate={minDate ? new Date(minDate) : null}
              maxDate={maxDate ? new Date(maxDate) : null}
            />
          </div>
          <div className="col-span-2 col-start-4 row-start-4">
            <Checkbox
              className="flex flex-row-reverse"
              labelClassName="!text-base"
              label="Include Excluded Venues"
              id="includeExcludedVenues"
              name="includeExcludedVenues"
              checked={includeExcluded}
              onChange={(e) => handleOnChange({ includeExcluded: e.target.checked })}
            />
          </div>
        </div>
        <Button onClick={handleOnSubmit} className="float-right px-7 mt-5" text="Check Barring" />
      </div>
    </form>
  );
};

export default Form;
