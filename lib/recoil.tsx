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
import { TourJump, tourJumpState } from 'state/booking/tourJumpState'
import { BookingJump, bookingJumpState } from 'state/marketing/bookingJumpState'
import { VenueRole, venueRoleState } from 'state/marketing/venueRoleState'
import { TourState, tourState } from 'state/tasks/tourState'
import { BulkSelectionState, bulkSelectionState } from 'state/tasks/bulkSelectionState'
import { UserState, userState } from 'state/account/userState'

/*
  Experimental attempt to get Recoil.js working with SSR in React in a DRY manner.
  Anything included as a prop in `initialState` that fits the following interface
  will be automatically instanciated, both client side and server side
*/

export type InitialState = Partial<{
  global?: {
    tourJump?: TourJump
  }
  tasks?: {
    tours?: TourState
    bulkSelection?: BulkSelectionState
  }
  booking?: {
    booking?: Record<number, BookingDTO>,
    rehearsal?: Record<number, RehearsalDTO>,
    getInFitUp?: Record<number, GetInFitUpDTO>,
    other?: OtherState
    dateBlock?: DateBlockState,
    dateType?: DateTypeState,
    performance?: Record<number, PerformanceDTO>,
    distance?: DistanceState,
    venue?: Record<number, VenueMinimalDTO>,
  }
  marketing?: {
    bookingJump?: BookingJump
    venueRole?: VenueRole
  }
  account?: {
    user: UserState
  }
}>

const states: {
  global: Record<keyof InitialState['global'], RecoilState<any>>,
  tasks: Record<keyof InitialState['tasks'], RecoilState<any>>,
  booking: Record<keyof InitialState['booking'], RecoilState<any>>,
  marketing: Record<keyof InitialState['marketing'], RecoilState<any>>,
  account: Record<keyof InitialState['account'], RecoilState<any>>
} = {
  global: {
    tourJump: tourJumpState
  },
  tasks: {
    tours: tourState,
    bulkSelection: bulkSelectionState
  },
  booking: {
    booking: bookingState,
    rehearsal: rehearsalState,
    getInFitUp: getInFitUpState,
    other: otherState,
    dateType: dateTypeState,
    venue: venueState,
    distance: distanceState,
    dateBlock: dateBlockState,
    performance: performanceState
  },
  marketing: {
    bookingJump: bookingJumpState,
    venueRole: venueRoleState
  },
  account: {
    user: userState
  }
}

export const setInitialStateServer = (snapshot, initialState: InitialState) => {
  for (const pageKey in initialState) {
    for (const key in initialState[pageKey]) {
      const state = states[pageKey][key]
      if (state) snapshot.set(state, initialState[pageKey][key])
    }
  }
}

const useSetMultipleRecoilStates = () => {
  return useRecoilCallback(({ set }) => (initialData: InitialState) => {
    for (const pageKey in initialData) {
      for (const key in initialData[pageKey]) {
        const state = states[pageKey][key]
        if (state) set(state, initialData[pageKey][key])
      }
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
