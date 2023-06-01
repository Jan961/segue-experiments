import { BookingDTO, RehearsalDTO, GetInFitUpDTO, DateBlockDTO, VenueMinimalDTO } from 'interfaces'
import React from 'react'
// eslint-disable-next-line camelcase
import { useRecoilCallback } from 'recoil'
import { DateDistancesDTO } from 'services/venueService'
import { bookingState } from 'state/booking/bookingState'
import { dateBlockState } from 'state/booking/dateBlockState'
import { distanceState } from 'state/booking/distanceState'
import { getInFitUpState } from 'state/booking/getInFitUpState'
import { rehearsalState } from 'state/booking/rehearsalState'
import { venueState } from 'state/booking/venueState'

/*
  Experimental attempt to get Recoil.js working with SSR in React in a DRY manner.
  Anything included as a prop in `initalData` that fits the following interface
  will be automatically instanciated, both client side and server side
*/

export interface InitialData {
  booking?: BookingDTO[],
  rehearsal?: RehearsalDTO[],
  getInFitUp?: GetInFitUpDTO[],
  dateBlock?: DateBlockDTO[],
  distance?: DateDistancesDTO[],
  venue?: VenueMinimalDTO[],
}

const states = {
  booking: bookingState,
  rehearsal: rehearsalState,
  getInFitUp: getInFitUpState,
  venue: venueState,
  distance: distanceState,
  dateBlock: dateBlockState
}

export const setInitialStateServer = (snapshot, initialData) => {
  for (const key in initialData) {
    const state = states[key]
    if (state) snapshot.set(state, initialData[key])
  }
}

// Helper function to prevent having to manually type in every state
export const useSetMultipleRecoilStates = () => {
  return useRecoilCallback(({ set }) => (initialData: InitialData) => {
    for (const key in initialData) {
      const state = states[key]
      if (state) set(state, initialData[key])
    }
  }, [])
}

interface ClientStateSetterProps {
  initialData: InitialData
}

export const ClientStateSetter = ({ initialData }: ClientStateSetterProps) => {
  const setMultipleRecoilStates = useSetMultipleRecoilStates()

  React.useEffect(() => {
    if (initialData) {
      setMultipleRecoilStates(initialData)
    }
  }, [initialData, setMultipleRecoilStates])

  return null
}
