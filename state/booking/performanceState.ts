import { PerformanceDTO } from 'interfaces'
import { atom } from 'recoil'

const intialState: PerformanceDTO[] = []

export const performanceState = atom({
  key: 'performanceState',
  default: intialState
})
