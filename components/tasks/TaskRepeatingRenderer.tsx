import { CustomCellRendererProps } from 'ag-grid-react';

export default function TaskRepeatingRenderer(props: CustomCellRendererProps) {
  return (
    <div className="w-full h-full px-2 truncate">
      {props.value + (props.data.PRTId ? ` - Repeats ${props.data.RepeatInterval}` : '')}
    </div>
  );
}
