import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';

export default function ProductionJumpMenu() {
  const router = useRouter();
  const [productionJump, setProductionJump] = useRecoilState(productionJumpState);
  const [includeArchived, setIncludeArchived] = useState<boolean>(false);
  const productions = useMemo(() => {
    if (includeArchived) return productionJump?.productions;
    return productionJump?.productions?.filter?.((production) => !production.IsArchived);
  }, [productionJump, includeArchived]);
  if (!productionJump?.selected || !productionJump?.productions?.length) return null;

  const { selected, path } = productionJump;
  function goToProduction(e: any) {
    const selectedProduction = productions.find((production) => production.Id === parseInt(e.target.value));
    if (!selectedProduction) return;
    const { ShowCode, Code: ProductionCode, Id } = selectedProduction;
    setProductionJump({ ...productionJump, loading: true, selected: Id });
    router.push(`/${path}/${ShowCode}/${ProductionCode}`);
  }
  return (
    <>
      <select
        onChange={goToProduction}
        id="selectedProduction"
        value={selected}
        className={'text-primary-blue border-y-0 border-r-0 border-l-1 border-gray-200 font-medium rounded-r-md'}
      >
        {productions.map((production) => (
          <option key={`${production.ShowCode}/${production.Code}`} value={production.Id}>
            {`${production.ShowName} ${production.ShowCode}/${production.Code} ${production.IsArchived ? ' | (Archived)' : ''}`}
          </option>
        ))}
      </select>
      <div className="flex  items-center ml-1 mr-4">
        <input
          id="includeArchived"
          type="checkbox"
          name="includeArchived"
          onChange={(e) => setIncludeArchived(e.target.checked)}
          className=" w-[15px] flex-1 rounded border-gray-300focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="0141 000 0000"
          value={includeArchived.toString()}
          contentEditable={true}
        />
        <label htmlFor="includeArchived" className="ml-2">
          Include archived
        </label>
      </div>
    </>
  );
}
