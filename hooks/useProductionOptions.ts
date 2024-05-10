import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';

const useProductionOptions = (includeArchived: boolean) => {
  const productionJump = useRecoilValue(productionJumpState);

  const productions = useMemo(() => {
    const productionOptions = [
      { text: 'All Productions', value: -1, Id: -1, ShowCode: null, Code: null, IsArchived: false },
    ];

    for (const production of productionJump.productions) {
      if (includeArchived || !production.IsArchived) {
        productionOptions.push({
          Id: -1,
          ShowCode: null,
          Code: null,
          IsArchived: false,
          ...production,
          text: `${production.ShowCode}${production.Code} ${production.ShowName} ${
            production.IsArchived ? ' (A)' : ''
          }`,
          value: production.Id,
        });
      }
    }

    return productionOptions;
  }, [productionJump, includeArchived]);

  return { productions };
};

export default useProductionOptions;
