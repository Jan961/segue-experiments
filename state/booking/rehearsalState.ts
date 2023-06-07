import { RehearsalDTO } from 'interfaces'
import { atom } from 'recoil'

const intialState: Record<number, RehearsalDTO> = {}

export const rehearsalState = atom({
  key: 'rehearsalState',
  default: intialState
})
