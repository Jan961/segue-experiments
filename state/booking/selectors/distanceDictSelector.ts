import { selector } from 'recoil';
import { distanceState } from '../distanceState';
import { objectify } from 'radash';

export const distanceDictSelector = selector({
  key: 'distanceDictSelector',
  get: ({ get }) => {
    const source = get(distanceState);
    return objectify(source.stops, (d) => d.Date);
  },
});
