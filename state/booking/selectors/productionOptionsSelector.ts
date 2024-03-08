import { selectorFamily } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';

export const productionOptionsSelector = selectorFamily({
  key: 'productionOptionsSelector',
  get:
    (excludeArchived) =>
    ({ get }) => {
      const { productions } = get(productionJumpState);
      const options = [];
      for (const production of productions) {
        if (excludeArchived && !production.IsArchived) {
          options.push({
            text: `${production.ShowCode}${production.Code} ${production.ShowName}`,
            value: production.Id,
          });
        } else if (!excludeArchived) {
          options.push({
            text: `${production.ShowCode}${production.Code} ${production.ShowName}`,
            value: production.Id,
          });
        }
      }
      return options;
    },
});
