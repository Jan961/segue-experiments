import { atom } from 'recoil'

const intialState = []

export const dayTypeState = atom({
  key: 'dayTypeState',
  default: intialState
})
