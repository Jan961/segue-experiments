import { PerformanceDTO } from 'interfaces'
import { atom } from 'recoil'

const intialState: Record<number, PerformanceDTO> = {}

export const performanceState = atom({
  key: 'performanceState',
  default: intialState
})
