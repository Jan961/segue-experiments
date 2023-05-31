import { atom } from 'recoil'

interface View {
  selectedBooking?: number
  selectedRehearsal?: number
  selectedDate?: string
  selectedGetInFitUp?: number
}

const intialState: View = {
}

export const viewState = atom({
  key: 'viewState',
  default: intialState
})
