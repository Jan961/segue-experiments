import axios from 'axios'
import { FormInputButton } from 'components/global/forms/FormInputButton'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { viewState } from 'state/booking/viewState'
import { bookingState } from 'state/booking/bookingState'
import { FormInputSelect, SelectOption } from 'components/global/forms/FormInputSelect'
import RangeSlider from 'react-range-slider-input'
import { venueState } from 'state/booking/venueState'
import { findPrevAndNextBookings } from './utils/findPrevAndNextBooking'
import { debounce } from 'radash'
import { GapSuggestionReponse, GapSuggestionUnbalancedProps, VenueWithDistance } from 'pages/api/venue/read/distance'
import { timeFormat } from 'services/dateService'
import { Spinner } from 'components/global/Spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalculator, faSliders } from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import classNames from 'classnames'
import { FormInputNumeric } from 'components/global/forms/FormInputNumeric'

interface ToggleButtonProps {
  icon: IconProp
  className: string
  active?: boolean
  onClick: (e: any) => void
}

const ToggleButton = ({ icon, className, active, onClick }: ToggleButtonProps) => {
  let baseClass = 'rounded-tl-0 rounded-tl-0 p-2 w-12 rounded bg-gray-200 border cursor-pointer border-gray-300'
  if (active) baseClass = classNames(baseClass, 'bg-primary-blue text-white border-primary-blue')

  return (
    <button onClick={onClick} className={classNames(baseClass, className)}>
      <FontAwesomeIcon icon={icon} />
    </button>
  )
}

interface GapPanelProps {
  reset: () => void
  setGapVenueIds: (ids: VenueWithDistance[]) => void
}

