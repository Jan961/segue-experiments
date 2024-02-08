import { selector } from 'recoil';
import { distanceState } from '../distanceState';
import { objectify } from 'radash';

export const distanceDictSelector = selector({
  key: 'distanceDictSelector',
  get: ({ get }) => {
    const productionDistanceDict = get(distanceState);
    return Object.keys(productionDistanceDict).reduce((mapper, sourceKey) => {
      mapper[sourceKey] = objectify(productionDistanceDict[sourceKey].stops, (d) => d.Date);
      return mapper;
    }, {});
  },
});
