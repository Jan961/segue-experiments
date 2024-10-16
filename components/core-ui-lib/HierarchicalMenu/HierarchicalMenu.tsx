import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
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

const HierarchicalMenu = forwardRef(
  ({ options = [], onClick, onToggle, className = '' }: HierarchicalMenuProps, ref) => {
    const [itemOptions, setItemOptions] = useState(options || []);

    useImperativeHandle(ref, () => ({
      expandParentAndChildren: (parentNodeValue: string) => {
        // Expands the parent node and all of its chicldren if found. All other nodes are collapsed
        // Step1. Close all nodes
        let updatedOptions = itemOptions; // = mapRecursive(itemOptions, (o) => ({ ...o, expanded: false }));
        const parentNode = itemOptions.find(({ value }) => value === parentNodeValue);

        if (parentNode?.options?.length > 0) {
          // Step2. Find node to expand and recursively expand all of its children
          updatedOptions = updatedOptions.map((o) => {
            if (o.groupHeader && o.value === parentNodeValue) {
              return {
                ...o,
                expanded: true,
                options: mapRecursive(o.options, (o) => ({ ...o, expanded: true })),
              };
            }
            return o;
          });
        }

        setItemOptions(updatedOptions);
      },
    }));

    useEffect(() => {
      if (!options || options.length === 0) setItemOptions([]);

      let updatedOptions: MenuOption[] = options.map((o) => ({ ...o, groupHeader: true }));
      updatedOptions = mapRecursive(updatedOptions, (o) => ({ ...o, id: uuidv4() }));

      setItemOptions(updatedOptions);
    }, [options]);

    const handleMenuToggle = (selectedOption, ref: React.RefObject<HTMLDivElement>) => {
      const updated = mapRecursive(itemOptions, (o) => (o.id === selectedOption.id ? selectedOption : o));
      if (selectedOption.expanded) {
        setTimeout(() => {
          ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }
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
  },
);

HierarchicalMenu.displayName = 'HierarchicalMenu';

export default HierarchicalMenu;
