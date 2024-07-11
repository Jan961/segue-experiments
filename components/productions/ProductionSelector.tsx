import { Checkbox, Select } from 'components/core-ui-lib';
import { ProductionDTO } from 'interfaces';
import { useCallback, useMemo, useState } from 'react';

interface ProductionSelectorProps {
  productions: Partial<ProductionDTO>[];
  onChange: (value: number) => void;
}

const ProductionSelector = ({ productions, onChange }: ProductionSelectorProps) => {
  const [includeArchived, setIncludeArchived] = useState<boolean>(false);
  const [selectedProduction, setSelectedProduction] = useState<number>();
  const options = useMemo(() => {
    const productionOptions = [];
    for (const production of productions) {
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
  }, [productions, includeArchived]);
  const onSelectionChange = useCallback(
    (productionId: number) => {
      setSelectedProduction(productionId);
      onChange(productionId);
    },
    [onChange, setSelectedProduction],
  );
  return (
    <div className="bg-white border-primary-border rounded-md border shadow-md max-w-[550px]">
      <div className="rounded-l-md">
        <div className="flex items-center">
          <Select
            className="border-0 !shadow-none w-[410px]"
            label="Production"
            onChange={(value) => onSelectionChange(value as number)}
            options={options}
            value={selectedProduction}
          />
          <div className="flex items-center ml-1 float-end">
            <Checkbox
              id="IncludeArchived"
              label="Include archived"
              checked={includeArchived}
              onChange={(e) => setIncludeArchived(e.target.checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionSelector;