export const GapPanel = ({ reset, setGapVenueIds }: GapPanelProps) => {
  const { selectedDate } = useRecoilValue(viewState)
  const venueDict = useRecoilValue(venueState)
  const bookingDict = useRecoilValue(bookingState)
  const [results, setResults] = React.useState<GapSuggestionReponse>(undefined)
  const [refreshing, setRefreshing] = React.useState(false)
  const [sliderActive, setSlidersActive] = React.useState(false)
  const { nextBookings, prevBookings } = findPrevAndNextBookings(bookingDict, selectedDate)
  const startVIds = prevBookings.map(id => bookingDict[id].VenueId)
  const endVIds = nextBookings.map(id => bookingDict[id].VenueId)
  const [sliderMax, setSliderMax] = React.useState<number>(undefined)

  const startDropDown = startVIds.map((vId): SelectOption => ({
    text: venueDict[vId].Name,
    value: venueDict[vId].Id.toString()
  }))

  const endDropDown = endVIds.map((vId): SelectOption => ({
    text: venueDict[vId].Name,
    value: venueDict[vId].Id.toString()
  }))

  const [inputs, setInputs] = React.useState({
    From: [25, 200],
    To: [25, 200],
    VenueId: 0,
    StartVenue: Number(startDropDown[0]?.value),
    EndVenue: Number(endDropDown[0]?.value)
  })

  const [venueInputs, setVenueInputs] = React.useState({
    StartVenue: Number(startDropDown[0]?.value),
    EndVenue: Number(endDropDown[0]?.value)
  })

  const next = () => {
    setGapVenueIds(results.VenueInfo)
  }

  const cancel = () => {
    reset()
  }

  const search = React.useCallback(async (inputs: any) => {
    const body: GapSuggestionUnbalancedProps = {
      ...inputs,
      StartVenue: inputs.StartVenue,
      EndVenue: inputs.EndVenue,
      MinFromMiles: inputs.From[0],
      MaxFromMiles: inputs.From[1],
      MinToMiles: inputs.To[0],
      MaxToMiles: inputs.To[1]
    }
    const { data } = await axios.post<GapSuggestionReponse>('/api/venue/read/distance', body)

    setResults(data)
    setRefreshing(false)
  }, [])

  const debouncedSearch = React.useMemo(
    () =>
      debounce({ delay: 500 }, (inputs) => {
        search(inputs)
      }),
    [search]
  )

  React.useEffect(() => {
    if (refreshing) debouncedSearch(inputs)
  }, [inputs, debouncedSearch, refreshing])

  React.useEffect(() => {
    const intitalSearch = async (initialInputs) => {
      setResults(undefined)

      const body: GapSuggestionUnbalancedProps = {
        StartVenue: venueInputs.StartVenue,
        EndVenue: venueInputs.EndVenue
      }

      const { data } = await axios.post<GapSuggestionReponse>('/api/venue/read/distance', body)

      const { DefaultMin, SliderMax } = data

      setResults(data)
      setInputs({ ...initialInputs, From: [DefaultMin, SliderMax], To: [DefaultMin, SliderMax] })
      setSliderMax(SliderMax)
    }

    intitalSearch(venueInputs)
  }, [venueInputs]) // Trigger the debounced search here

  const handleVenueChange = (e: any) => {
    e.persist()
    setVenueInputs((prev) => ({
      ...prev,
      [e.target.id]: Number(e.target.value)
    }))
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: Number(e.target.value)
    }))
  }

  const handleRangeChange = (value: number[], name: string) => {
    setInputs((prev) => ({
      ...prev,
      [name]: value
    }))
    setRefreshing(true)
  }

  const resultVenues = results?.VenueInfo?.length ? results?.VenueInfo?.length : 0

  return (
    <>
      <h3 className='text-lg mb-2 text-center'>Gap Suggest</h3>
      <FormInputSelect
        name="StartVenue"
        label="Start"
        onChange={handleVenueChange}
        value={venueInputs.StartVenue}
        disabled={startDropDown.length <= 1}
        options={startDropDown}
      />
      <FormInputSelect
        name="EndVenue"
        label="End"
        onChange={handleVenueChange}
        value={venueInputs.EndVenue}
        disabled={endDropDown.length <= 1}
        options={endDropDown}
      />
      { !results && (<div className="p-16 mb-4 bg-gray-100 rounded"><Spinner size='md' /></div>)}
      { results && (
        <div className='pb-px mb-4 bg-gray-100 rounded p-2'>
          <div className='float-right mb-2'>
            <ToggleButton active={!sliderActive} onClick={() => { setSlidersActive(!sliderActive) }} className='rounded-r-none border-r-0' icon={faCalculator} />
            <ToggleButton active={sliderActive} onClick={() => { setSlidersActive(!sliderActive) }} className='rounded-l-none' icon={faSliders} />
          </div>
          <div>
            <label className="mr-2 text-bold">Current</label>
            <br />
            <span>{results.OriginalMiles} mi - {timeFormat(results.OriginalMins)}</span>
          </div>
          { sliderActive && (
            <>
              <label>
                <div className='text-right inline-block text-xs mt-3'>Miles From Prev: ({inputs.From[0]} to {inputs.From[1]})</div>
                <RangeSlider
                  min={0} max={sliderMax} step={5} name="From"
                  onInput={(x: number[]) => handleRangeChange(x, 'From')} className="my-4" value={inputs.From} />
              </label>
              <label>
                <div className='text-right inline-block text-xs mt-3'>Miles To Next: ({inputs.To[0]} to {inputs.To[1]})</div>
                <RangeSlider
                  min={0} max={sliderMax} step={5} name="To"
                  onInput={(x: number[]) => handleRangeChange(x, 'To')} className="my-4 mb-0" value={inputs.To} />
              </label>
            </>
          )}
          { !sliderActive && (
            <>
              <div className='grid grid-cols-3 clear-both gap-2 items-center'>
                <label>From</label>
                <FormInputNumeric className='mb-0'
                  name="FromMin"
                  onChange={(value) => handleRangeChange([value, inputs.From[1]], 'From')}
                  value={inputs.From[0]}/>
                <FormInputNumeric className='mb-0'
                  name="FromMax"
                  onChange={(value) => handleRangeChange([inputs.From[0], value], 'From')}
                  value={inputs.From[1]}/>
              </div>
              <div className='grid grid-cols-3 mt-2 gap-2 items-center'>
                <label>To</label>
                <FormInputNumeric className='mb-0'
                  name="ToMin"
                  onChange={(value) => handleRangeChange([value, inputs.To[1]], 'To')}
                  value={inputs.To[0]}/>
                <FormInputNumeric className='mb-0'
                  name="ToMax"
                  onChange={(value) => handleRangeChange([inputs.To[0], value], 'To')}
                  value={inputs.To[1]}/>
              </div>
            </>
          )}
          <br />
          { refreshing && (<div className="p-2 pt-0"><Spinner size='sm'/></div>)}
          { !refreshing && (
            <div className="text-lg text-center p-2">
              {resultVenues} Venue(s) matched
            </div>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <FormInputButton onClick={cancel} text="Cancel" />
        <FormInputButton onClick={next} disabled={!results?.VenueInfo} intent="PRIMARY" text="Next" />
      </div>
    </>
  )
}
