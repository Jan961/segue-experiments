import { TourTaskDTO } from 'interfaces'
import { atom } from 'recoil'

export type TaskState = TourTaskDTO[]

const intialState: TourTaskDTO[] = []

export const taskState = atom({
  key: 'taskState',
  default: intialState
})
