import TreeItem from './TreeItem';
import { TreeItemOption, TreeItemSelectedOption } from './types';

interface TreeSelectProps {
  options: TreeItemOption[];
  onChange: (v: TreeItemSelectedOption) => void;
}

export default function TreeSelect({ options = [], onChange }: TreeSelectProps) {
  return (
    <div className="border bg-white py-2">
      {options.map((o) => (
        <TreeItem key={o.id} value={o} onChange={onChange} />
      ))}
    </div>
  );
}
