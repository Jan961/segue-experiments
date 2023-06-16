import axios from 'axios'
import { FormInputButton } from 'components/global/forms/FormInputButton'
import { CreateBookingsParams } from 'pages/api/bookings/create'
import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { scheduleSelector } from 'state/booking/selectors/scheduleSelector'
import { getDateBlockId } from './utils/getDateBlockId'
import { viewState } from 'state/booking/viewState'
import { bookingState } from 'state/booking/bookingState'
import { FormInputSelect, SelectOption } from 'components/global/forms/FormInputSelect'
import RangeSlider from 'react-range-slider-input'
import { venueState } from 'state/booking/venueState'
import { findPrevAndNextBookings } from './utils/findPrevAndNextBooking'
import { debounce } from 'radash'
import { GapSuggestionParams, GapSuggestionReponse } from 'pages/api/venue/read/distance'
import { timeFormat } from 'services/dateService'
import { Spinner } from 'components/global/Spinner'

interface GapPanelProps {
  reset: () => void
}

export const GapPanel = ({ reset }: GapPanelProps) => {
  const [venueId, setVenueId] = React.useState<number>(undefined)
  const { selectedDate } = useRecoilValue(viewState)
  const venueDict = useRecoilValue(venueState)
  const [bookingDict, setBookingDict] = useRecoilState(bookingState)
  const schedule = useRecoilValue(scheduleSelector)
  const DateBlockId = getDateBlockId(schedule, selectedDate)
  const [results, setResults] = React.useState<GapSuggestionReponse>(undefined)
  const [refreshing, setRefreshing] = React.useState(false)

  const { nextBookings, prevBookings } = findPrevAndNextBookings(bookingDict, selectedDate)
  const startVIds = prevBookings.map(id => bookingDict[id].VenueId)
  const endVIds = nextBookings.map(id => bookingDict[id].VenueId)

  const startDropDown = startVIds.map((vId): SelectOption => ({
    text: venueDict[vId].Name,
    value: venueDict[vId].Id.toString()
  }))

  const endDropDown = endVIds.map((vId): SelectOption => ({
    text: venueDict[vId].Name,
    value: venueDict[vId].Id.toString()
  }))

  const [inputs, setInputs] = React.useState({
    Miles: [25, 200],
    Mins: [25, 200],
    StartVenue: startDropDown[0]?.value,
    EndVenue: endDropDown[0]?.value
  })

  const createBooking = async () => {
    const newDate: CreateBookingsParams = { DateBlockId, Date: selectedDate, VenueId: venueId }
    const { data } = await axios.post('/api/bookings/create', newDate)
    const newState = { ...bookingDict, [data.Id]: data }
    setBookingDict(newState)
    cancel()
  }

  const cancel = () => {
    setVenueId(undefined)
    reset()
  }

  const search = React.useCallback(async (inputs: any) => {
    setRefreshing(true)
    const body: GapSuggestionParams = {
      ...inputs,
      StartVenue: Number(inputs.StartVenue),
      EndVenue: Number(inputs.EndVenue),
      MinMins: inputs.Mins[0],
      MaxMins: inputs.Mins[1],
      MinMiles: inputs.Miles[0],
      MaxMiles: inputs.Miles[1]
    }
    const { data } = await axios.post('/api/venue/read/distance', body)
    console.log(data)
    setResults(data)
    setRefreshing(false)
  }, [])

  const debouncedSearch = React.useMemo(
    () =>
      debounce({ delay: 750 }, (inputs) => {
        search(inputs)
      }),
    [search]
  )

  React.useEffect(() => {
    debouncedSearch(inputs)
  }, [inputs, debouncedSearch, selectedDate]) // Trigger the debounced search here

  const handleOnChange = (e: any) => {
    console.log(e)
    e.persist()
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: Number(e.target.value)
    }))
    search(inputs)
  }

  const handleRangeChange = (value: number[], name: string) => {
    setInputs((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const resultVenues = results?.VenueInfo?.length
    ? results.VenueInfo.map(({ VenueId, Miles, Mins }) => ({
      text: `${venueDict[VenueId].Name}: ${Miles} mi (${timeFormat(Mins)})`,
      value: VenueId.toString()
    }))
    : [{ text: 'No Venues Available', value: '0' }]

  // One and half times the distance rounded up to 10
  const maxMiles = Math.ceil((results?.OriginalMiles * 1.5) / 10) * 10
  const maxMins = Math.ceil((results?.OriginalMins * 1.5) / 10) * 10

  // const availableDistances = Array.from({ length: 8 }, (_, i) => ({ text: String((i + 1) * 25), value: String((i + 1) * 25) }))

  return (
    <>
      <h3 className='text-lg mb-2 text-center'>Gap Suggest</h3>
      <FormInputSelect
        name="StartVenue"
        label="Start"
        onChange={handleOnChange}
        value={inputs.StartVenue}
        disabled={startDropDown.length <= 1}
        options={startDropDown}
      />
      <FormInputSelect
        name="EndVenue"
        label="End"
        onChange={handleOnChange}
        value={inputs.EndVenue}
        disabled={endDropDown.length <= 1}
        options={endDropDown}
      />
      { !results && (<div className="p-16 mb-4 bg-gray-100 rounded"><Spinner size='md' /></div>)}
      { results && (
        <div className='p-2 pb-px mb-4 bg-gray-100 rounded'>
          <div className="text-center">
            <label className="mr-2">Current Distance:</label>
            <span>{results.OriginalMiles} mi - {timeFormat(results.OriginalMins)}</span>
          </div>
          <label>
            <div className='text-right inline-block text-xs mt-3'>Miles: ({inputs.Miles[0]} to {inputs.Miles[1]})</div>
            <RangeSlider
              min={0} max={maxMiles} step={5} name="Miles"
              onInput={(x: number[]) => handleRangeChange(x, 'Miles')} className="my-4" value={inputs.Miles} />
          </label>
          <label>
            <div className='text-right inline-block text-xs mt-3'>Minutes: ({inputs.Mins[0]} to {inputs.Mins[1]})</div>
            <RangeSlider
              min={0} max={maxMins} step={5} name="Mins"
              onInput={(x: number[]) => handleRangeChange(x, 'Mins')} className="my-4" value={inputs.Mins} />
          </label>
          <br />
          { refreshing && (<div className="p-6"><Spinner size='sm'/></div>)}
          { !refreshing && (
            <FormInputSelect
              label={`Results (${results.VenueInfo.length})`}
              options={resultVenues}
              disabled={results.VenueInfo.length === 0}
              value={resultVenues?.length ? resultVenues[0].value : 0}
              name="VenueId"
              onChange={handleOnChange}
            />
          )}
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <FormInputButton onClick={cancel} text="Cancel" />
        <FormInputButton onClick={createBooking} disabled={!venueId} intent="PRIMARY" text="Create" />
      </div>
    </>
  )
}
