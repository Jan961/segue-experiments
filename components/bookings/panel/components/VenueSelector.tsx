import { VenueInfo } from 'components/bookings/modal/VenueInfo'
import ViewBookingHistory from 'components/bookings/modal/ViewBookingHistory'
import { FormInputSelect, SelectOption } from 'components/global/forms/FormInputSelect'
import { VenueMinimalDTO } from 'interfaces'
import { useRecoilValue } from 'recoil'
import { venueState } from 'state/booking/venueState'

export interface VenueSelectorProps {
  venueId: number,
  onChange: (e: any) => void,
  disabled?: boolean
  options?: SelectOption[]
  label?: string
}

export const VenueSelector = ({ venueId, onChange, disabled, options, label }: VenueSelectorProps) => {
  const venues = useRecoilValue(venueState)

  const venueOptions: SelectOption[] = [
    { text: 'Please Select a Venue', value: '' },
    ...Object.values(venues).map((v: VenueMinimalDTO) => ({ text: v.Name, value: String(v.Id) })
    )]

  return (
    <>
      <FormInputSelect
        name="VenueId"
        value={venueId || ''}
        label={label}
        options={options || venueOptions}
        onChange={onChange}
        disabled={disabled}
      />
      <div className="columns-2 mb-4">
        <VenueInfo venueId={venueId} />
        <ViewBookingHistory venueId={venueId}></ViewBookingHistory>
      </div>
    </>
  )
}