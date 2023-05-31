import { RehearsalDTO } from 'interfaces'
import { atom } from 'recoil'

const intialState: RehearsalDTO[] = []

export const rehearsalState = atom({
  key: 'rehearsalState',
  default: intialState
})
