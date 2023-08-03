import { atom } from 'recoil'

export type BulkSelectionState = Record<number, boolean>

export const bulkSelectionState = atom({
  key: 'bulkSelectionState',
  default: {} as BulkSelectionState
})
