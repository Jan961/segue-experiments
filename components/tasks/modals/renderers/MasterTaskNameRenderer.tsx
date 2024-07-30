import { CustomCellRendererProps } from 'ag-grid-react';

export default function MasterTaskNameRenderer(props: CustomCellRendererProps) {
  return (
    <div className="w-full h-full px-2 truncate">{props.value + (props.data.MTRId ? ' - Repeating Task' : '')}</div>
  );
}
