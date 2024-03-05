import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';

const useProductionOptions = (excludeArchived = false) => {
  const { productions } = useRecoilValue(productionJumpState);
  return useMemo(() => {
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
  }, [productions, excludeArchived]);
};

export default useProductionOptions;
