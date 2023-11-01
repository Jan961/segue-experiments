import { atom } from 'recoil';

interface View {
  selectedDate?: string;
  selected?: {
    type: 'booking' | 'gifu' | 'rehearsal' | 'other';
    id: number;
  };
}

const intialState: View = {};

export const viewState = atom({
  key: 'viewState',
  default: intialState,
});
