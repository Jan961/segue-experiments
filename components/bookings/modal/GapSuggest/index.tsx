import { gapSuggestColumnDefs, styleProps } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import Checkbox from 'components/core-ui-lib/Checkbox';
import Table from 'components/core-ui-lib/Table';
import TextInput from 'components/core-ui-lib/TextInput';
import TimeInput from 'components/core-ui-lib/TimeInput';
import { useState } from 'react';

const defaultFormState = {
  minFromLastVenue: null,
  maxFromLastVenue: null,
  maxTravelTimeFromLastVenue: '',
  minToNextVenue: null,
  maxToNextVenue: null,
  maxTravelTimeToNextVenue: '',
  minSeats: null,
  excludeLondonVenues: false,
};

const GapSuggest = () => {
  const [formData, setFormData] = useState(defaultFormState);
  const [rows, setRows] = useState(null);
  const {
    minFromLastVenue,
    minToNextVenue,
    maxFromLastVenue,
    maxToNextVenue,
    maxTravelTimeFromLastVenue,
    maxTravelTimeToNextVenue,
    excludeLondonVenues,
    minSeats,
  } = formData;
  const handleOnChange = (event: any) => {
    let { id, value } = event.target;
    if (id === 'maxTravelTimeFromLastVenue' || id === 'maxTravelTimeToNextVenue') {
      value = `${value.hrs}:${value.min}`;
    } else if (id === 'excludeLondonVenues') {
      value = event.target.checked;
    } else {
      value = value ? parseInt(value, 10) : null;
    }
    setFormData((prev) => ({ ...prev, [id]: value }));
    console.log(id, value, event.target?.checked);
  };
  const gridOptions = {
    autoSizeStrategy: {
      type: 'fitGridWidth',
      defaultMinWidth: 50,
    },
  };
  const getSuggestions = () => {
    setRows([]);
  };
  return (
    <div className="py-4 text-primary-input-text w-[700px]">
      <form>
        <div className="grid grid-cols-12 gap-7">
          <div className="col-span-3"></div>
          <div className="col-span-6 text-center">Mileage</div>
          <div className="col-span-3"></div>
        </div>
        <div className="grid grid-cols-12 gap-7 my-1">
          <div className="col-span-3"></div>
          <div className="col-span-3 text-center">Min</div>
          <div className="col-span-3 text-center">Max</div>
          <div className="col-span-3 text-center">Max Travel Time</div>
        </div>
        <div className="grid grid-cols-12 gap-7 my-1 items-center">
          <div className="col-span-3">From Last Venue</div>
          <div className="col-span-3">
            <TextInput
              className="w-full"
              placeHolder="Enter Miles"
              id="minFromLastVenue"
              value={minFromLastVenue as string}
              onChange={handleOnChange}
            />
          </div>
          <div className="col-span-3">
            <TextInput
              className="w-full"
              placeHolder="Enter Miles"
              id="maxFromLastVenue"
              value={maxFromLastVenue as string}
              onChange={handleOnChange}
            />
          </div>
          <div className="col-span-3">
            <TimeInput
              className="w-full"
              value={maxTravelTimeFromLastVenue}
              onChange={(value) => handleOnChange({ target: { id: 'maxTravelTimeFromLastVenue', value } })}
            />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-7 my-1 items-center">
          <div className="col-span-3">To Next Venue</div>
          <div className="col-span-3">
            <TextInput
              className="w-full"
              placeHolder="Enter Miles"
              id="minToNextVenue"
              value={minToNextVenue as string}
              onChange={handleOnChange}
            />
          </div>
          <div className="col-span-3">
            <TextInput
              className="w-full"
              placeHolder="Enter Miles"
              id="maxToNextVenue"
              value={maxToNextVenue as string}
              onChange={handleOnChange}
            />
          </div>
          <div className="col-span-3">
            <TimeInput
              className="w-full"
              value={maxTravelTimeToNextVenue}
              onChange={(value) => handleOnChange({ target: { id: 'maxTravelTimeToNextVenue', value } })}
            />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-7 my-1">
          <div className="col-span-3">Min No: Seats</div>
          <div className="col-span-3">
            <TextInput
              className="w-full"
              placeHolder="Enter Seats"
              id="minSeats"
              value={minSeats as string}
              onChange={handleOnChange}
            />
          </div>
          <div className="col-span-6 float-right">
            <Checkbox
              className="flex flex-row-reverse"
              labelClassName="!text-base"
              label="Include Excluded Venues"
              id="excludeLondonVenues"
              name="excludeLondonVenues"
              checked={excludeLondonVenues}
              onChange={handleOnChange}
            />
          </div>
        </div>
        <Button onClick={getSuggestions} className="float-right my-3 px-3" variant="primary" text="Get Suggestions" />
      </form>
      {rows !== null && (
        <div className="w-full h-60 flex flex-col">
          <Table columnDefs={gapSuggestColumnDefs} rowData={rows} styleProps={styleProps} gridOptions={gridOptions} />
        </div>
      )}
    </div>
  );
};

export default GapSuggest;
