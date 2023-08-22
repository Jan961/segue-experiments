import React from 'react'
import axios from 'axios'
import { useRecoilState, useRecoilValue } from 'recoil'
import { FormInputSelect, SelectOption } from 'components/global/forms/FormInputSelect'
import { ChangeBookingDate } from '../modal/ChangeBookingDate'
import { BookingDTO } from 'interfaces'
import { FormInputButton } from 'components/global/forms/FormInputButton'
import { sortedBookingSelector } from 'state/booking/selectors/sortedBookingSelector'
import { viewState } from 'state/booking/viewState'
import { bookingState } from 'state/booking/bookingState'
import { omit } from 'radash'
import { DeleteConfirmation } from 'components/global/DeleteConfirmation'
import { VenueSelector } from './components/VenueSelector'
import { getNextId } from './utils/getNextId'
import { distanceState } from 'state/booking/distanceState'
import { FormInputText } from 'components/global/forms/FormInputText'

interface BookingPanelProps {
  bookingId: number
}

export const BookingPanel = ({ bookingId }: BookingPanelProps) => {
  const [bookingDict, setBookingDict] = useRecoilState(bookingState)
  const sortedBookings = useRecoilValue(sortedBookingSelector)
  const [distance, setDistance] = useRecoilState(distanceState)
  const [view, setView] = useRecoilState(viewState)
  const [status, setStatus] = React.useState({ submitting: false, changed: false })
  const { submitting, changed } = status
  const booking = bookingDict[bookingId]
  const nextBookingId = getNextId(sortedBookings, bookingId)
  const [inputs, setInputs] = React.useState<BookingDTO>(booking)
  const [deleting, setDeleting] = React.useState(false)

  React.useEffect(() => {
    if (!booking) {
      setInputs(undefined)
      return
    }

    setInputs(booking)
    setStatus({ submitting: false, changed: false })
  }, [bookingId, booking])

  if (!booking) return (<div className="w-6/12 pl-4" />)

  const saveDetails = async () => {
    const response = await axios({
      method: 'POST',
      url: '/api/bookings/update/',
      data: inputs
    })

    const incoming = response.data
    const replacement = { ...bookingDict, [incoming.Id]: incoming }

    setBookingDict(replacement)
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
    let { id, value } = e

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
    if (changed) await save(e)
    const nextBooking = bookingDict[nextBookingId]
    setView({ selectedDate: nextBooking.Date.split('T')[0], selected: { type: 'booking', id: nextBookingId } })
  }

  const initiateDelete = async () => {
    setDeleting(true)
  }

  const performDelete = async () => {
    setDeleting(false)
    await axios.post('/api/bookings/delete', { bookingId })
    const newState = omit(bookingDict, [bookingId])
    setView({ selectedDate: undefined, selected: undefined })
    setBookingDict(newState)
    setDistance({ ...distance, outdated: true })
  }

  const statusOptions: SelectOption[] = [
    { text: 'Confirmed (C)', value: 'C' },
    { text: 'Unconfirmed (U)', value: 'U' },
    { text: 'Canceled (X)', value: 'X' }
  ]
  const pencilOptions: SelectOption[] = [1, 2, 3].map((i) => ({ text: i.toString(), value: i.toString() }))

  const notFirst = !booking.Date.startsWith(view.selectedDate)

  return (
    <form>
      { deleting && (
        <DeleteConfirmation
          title="Delete Booking"
          onCancel={() => setDeleting(false)}
          onConfirm={performDelete}>
          <p>This will the delete the booking and related performances</p>
        </DeleteConfirmation>
      )}
      <div className={notFirst ? 'opacity-50' : ''}>
        <div className="bg-primary-blue rounded-lg flex flex-col justify-center mb-2 p-4 pb-0">
          <ChangeBookingDate disabled={submitting || notFirst} bookingId={booking.Id} />
          <VenueSelector
            onChange={(value:any) => handleOnChange({ target: { id: 'VenueId', value } })}
            venueId={inputs.VenueId} />
        </div>

        <div className="flex flex-row justify-between gap-4">
          <FormInputSelect inline
            className="w-28 mb-0"
            value={inputs.PencilNum}
            onChange={handleOnChange}
            options={pencilOptions}
            name="PencilNum"
            label="Pencil"
            disabled={submitting || notFirst}
          />
          <FormInputSelect inline
            value={inputs.StatusCode}
            className="mb-0"
            onChange={handleOnChange}
            options={statusOptions}
            name="StatusCode"
            label="Status"
            disabled={submitting || notFirst}
          />
        </div>
        <FormInputText
          value={inputs.Notes}
          onChange={(e:any) => handleOnChange('Notes', e.target.value)}
          name="Notes"
          label="Notes"
          area />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <FormInputButton
            className="w-full"
            text="Delete"
            intent="DANGER"
            onClick={initiateDelete}
            disabled={submitting || notFirst}
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
            text={!changed ? 'Next' : 'Save & Next'}
            intent='PRIMARY'
            onClick={saveAndNext}
            disabled={submitting || !nextBookingId}
          />
        </div>
      </div>
    </form>
  )
}
