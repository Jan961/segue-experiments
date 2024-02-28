import { getTimeInMins } from 'components/bookings/panel/utils/AddNewBooking';
import Button from 'components/core-ui-lib/Button';
import Checkbox from 'components/core-ui-lib/Checkbox';
import TextInput from 'components/core-ui-lib/TextInput';
import TimeInput from 'components/core-ui-lib/TimeInput';
import { DEFAULT_GAP_SUGGEST_FORM_STATE } from 'config/AddBooking';
import { GapSuggestionUnbalancedProps } from 'pages/api/venue/read/distance';
import { useState } from 'react';

type FormProps = {
  onSave: (data: Partial<GapSuggestionUnbalancedProps>) => Promise<void>;
};

const Form = ({ onSave }: FormProps) => {
  const [formData, setFormData] = useState(DEFAULT_GAP_SUGGEST_FORM_STATE);
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
  };
  const getSuggestions = () => {
    const data: Partial<GapSuggestionUnbalancedProps> = {
      MinFromMiles: formData.minFromLastVenue,
      MaxFromMiles: formData.maxFromLastVenue,
      MinToMiles: formData.minToNextVenue,
      MaxToMiles: formData.maxToNextVenue,
      ExcludeLondonVenues: formData.excludeLondonVenues,
      MinSeats: formData.minSeats,
      MaxFromTime: getTimeInMins(formData.maxTravelTimeFromLastVenue),
      MaxToTime: getTimeInMins(formData.maxTravelTimeToNextVenue),
    };
    onSave(data);
  };
  return (
    <form>
      <div className="grid grid-cols-12 gap-7">
        <div className="col-span-2"></div>
        <div className="col-span-8 text-center">Mileage</div>
        <div className="col-span-2"></div>
      </div>
      <div className="grid grid-cols-12 gap-7 my-1">
        <div className="col-span-2"></div>
        <div className="col-span-4 text-center">Min</div>
        <div className="col-span-3 text-center">Max</div>
        <div className="col-span-3 text-right">Max Travel Time</div>
      </div>
      <div className="grid grid-cols-12 gap-3 my-2 items-center">
        <div className="col-span-2 text-sm">From Last Venue</div>
        <div className="col-span-4">
          <TextInput
            className="w-full"
            placeHolder="Enter Miles"
            id="minFromLastVenue"
            value={minFromLastVenue as string}
            onChange={handleOnChange}
          />
        </div>
        <div className="col-span-4">
          <TextInput
            className="w-full"
            placeHolder="Enter Miles"
            id="maxFromLastVenue"
            value={maxFromLastVenue as string}
            onChange={handleOnChange}
          />
        </div>
        <div className="col-span-2 flex justify-center items-center">
          <TimeInput
            className="w-fit h-[31px] [&>input]:!h-[25px] [&>input]:!w-11 !justify-center shadow-input-shadow"
            value={maxTravelTimeFromLastVenue}
            onChange={(value) => handleOnChange({ target: { id: 'maxTravelTimeFromLastVenue', value } })}
          />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 my-2 items-center">
        <div className="col-span-2 text-sm">To Next Venue</div>
        <div className="col-span-4">
          <TextInput
            className="w-full"
            placeHolder="Enter Miles"
            id="minToNextVenue"
            value={minToNextVenue as string}
            onChange={handleOnChange}
          />
        </div>
        <div className="col-span-4">
          <TextInput
            className="w-full"
            placeHolder="Enter Miles"
            id="maxToNextVenue"
            value={maxToNextVenue as string}
            onChange={handleOnChange}
          />
        </div>
        <div className="col-span-2 flex justify-center items-center">
          <TimeInput
            className="w-fit h-[31px] [&>input]:!h-[25px] [&>input]:!w-11 !justify-center shadow-input-shadow"
            value={maxTravelTimeToNextVenue}
            onChange={(value) => handleOnChange({ target: { id: 'maxTravelTimeToNextVenue', value } })}
          />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 my-2">
        <div className="col-span-2 text-sm">Min No: Seats</div>
        <div className="col-span-4">
          <TextInput
            className="w-full"
            placeHolder="Enter Seats"
            id="minSeats"
            value={minSeats as string}
            onChange={handleOnChange}
          />
        </div>
        <div className="col-span-6 items-center justify-end flex">
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
      <Button
        onClick={getSuggestions}
        className="float-right px-4 font-normal"
        variant="primary"
        text="Get Suggestions"
      />
    </form>
  );
};

export default Form;
