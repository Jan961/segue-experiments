import { GetInFitUpDTO } from 'interfaces'
import { atom } from 'recoil'

const intialState: GetInFitUpDTO[] = []

export const getInFitUpState = atom({
  key: 'getInFitUpState',
  default: intialState
})
