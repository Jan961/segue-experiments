import { ProductionDTO, ProductionTaskDTO } from 'interfaces'
import { atom } from 'recoil'

export type ProductionsWithTasks = ProductionDTO & {
  Tasks: ProductionTaskDTO[];
  weekNumToDateMap: { [key: number]: Date };
}

export type ProductionState = ProductionsWithTasks[]

const intialState: ProductionState = []

export const productionState = atom({
  key: 'taskProductionState',
  default: intialState
})
