import Typeahead from 'components/global/Typeahead';
import { VenueInfo } from 'components/bookings/modal/VenueInfo';
import ViewBookingHistory from 'components/bookings/modal/ViewBookingHistory';
import { SelectOption } from 'components/global/forms/FormInputSelect';
import { VenueMinimalDTO } from 'interfaces';
import { useRecoilValue } from 'recoil';
import { venueState } from 'state/booking/venueState';

export interface VenueSelectorProps {
  venueId: number;
  onChange: (e: number) => void;
  options?: SelectOption[];
  disabled?: boolean;
}
export const VenueSelector = ({ venueId, onChange, options, disabled = false }: VenueSelectorProps) => {
  const venues = useRecoilValue(venueState);

  const venueOptions = [
    { name: 'Please Select a Venue', value: '' },
    ...Object.values(venues).map((v: VenueMinimalDTO) => ({
      value: v.Id,
      name: `${v.Code} - ${v.Name}, ${v.Town}`,
    })),
  ];


  const onSelect = (selectedOption) => {
    onChange(selectedOption ? selectedOption.value : null);
  };
  return (
    <>
      <Typeahead
        dropdownClassName=""
        label="Venue"
        name="Venue"
        onChange={onSelect}
        options={venueOptions}
        placeholder="Please Select a Venue"
        value={venueId.toString()}
      />
      <div className="columns-2 mb-4">
        <VenueInfo venueId={venueId} />
        <ViewBookingHistory venueId={venueId}></ViewBookingHistory>
      </div>
    </>
  );
};
