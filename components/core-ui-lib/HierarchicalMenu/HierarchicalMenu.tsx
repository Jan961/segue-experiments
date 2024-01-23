import { useEffect, useState } from 'react';
import { MenuOption } from './types';
import MenuItem from './MenuItem';

interface HierarchicalMenuProps {
  options: MenuOption[];
}

export default function HierarchicalMenu({ options = [] }: HierarchicalMenuProps) {
  const [itemOptions, setItemOptions] = useState(options || []);

  useEffect(() => {
    if (!options || options.length === 0) setItemOptions([]);

    const updatedOptions = options.map((o) => ({ ...o, groupHeader: true }));
    setItemOptions(updatedOptions);
  }, [options]);

  return (
    <div className="px-3 py-2">
      {itemOptions.map((o) => (
        <MenuItem key={o.value} option={o} />
      ))}
    </div>
  );
}
