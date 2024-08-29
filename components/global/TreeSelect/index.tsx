import { useEffect, useState } from 'react';
import TreeItem from './TreeItem';
import { TreeItemOption } from './types';

interface TreeSelectProps {
  className?: string;
  defaultOpen?: boolean;
  options: TreeItemOption[];
  onChange: (v: TreeItemOption[]) => void;
}

const baseClass = 'border bg-white px-3 py-2';

export default function TreeSelect({ options = [], onChange, defaultOpen = false, className = '' }: TreeSelectProps) {
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
    <div className={`${baseClass} ${className}`}>
      {itemOptions.map((o) => (
        <TreeItem key={o.id} value={o} onChange={handleOptionToggle} defaultOpen={defaultOpen} />
      ))}
    </div>
  );
}
