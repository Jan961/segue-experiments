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
    const productionOptions = [{ text: 'All Productions', value: -1, Id: -1, ShowCode: null, Code: null }];
    for (const production of productionJump.productions) {
      if (includeArchived) {
        productionOptions.push({
          Id: -1,
          ShowCode: null,
          Code: null,
          ...production,
          text: `${production.ShowCode}${production.Code} ${production.ShowName} ${
            production.IsArchived ? ' (A)' : ''
          }`,
          value: production.Id,
        });
      } else if (!production.IsArchived) {
        productionOptions.push({
          Id: -1,
          ShowCode: null,
          Code: null,
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
  if (!productionJump?.selected || !productionJump?.productions?.length) return null;

  const { selected, path } = productionJump;
  function goToProduction(value: any) {
    const selectedProduction = productions.find((production) => production.value === parseInt(value));
    if (!selectedProduction) return;
    if (selectedProduction.Id === -1) {
      router.push(`/${path}`);
      return;
    }
    const { ShowCode, Code: ProductionCode, Id } = selectedProduction || {};
    setProductionJump({ ...productionJump, loading: true, selected: Id });
    router.push(`/${path}/${ShowCode}/${ProductionCode}`);
  }
  return (
    <>
      <Typeahead
        className="border-0 !shadow-none w-[510px]"
        value={selected}
        label="Production"
        options={productions}
        onChange={goToProduction}
      />
      <div className="flex  items-center ml-1 mr-4">
        <Checkbox
          id="IncludeArchived"
          label="Include archived"
          checked={includeArchived}
          onChange={(e) => setIncludeArchived(e.target.value)}
          className=""
        />
      </div>
    </>
  );
}
