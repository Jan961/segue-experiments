import { useRef, useState, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import Select from 'components/core-ui-lib/Select';
import TextInput from 'components/core-ui-lib/TextInput';
import Checkbox from 'components/core-ui-lib/Checkbox';
import DateRange from 'components/core-ui-lib/DateRange';
import Label from 'components/core-ui-lib/Label';
import Button from 'components/core-ui-lib/Button';
import { currentProductionSelector } from 'state/booking/selectors/currentProductionSelector';
import { venueOptionsSelector } from 'state/booking/selectors/venueOptionsSelector';
import { productionOptionsSelector } from 'state/booking/selectors/productionOptionsSelector';
import { newDate } from 'services/dateService';

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
  const currentProduction = useRecoilValue(currentProductionSelector);
  const venueOptions = useRecoilValue(venueOptionsSelector([]));
  const [formData, setFormData] = useState({ ...INITIAL_FORM_STATE, productionId: currentProduction?.Id });
  const { productionId, venueId, barDistance = '', includeExcluded, seats = '', fromDate, toDate } = formData;
  const formRef = useRef(null);
  const { minDate, maxDate } = useMemo(() => {
    const selectedProduction = productions?.find((production) => production.Id === productionId);
    return { minDate: selectedProduction?.StartDate, maxDate: selectedProduction?.EndDate };
  }, [productionId, productions]);
  const productionOptions = useRecoilValue(productionOptionsSelector(true));
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
            <Select
              label="Production"
              name="production"
              placeholder="Please select a Production"
              value={productionId}
              options={productionOptions}
              onChange={(production) => handleOnChange({ productionId: production })}
            />
          </div>
          <div className="col-span-2 col-start-4 flex items-center justify-between pl-6">
            <Label className="!text-primary" text="Bar Distance" />
            <TextInput
              className="w-24 placeholder-primary"
              id="barDistance"
              placeholder="Enter Miles"
              type="number"
              onChange={(e) => handleOnChange({ barDistance: e.target.value })}
              value={barDistance}
            />
          </div>
          <div className="col-span-3 row-start-2 w-[360px]">
            <Select
              name="venue"
              label="Venue"
              className="placeholder-primary"
              onChange={(selectedVenue) => handleOnChange({ venueId: selectedVenue })}
              options={venueOptions}
              placeholder="Please select a venue"
              value={venueId}
              isSearchable
            />
          </div>
          <div className="col-span-2 col-start-4 row-start-2 flex items-center justify-between pl-6">
            <Label className="!text-primary" text="Minimum Seats" />
            <TextInput
              id="Seats"
              className="w-24 placeholder-primary"
              placeholder="Enter Seats"
              type="number"
              onChange={(e) => handleOnChange({ seats: e.target.value })}
              value={seats}
            />
          </div>
          <div className="col-span-3 row-start-3">
            <DateRange
              className="w-fit"
              label="Date"
              onChange={({ from, to }) =>
                handleOnChange({
                  fromDate: from?.toISOString() || '',
                  toDate: !toDate && !to ? from?.toISOString() : to?.toISOString() || '',
                })
              }
              value={{ from: fromDate ? newDate(fromDate) : null, to: toDate ? newDate(toDate) : null }}
              minDate={minDate ? newDate(minDate) : null}
              maxDate={maxDate ? newDate(maxDate) : null}
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
        <Button
          disabled={!venueId || !productionId}
          onClick={handleOnSubmit}
          className="float-right px-7 mt-5"
          text="Check Barring"
        />
      </div>
    </form>
  );
};

export default Form;
