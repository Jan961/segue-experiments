import React from 'react'
import { BookingDTO, RehearsalDTO, GetInFitUpDTO, DateBlockDTO, VenueMinimalDTO, PerformanceDTO } from 'interfaces'
import { RecoilState, useRecoilCallback } from 'recoil'
import { DateDistancesDTO } from 'services/venueService'
import { bookingState } from 'state/booking/bookingState'
import { dateBlockState } from 'state/booking/dateBlockState'
import { distanceState } from 'state/booking/distanceState'
import { getInFitUpState } from 'state/booking/getInFitUpState'
import { rehearsalState } from 'state/booking/rehearsalState'
import { venueState } from 'state/booking/venueState'
import { performanceState } from 'state/booking/performanceState'

/*
  Experimental attempt to get Recoil.js working with SSR in React in a DRY manner.
  Anything included as a prop in `initialState` that fits the following interface
  will be automatically instanciated, both client side and server side
*/

export type InitialState = Partial<{
  booking: Record<number, BookingDTO>,
  rehearsal: Record<number, RehearsalDTO>,
  getInFitUp: Record<number, GetInFitUpDTO>,
  dateBlock: DateBlockDTO[],
  performance: Record<number, PerformanceDTO>,
  distance: DateDistancesDTO[],
  venue: Record<number, VenueMinimalDTO>,
}>

const states: Record<keyof InitialState, RecoilState<any>> = {
  booking: bookingState,
  rehearsal: rehearsalState,
  getInFitUp: getInFitUpState,
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
