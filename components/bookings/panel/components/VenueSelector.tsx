import FormTypeahead from 'components/global/forms/FormTypeahead';
import { VenueInfo } from 'components/bookings/modal/VenueInfo';
import ViewBookingHistory from 'components/bookings/modal/ViewBookingHistory';
import { useRecoilValue } from 'recoil';
import { venueOptionsSelector } from 'state/booking/selectors/venueOptionsSelector';

export interface VenueSelectorProps {
  venueId: number;
  onChange: (e: number) => void;
  disabled?: boolean;
}
export const VenueSelector = ({ venueId, onChange, disabled = false }: VenueSelectorProps) => {
  console.log('About to load the recoil value for VenueSelector');

  const venueOptions = useRecoilValue(venueOptionsSelector([]));
  console.log(venueOptions);
  console.log('I passed');

  return (
    <>
      <FormTypeahead
        className="mb-4"
        name="Venue"
        onChange={(value) => onChange(Number(value))}
        options={venueOptions}
        disabled={disabled}
        placeholder="Please select a Venue"
        value={venueId}
      />
      <div className="columns-2 mb-4">
        <VenueInfo venueId={venueId} />
        <ViewBookingHistory venueId={venueId} />
      </div>
    </>
  );
};
