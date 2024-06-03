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
  const venueOptions = useRecoilValue(venueOptionsSelector([]));
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
