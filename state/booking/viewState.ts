import { atom } from 'recoil'

interface View {
  selectedDate?: string
}

const intialState: View = {
}

export const viewState = atom({
  key: 'viewState',
  default: intialState
})
