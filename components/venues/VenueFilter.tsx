import Button from 'components/core-ui-lib/Button';
import Select, { SelectOption } from 'components/core-ui-lib/Select/Select';
import TextInput from 'components/core-ui-lib/TextInput';
import React, { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { filterVenueState, intialVenueFilterState } from 'state/booking/filterVenueState';
import { productionOptionsSelector } from 'state/booking/selectors/productionOptionsSelector';
export default function VenueFilter({
  countryOptions,
  townOptions,
  onSearchInputChange,
}: {
  countryOptions: SelectOption[];
  townOptions: SelectOption[];
  onSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [venueFilter, setVenueFilter] = useRecoilState(filterVenueState);
  const [venueSearch, setVenueSearch] = useState<string>('');
  const productionOptions = useRecoilValue(productionOptionsSelector(true));
  const onChange = (e: any) => {
    setVenueFilter({ ...venueFilter, [e.target.id]: e.target.value });
  };

  const onClearFilters = () => {
    setVenueFilter(intialVenueFilterState);
  };

  const handelSearchInputChange = (e) => {
    setVenueSearch(e.target.value);
    onSearchInputChange(e);
  };

  return (
    <>
      <div className="w-full flex items-center justify-between flex-wrap">
        <div className=" w-full flex flex-row ">
          <h1 className={`text-4xl font-bold text-primary-orange`}>Venues</h1>
          <div className="px-4 flex  gap-4 flex-wrap  py-1 w-full">
            <div className="w-full flex flex-row gap-5">
              <Select
                onChange={(value) => onChange({ target: { id: 'town', value } })}
                value={venueFilter.town}
                className="bg-white w-full font-bold h-fit"
                label="Town"
                placeholder="Select Town"
                options={townOptions}
              />

              <Select
                onChange={(value) => onChange({ target: { id: 'productionId', value } })}
                value={venueFilter.productionId}
                className="bg-white w-full font-bold h-fit"
                label="On Production"
                placeholder="Select Production"
                options={productionOptions}
              />
            </div>
            <div className="flex items-start gap-4 w-full ">
              <Select
                onChange={(value) => onChange({ target: { id: 'country', value } })}
                value={venueFilter.country}
                className="bg-white w-full h-fit font-bold"
                label="Country"
                placeholder="Select Country"
                options={countryOptions}
              />
              <TextInput
                id={'venueText'}
                // disabled={!venueFilter.productionId}
                placeHolder="Search venues..."
                className="w-[510px] !align-top"
                iconName="search"
                value={venueSearch}
                onChange={handelSearchInputChange}
              />
              <div className=" flex flex-col gap-3 w-full place-items-end  ">
                <Button text="Clear Filters" className="text-sm leading-8 w-[100px]" onClick={onClearFilters} />
                <Button text="Add New" className="text-sm leading-8 w-[100px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
