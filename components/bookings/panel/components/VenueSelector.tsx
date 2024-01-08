import { useMemo } from 'react';
import FormTypeahead from 'components/global/forms/FormTypeahead';
import { VenueInfo } from 'components/bookings/modal/VenueInfo';
import ViewBookingHistory from 'components/bookings/modal/ViewBookingHistory';
import { VenueMinimalDTO } from 'interfaces';
import { useRecoilValue } from 'recoil';
import { venueState } from 'state/booking/venueState';

export interface VenueSelectorProps {
  venueId: number;
  onChange: (e: number) => void;
  disabled?: boolean;
}
export const VenueSelector = ({ venueId, onChange, disabled = false }: VenueSelectorProps) => {
  const venues = useRecoilValue(venueState);

  const venueOptions = useMemo(
    () =>
      Object.values(venues).map((v: VenueMinimalDTO) => ({
        value: v.Id,
        name: `${v.Code} - ${v.Name}, ${v.Town}`,
      })),
    [venues],
  );
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
        <ViewBookingHistory venueId={venueId}></ViewBookingHistory>
      </div>
    </>
  );
};
