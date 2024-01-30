import { selector } from 'recoil';
import { productionJumpState } from '../productionJumpState';

export const currentProductionSelector = selector({
  key: 'currentProductionSelector',
  get: ({ get }) => {
    const { productions, selected } = get(productionJumpState);
    return productions.find((x) => x.Id === selected);
  },
});
