import { GetInFitUpDTO } from 'interfaces'
import { atom } from 'recoil'

const intialState: Record<number, GetInFitUpDTO> = {}

export const getInFitUpState = atom({
  key: 'getInFitUpState',
  default: intialState
})
