import Typeahead from 'components/Typeahead'
import { VenueInfo } from 'components/bookings/modal/VenueInfo'
import ViewBookingHistory from 'components/bookings/modal/ViewBookingHistory'
import { SelectOption } from 'components/global/forms/FormInputSelect'
import { VenueMinimalDTO } from 'interfaces'
import { useRecoilValue } from 'recoil'
import { venueState } from 'state/booking/venueState'

export interface VenueSelectorProps {
  venueId: number,
  onChange: (e: number) => void,
  options?: SelectOption[]
}

export const VenueSelector = ({ venueId, onChange, options }: VenueSelectorProps) => {
  const venues = useRecoilValue(venueState)
  const venueOptions: SelectOption[] = [
    { text: 'Please Select a Venue', value: '' },
    ...Object.values(venues).map((v: VenueMinimalDTO) => ({ text: `${v.Code} - ${v.Name}, ${v.Town}`, value: String(v.Id), code: v.Code, town: v.Town })
    )]
  const onSelect = (option:SelectOption) => {
    onChange(option.value as number)
  }
  return (
    <>
      <Typeahead
        options={options || venueOptions}
        onChange={onSelect}
        placeholder={'Please Select a Venue'}
        value={venueId}
        searchKeys={['code', 'Town']}
      />
      <div className="columns-2 mb-4">
        <VenueInfo venueId={venueId} />
        <ViewBookingHistory venueId={venueId}></ViewBookingHistory>
      </div>
    </>
  )
}
