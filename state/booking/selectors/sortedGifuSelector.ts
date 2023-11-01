import { sort } from 'radash';
import { selector } from 'recoil';
import { GetInFitUpDTO } from 'interfaces';
import { getInFitUpState } from '../getInFitUpState';

export const sortedGifuSelector = selector({
  key: 'sortedGifuSelector',
  get: ({ get }) => {
    const source = get(getInFitUpState);
    const asArray = Object.values(source);
    return sort(asArray, (r: GetInFitUpDTO) => Date.parse(r.Date));
  },
});
