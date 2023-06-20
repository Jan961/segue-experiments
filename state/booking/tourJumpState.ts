import { TourDTO } from 'interfaces'
import { atom } from 'recoil'

export interface TourJump {
  tours: Partial<TourDTO>[]
  loading?: boolean
  selected: string
}

const intialState: TourJump = {
  tours: [],
  loading: false,
  selected: undefined
}

export const tourJumpState = atom({
  key: 'tourJumpState',
  default: intialState
})
