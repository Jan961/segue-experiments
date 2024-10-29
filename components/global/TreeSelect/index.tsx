import { useEffect, useState } from 'react';
import TreeItem from './TreeItem';
import { TreeItemOption } from './types';
import { Checkbox } from 'components/core-ui-lib';
import { isNullOrEmpty, mapRecursive } from 'utils';
import classNames from 'classnames';

interface TreeSelectProps {
  className?: string;
  defaultOpen?: boolean;
  options: TreeItemOption[];
  onChange: (v: TreeItemOption[]) => void;
  selectAllLabel?: string;
  disabled?: boolean;
}

const baseClass = 'border bg-primary-white px-3 py-2';

export default function TreeSelect({
  options = [],
  onChange,
  defaultOpen = false,
  className = '',
  selectAllLabel = 'Select All',
  disabled = false,
}: TreeSelectProps) {
  const [itemOptions, setItemOptions] = useState(options || []);
  const [selectAll, setSelecteAll] = useState<boolean>(false);

  useEffect(() => {
    if (!options || options.length === 0) setItemOptions([]);

    let updatedOptions: TreeItemOption[] = options.map((o) => ({ ...o, groupHeader: true }));
    updatedOptions = mapRecursive(updatedOptions, (o) => ({ ...o, disabled }));

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
    const updatedOptions = mapRecursive(itemOptions, (o) => ({
      ...o,
      checked: !selectAll,
      isPartiallySelected: false,
    }));
    setItemOptions(updatedOptions);
    onChange(updatedOptions);
  };

  return (
    <div className={classNames(baseClass, disabled ? '!bg-disabled-input' : '', className)}>
      {!isNullOrEmpty(itemOptions) && (
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
          disabled={disabled}
        />
      )}
      {itemOptions.map((o) => (
        <TreeItem key={o.id} value={o} onChange={handleOptionToggle} defaultOpen={defaultOpen} />
      ))}
    </div>
  );
}
