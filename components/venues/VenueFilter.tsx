import Button from 'components/core-ui-lib/Button';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import Typeahead from 'components/core-ui-lib/Typeahead';

import { useRecoilState, useRecoilValue } from 'recoil';
import { filterVenueState } from 'state/booking/filterVenueState';
import { productionOptionsSelector } from 'state/booking/selectors/productionOptionsSelector';

export default function VenueFilter({
  countryOptions,
  townOptions,
}: {
  countryOptions: SelectOption[];
  townOptions: SelectOption[];
}) {
  const [venueFilter, setVenueFilter] = useRecoilState(filterVenueState);
  const productionOptions = useRecoilValue(productionOptionsSelector(true));
  const onChange = (e: any) => {
    setVenueFilter({ ...venueFilter, [e.target.id]: e.target.value });
  };
  return (
    <>
      <div className="w-full flex items-center justify-between flex-wrap">
        <div className=" w-full flex flex-row ">
          <div className="px-4 flex  gap-4 flex-wrap  py-1 w-full">
            <div className="w-full flex flex-row gap-5">
              <Typeahead
                onChange={(value) => onChange({ target: { id: 'town', value } })}
                value={venueFilter.town}
                className="bg-white w-full h-fit"
                label="Town"
                placeholder="Select Town"
                options={townOptions}
                isSearchable
              />
              <Typeahead
                onChange={(value) => onChange({ target: { id: 'productionId', value } })}
                value={venueFilter.productionId}
                className="bg-white w-full h-fit"
                label="On Production"
                placeholder="Select Production"
                options={productionOptions}
                isSearchable
              />
            </div>
            <Typeahead
              onChange={(value) => onChange({ target: { id: 'country', value } })}
              value={venueFilter.country}
              className="bg-white w-[460px] h-fit"
              label="Country"
              placeholder="Select Country"
              options={countryOptions}
              isSearchable
            />
            <div className=" flex flex-col gap-3 ">
              <Button text="Clear Filters" className="text-sm leading-8 w-[100px]" />
              <Button text="Add New" className="text-sm leading-8 w-[100px]" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
