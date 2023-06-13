import React from 'react'
import { BookingDTO, RehearsalDTO, GetInFitUpDTO, VenueMinimalDTO, PerformanceDTO } from 'interfaces'
import { RecoilState, useRecoilCallback } from 'recoil'
import { bookingState } from 'state/booking/bookingState'
import { DateBlockState, dateBlockState } from 'state/booking/dateBlockState'
import { DistanceState, distanceState } from 'state/booking/distanceState'
import { getInFitUpState } from 'state/booking/getInFitUpState'
import { rehearsalState } from 'state/booking/rehearsalState'
import { venueState } from 'state/booking/venueState'
import { performanceState } from 'state/booking/performanceState'
import { DateTypeState, dateTypeState } from 'state/booking/dateTypeState'
import { OtherState, otherState } from 'state/booking/otherState'

/*
  Experimental attempt to get Recoil.js working with SSR in React in a DRY manner.
  Anything included as a prop in `initialState` that fits the following interface
  will be automatically instanciated, both client side and server side
*/

export type InitialState = Partial<{
  booking: Record<number, BookingDTO>,
  rehearsal: Record<number, RehearsalDTO>,
  getInFitUp: Record<number, GetInFitUpDTO>,
  other: OtherState
  dateBlock: DateBlockState,
  dateType: DateTypeState,
  performance: Record<number, PerformanceDTO>,
  distance: DistanceState,
  venue: Record<number, VenueMinimalDTO>,
}>

const states: Record<keyof InitialState, RecoilState<any>> = {
  booking: bookingState,
  rehearsal: rehearsalState,
  getInFitUp: getInFitUpState,
  other: otherState,
  dateType: dateTypeState,
  venue: venueState,
  distance: distanceState,
  dateBlock: dateBlockState,
  performance: performanceState
}

export const setInitialStateServer = (snapshot, initialState: InitialState) => {
  for (const key in initialState) {
    const state = states[key]
    if (state) snapshot.set(state, initialState[key])
  }
}

// Helper function to prevent having to manually type in every state
const useSetMultipleRecoilStates = () => {
  return useRecoilCallback(({ set }) => (initialData: InitialState) => {
    for (const key in initialData) {
      const state = states[key]
      if (state) set(state, initialData[key])
    }
  }, [])
}

// Included at the root of the app to automatically set any states it can
export const ClientStateSetter = ({ intitialState }: {
  intitialState: InitialState
}) => {
  const setMultipleRecoilStates = useSetMultipleRecoilStates()

  React.useEffect(() => {
    if (intitialState) {
      setMultipleRecoilStates(intitialState)
    }
  }, [intitialState, setMultipleRecoilStates])

  return null
}
