import { useEffect, useState } from 'react';
import TreeItem from './TreeItem';
import { TreeItemOption } from './types';
import { Checkbox } from 'components/core-ui-lib';
import { mapRecursive } from 'utils';

interface TreeSelectProps {
  className?: string;
  defaultOpen?: boolean;
  options: TreeItemOption[];
  onChange: (v: TreeItemOption[]) => void;
  selectAllLabel?: string;
}

const baseClass = 'border bg-white px-3 py-2';

export default function TreeSelect({
  options = [],
  onChange,
  defaultOpen = false,
  className = '',
  selectAllLabel = 'Select All',
}: TreeSelectProps) {
  const [itemOptions, setItemOptions] = useState(options || []);
  const [selectAll, setSelecteAll] = useState<boolean>(false);

  useEffect(() => {
    if (!options || options.length === 0) setItemOptions([]);

    const updatedOptions = options.map((o) => ({ ...o, groupHeader: true }));
    setItemOptions(updatedOptions);
    const areAllOptionsSelected = updatedOptions.every((o) => o.checked);
    setSelecteAll(areAllOptionsSelected);
  }, [options]);

  const handleOptionToggle = (value: TreeItemOption) => {
    const updatedOptions = itemOptions.map((o) => (o.id === value.id ? value : o));
    setItemOptions(updatedOptions);
    const areAllOptionsSelected = updatedOptions.every((o) => o.checked);
    setSelecteAll(areAllOptionsSelected);
    onChange(updatedOptions);
  };

  const handleSelectAllToggle = () => {
    setSelecteAll(!selectAll);
    const updatedOptions = mapRecursive(itemOptions, (o) => ({ ...o, checked: !selectAll }));
    setItemOptions(updatedOptions);
    onChange(updatedOptions);
  };

  return (
    <div className={`${baseClass} ${className}`}>
      <Checkbox
        label={selectAllLabel}
        labelClassName="text-responsive-sm font-semibold"
        id="select-all"
        testId="tree-select-select-all"
        name="select-all"
        checked={selectAll}
        value="selectAll"
        onChange={handleSelectAllToggle}
        showIntermediate={false}
      />
      {itemOptions.map((o) => (
        <TreeItem key={o.id} value={o} onChange={handleOptionToggle} defaultOpen={defaultOpen} />
      ))}
    </div>
  );
}
