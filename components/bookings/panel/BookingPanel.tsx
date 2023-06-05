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
import { bookingState } from 'state/booking/bookingState'
import { BookingDTO } from 'interfaces'
import { FormInputButton } from 'components/global/forms/FormInputButton'
import { range } from 'radash'
import { FormInputDate } from 'components/global/forms/FormInputDate'
import { FormInputCheckbox } from 'components/global/forms/FormInputCheckbox'

const getNextBookingId = (bookings: BookingDTO[], current: number) => {
  let found = false
  for (const b of bookings) {
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
  const bookings = useRecoilValue(bookingState)
  const [inputs, setInputs] = React.useState<BookingDTO>(defaultState)
  const booking = bookingDict[bookingId]

  const nextBookingId = getNextBookingId(bookings, bookingId)

  React.useEffect(() => {
    if (!booking) {
      setInputs(undefined)
      return
    }

    setInputs(booking)
  }, [bookingId])

  if (!booking) return (<div className="w-6/12 pl-4" />)

  const saveDetails = async () => {
    const response = await axios({
      method: 'POST',
      url: '/api/bookings/update/',
      data: inputs
    })

    const updated = response.data

    // Can't find a a way to do this automatically, we need Date objects for typescript

    updateBooking(updated)
  }

  const save = async (e) => {
    e.preventDefault()
    saveDetails()
  }

  const handleOnChange = (e: any) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  const saveAndNext = async (e: any) => {
    e.preventDefault()
    saveDetails()
  }

  const initiateDelete = () => {

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
        <ChangeBookingDate bookingId={booking.Id} />
        <FormInputSelect name="VenueId" value={inputs.VenueId ? inputs.VenueId : ''} options={venueOptions} onChange={handleOnChange} />
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
        />
        <FormInputSelect inline
          value={inputs.StatusCode}
          onChange={handleOnChange}
          options={statusOptions}
          name="StatusCode"
          label="Status"
        />
      </div>
      <div className="bg-gray-100 rounded-lg p-4 pb-2">
        <FormInputText
          value={inputs.LandingSite}
          name="LandingSite"
          label="Landing Page"
          onChange={handleOnChange}
          placeholder="http://example.com"
        />
        <div className="grid grid-cols-3">
          <FormInputCheckbox
            value={inputs.OnSale}
            name="OnSale"
            label="On Sale"
            onChange={handleOnChange}
          />
          <FormInputDate
            className="col-span-2"
            value={inputs.OnSaleDate}
            name="OnSaleDate"
            onChange={handleOnChange}
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
          />
        </div>
        <div className="col-span-2 grid grid-cols-2">
          <FormInputButton
            className="rounded-br-none rounded-tr-none w-full border-r border-soft-primary-blue"
            text="Save"
            intent='PRIMARY'
            onClick={save}
          />
          <FormInputButton
            className="rounded-bl-none rounded-tl-none w-full"
            text="Save & Next"
            intent='PRIMARY'
            onClick={saveAndNext}
            disabled={!nextBookingId}
          />
        </div>
      </div>
    </form>
  )
}
