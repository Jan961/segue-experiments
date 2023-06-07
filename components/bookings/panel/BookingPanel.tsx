import ViewBookingHistory from '../modal/ViewBookingHistory'
import React from 'react'
import axios from 'axios'
import { VenueInfo } from '../modal/VenueInfo'
import { venueState } from 'state/booking/venueState'
import { useRecoilState, useRecoilValue } from 'recoil'
import { FormInputSelect, SelectOption } from 'components/global/forms/FormInputSelect'
import { bookingDictSelector } from 'state/booking/selectors/bookingDictSelector'
import { ChangeBookingDate } from '../modal/ChangeBookingDate'
import { FormInputText } from 'components/global/forms/FormInputText'
import { BookingDTO } from 'interfaces'
import { FormInputButton } from 'components/global/forms/FormInputButton'
import { FormInputDate } from 'components/global/forms/FormInputDate'
import { FormInputCheckbox } from 'components/global/forms/FormInputCheckbox'
import { sortedBookingSelector } from 'state/booking/selectors/sortedBookingSelector'

const getNextBookingId = (sortedBookings: BookingDTO[], current: number) => {
  let found = false

  for (const b of sortedBookings) {
    if (found) return b.Id
    if (current === b.Id) found = true
  }
  return undefined
}

interface BookingPanelProps {
  bookingId: number
}

export const BookingPanel = ({ bookingId }: BookingPanelProps) => {
  const defaultState: any = {}
  const venues = useRecoilValue(venueState)
  const [bookingDict, updateBooking] = useRecoilState(bookingDictSelector)
  const sortedBookings = useRecoilValue(sortedBookingSelector)
  const [inputs, setInputs] = React.useState<BookingDTO>(defaultState)
  const [status, setStatus] = React.useState({ submitting: false, changed: false })
  const { submitting, changed } = status

  const nextBookingId = getNextBookingId(sortedBookings, bookingId)

  React.useEffect(() => {
    const booking = bookingDict[bookingId]

    if (!booking) {
      setInputs(undefined)
      return
    }

    setInputs(booking)
    setStatus({ submitting: false, changed: false })
  }, [bookingId, bookingDict])

  const booking = bookingDict[bookingId]
  if (!booking) return (<div className="w-6/12 pl-4" />)

  const saveDetails = async () => {
    const response = await axios({
      method: 'POST',
      url: '/api/bookings/update/',
      data: inputs
    })

    const updated = response.data
    updateBooking(updated)
  }

  const save = async (e) => {
    e.preventDefault()
    setStatus({ submitting: true, changed: true })
    try {
      await saveDetails()
      setStatus({ submitting: false, changed: false })
    } catch {
      alert('An error occured while submitting')
      setStatus({ submitting: false, changed: true })
    }
  }

  const handleOnChange = (e: any) => {
    let { id, value } = e.target
    // Handle numeric fields
    if (id === 'PencilNum') value = value ? parseInt(value) : null
    if (id === 'VenueId') value = value ? parseInt(value) : null

    setInputs((prev) => ({
      ...prev,
      [id]: value
    }))
    setStatus({ submitting: false, changed: true })
  }

  const saveAndNext = async (e: any) => {
    e.preventDefault()
    if (changed) saveDetails()
  }

  const initiateDelete = () => {
    alert('Not Implimented, but will confirm')
  }

  const venueOptions: SelectOption[] = [{ text: 'Please Select a Venue', value: '' }, ...venues.map(x => ({ text: x.Name, value: String(x.Id) }))]
  const statusOptions: SelectOption[] = [
    { text: 'Confirmed (C)', value: 'C' },
    { text: 'Unconfirmed (U)', value: 'U' },
    { text: 'Canceled (X)', value: 'X' }
  ]
  const pencilOptions: SelectOption[] = [1, 2, 3].map((i) => ({ text: i.toString(), value: i.toString() }))

  return (
    <form>
      <div className="bg-primary-blue rounded-lg flex flex-col justify-center mb-4 p-4 pb-0">
        <ChangeBookingDate disabled={submitting} bookingId={booking.Id} />
        <FormInputSelect
          name="VenueId"
          value={inputs.VenueId ? inputs.VenueId : ''}
          options={venueOptions}
          onChange={handleOnChange}
          disabled={submitting}
        />
        <div className="columns-2 mb-4">
          <VenueInfo venueId={inputs.VenueId} />
          <ViewBookingHistory venueId={inputs.VenueId}></ViewBookingHistory>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormInputSelect inline
          value={inputs.PencilNum}
          onChange={handleOnChange}
          options={pencilOptions}
          name="PencilNum"
          label="Pencil Num"
          disabled={submitting}
        />
        <FormInputSelect inline
          value={inputs.StatusCode}
          onChange={handleOnChange}
          options={statusOptions}
          name="StatusCode"
          label="Status"
          disabled={submitting}
        />
      </div>
      <div className="bg-gray-100 rounded-lg p-2 pb-0">
        <FormInputText
          value={inputs.LandingSite}
          name="LandingSite"
          label="Landing Page"
          onChange={handleOnChange}
          placeholder="http://example.com"
          disabled={submitting}
        />
        <div className="grid grid-cols-3">
          <FormInputCheckbox
            value={inputs.OnSale}
            name="OnSale"
            label="On Sale"
            onChange={handleOnChange}
            disabled={submitting}
          />
          <FormInputDate
            className="col-span-2"
            value={inputs.OnSaleDate}
            name="OnSaleDate"
            onChange={handleOnChange}
            disabled={submitting}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 py-4 pb-0">
        <div>
          <FormInputButton
            className="w-full"
            text="Delete"
            intent="DANGER"
            onClick={initiateDelete}
            disabled={submitting}
          />
        </div>
        <div className="col-span-2 grid grid-cols-2">
          <FormInputButton
            className="rounded-br-none rounded-tr-none w-full border-r border-soft-primary-blue"
            text="Save"
            intent='PRIMARY'
            disabled={submitting || !changed}
            onClick={save}
          />
          <FormInputButton
            className="rounded-bl-none rounded-tl-none w-full"
            text={!changed ? 'Next' : 'Save and Next'}
            intent='PRIMARY'
            onClick={saveAndNext}
            disabled={submitting || !nextBookingId}
          />
        </div>
      </div>
    </form>
  )
}
