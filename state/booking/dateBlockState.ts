import { DateBlockDTO } from 'interfaces'
import { atom } from 'recoil'

const intialState: DateBlockDTO[] = []

export const dateBlockState = atom({
  key: 'dateBlockState',
  default: intialState
})
