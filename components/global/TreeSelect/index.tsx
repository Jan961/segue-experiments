import { useEffect, useState } from 'react';
import TreeItem from './TreeItem';
import { TreeItemOption } from './types';

interface TreeSelectProps {
  options: TreeItemOption[];
  onChange: (v: TreeItemOption[]) => void;
}

export default function TreeSelect({ options = [], onChange }: TreeSelectProps) {
  const [itemOptions, setItemOptions] = useState(options || []);

  useEffect(() => {
    if (!options || options.length === 0) setItemOptions([]);

    const updatedOptions = options.map((o) => ({ ...o, groupHeader: true }));
    setItemOptions(updatedOptions);
  }, [options]);

  const handleOptionToggle = (value: TreeItemOption) => {
    const updatedOptions = itemOptions.map((o) => (o.id === value.id ? value : o));
    onChange(updatedOptions);
  };

  return (
    <div className="border bg-white px-3 py-2">
      {itemOptions.map((o) => (
        <TreeItem key={o.id} value={o} onChange={handleOptionToggle} />
      ))}
    </div>
  );
}
