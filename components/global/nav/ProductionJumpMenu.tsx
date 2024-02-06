import Checkbox from 'components/core-ui-lib/Checkbox';
import Typeahead from 'components/core-ui-lib/Typeahead';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import ProductionOption from './ProductionOption';

export default function ProductionJumpMenu() {
  const router = useRouter();
  const [productionJump, setProductionJump] = useRecoilState(productionJumpState);
  const [includeArchived, setIncludeArchived] = useState<boolean>(productionJump?.includeArchived || false);
  const productions = useMemo(() => {
    const productionOptions = [
      { text: 'All Productions', value: -1, Id: -1, ShowCode: null, Code: null, IsArchived: false },
    ];
    for (const production of productionJump.productions) {
      if (includeArchived) {
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
      } else if (!production.IsArchived) {
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

  const { selected, path } = productionJump;
  function goToProduction(value: any) {
    const selectedProduction = productions.find((production) => production.value === parseInt(value));
    if (!selectedProduction) return;
    if (selectedProduction.Id === -1) {
      router.push(`/${path}/all`);
      return;
    }
    const { ShowCode, Code: ProductionCode, Id } = selectedProduction || {};
    setProductionJump({ ...productionJump, loading: true, selected: Id });
    router.push(`/${path}/${ShowCode}/${ProductionCode}`);
  }
  const onIncludeArchiveChange = (e) => {
    setProductionJump({ ...productionJump, includeArchived: e.target.value });
    setIncludeArchived(e.target.value);
  };
  if (!productionJump?.productions?.length) return null;
  return (
    <>
      <Typeahead
        className="border-0 !shadow-none w-[420px]"
        value={selected}
        label="Production"
        placeholder="Please select a Production"
        renderOption={(option, selectedOption, handleOptionSelect) => (
          <ProductionOption option={option} selectedOption={selectedOption} handleOptionSelect={handleOptionSelect} />
        )}
        options={productions}
        onChange={goToProduction}
      />
      <div className="flex  items-center ml-1 mr-4">
        <Checkbox
          id="IncludeArchived"
          label="Include archived"
          checked={includeArchived}
          onChange={onIncludeArchiveChange}
          className=""
        />
      </div>
    </>
  );
}
