import Checkbox from 'components/core-ui-lib/Checkbox';
import Typeahead from 'components/core-ui-lib/Typeahead';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';

export default function ProductionJumpMenu() {
  const router = useRouter();
  const [productionJump, setProductionJump] = useRecoilState(productionJumpState);
  const [includeArchived, setIncludeArchived] = useState<boolean>(false);
  const productions = useMemo(() => {
    const productionOptions = [];
    for (const production of productionJump.productions) {
      if (includeArchived) {
        productionOptions.push({
          ...production,
          text: `${production.ShowName} ${production.ShowCode}/${production.Code} ${
            production.IsArchived ? ' | (Archived)' : ''
          }`,
          value: production.Id,
        });
      } else if (!production.IsArchived) {
        productionOptions.push({
          ...production,
          text: `${production.ShowName} ${production.ShowCode}/${production.Code} ${
            production.IsArchived ? ' | (Archived)' : ''
          }`,
          value: production.Id,
        });
      }
    }
    return productionOptions;
  }, [productionJump, includeArchived]);
  if (!productionJump?.selected || !productionJump?.productions?.length) return null;

  const { selected, path } = productionJump;
  console.log('===selected===', selected, path, typeof selected);
  function goToProduction(value: any) {
    const selectedProduction = productions.find((production) => production.Id === parseInt(value));
    if (!selectedProduction) return;
    const { ShowCode, Code: ProductionCode, Id } = selectedProduction;
    setProductionJump({ ...productionJump, loading: true, selected: Id });
    router.push(`/${path}/${ShowCode}/${ProductionCode}`);
  }
  return (
    <>
      <Typeahead
        className="border-0 !shadow-none w-80"
        value={selected}
        label="Production"
        options={productions}
        onChange={goToProduction}
      />
      <div className="flex  items-center ml-1 mr-4">
        <Checkbox
          id="IncludeArchived"
          label="Include Archived"
          checked={includeArchived}
          value={includeArchived}
          onChange={(e) => setIncludeArchived(e.target.value)}
          className=""
        />
      </div>
    </>
  );
}
