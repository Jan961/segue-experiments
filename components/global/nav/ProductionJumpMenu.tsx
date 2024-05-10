import Checkbox from 'components/core-ui-lib/Checkbox';
import Select from 'components/core-ui-lib/Select';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import ProductionOption from './ProductionOption';

export const ARCHIVED_OPTION_STYLES = {
  option: (styles, { isDisabled, isSelected, isFocused, data }) => {
    return {
      ...styles,
      fontSize: '1rem',
      lineHeight: '1.5rem',
      backgroundColor: isDisabled
        ? undefined
        : isSelected && !data.IsArchived
        ? '#21345BCC'
        : isSelected && data.IsArchived
        ? '#707070'
        : isFocused && !data.IsArchived
        ? '#21345B99'
        : isFocused && data.IsArchived
        ? '#464646b3'
        : data.IsArchived
        ? '#4646464d'
        : '#FFF',
      color: isDisabled ? '#ccc' : isSelected || isFocused ? '#FFF' : '#617293',
      cursor: isDisabled ? 'not-allowed' : 'default',
      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled ? (isSelected ? '#FDCE74' : '#41A29A') : undefined,
      },
      ':hover': {
        ...styles[':hover'],
        color: '#FFF',
        backgroundColor: data.IsArchived ? '#464646b3' : '#21345B99',
      },
    };
  },
};

export default function ProductionJumpMenu() {
  const router = useRouter();
  const [productionJump, setProductionJump] = useRecoilState(productionJumpState);
  const [includeArchived, setIncludeArchived] = useState<boolean>(productionJump?.includeArchived || false);
  const productions = useMemo(() => {
    const productionOptions = router.route.includes('/marketing')
      ? []
      : [{ text: 'All Productions', value: -1, Id: -1, ShowCode: null, Code: null, IsArchived: false }];
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
      <Select
        className="border-0 !shadow-none w-[420px]"
        value={selected}
        label="Production"
        placeholder="Please select a Production"
        renderOption={(option) => <ProductionOption option={option} />}
        customStyles={ARCHIVED_OPTION_STYLES}
        options={productions}
        onChange={goToProduction}
        isSearchable
        isClearable={false}
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
