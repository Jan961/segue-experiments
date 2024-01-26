import { useEffect, useState } from 'react';
import { MenuOption } from './types';
import MenuItem from './MenuItem';
import { v4 as uuidv4 } from 'uuid';
import { mapRecursive } from 'utils';

interface HierarchicalMenuProps {
  options: MenuOption[];
  onClick?: (selected: MenuOption) => void;
  onToggle?: (state: MenuOption[]) => void;
  className?: string;
}

export default function HierarchicalMenu({ options = [], onClick, onToggle, className = '' }: HierarchicalMenuProps) {
  const [itemOptions, setItemOptions] = useState(options || []);

  useEffect(() => {
    if (!options || options.length === 0) setItemOptions([]);

    let updatedOptions: MenuOption[] = options.map((o) => ({ ...o, groupHeader: true }));
    updatedOptions = mapRecursive(updatedOptions, (o) => ({ ...o, id: uuidv4() }));

    setItemOptions(updatedOptions);
  }, [options]);

  const handleMenuToggle = (selectedOption) => {
    const updated = mapRecursive(itemOptions, (o) => (o.id === selectedOption.id ? selectedOption : o));
    setItemOptions(updated);
    onToggle(updated);
  };

  return (
    <div className={className}>
      {itemOptions.map((o) => (
        <MenuItem key={o.value} option={o} onClick={onClick} onToggle={handleMenuToggle} />
      ))}
    </div>
  );
}
