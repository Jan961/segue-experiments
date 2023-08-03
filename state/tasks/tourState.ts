import { TourDTO, TourTaskDTO } from 'interfaces'
import { atom } from 'recoil'

export type ToursWithTasks = TourDTO & {
  Tasks: TourTaskDTO[]
}

export type TourState = ToursWithTasks[]

const intialState: TourState = []

export const tourState = atom({
  key: 'taskTourState',
  default: intialState
})
