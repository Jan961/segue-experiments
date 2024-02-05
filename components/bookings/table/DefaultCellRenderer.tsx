import { CustomCellRendererProps } from 'ag-grid-react';

export default function DefaultCellRenderer(props: CustomCellRendererProps) {
  return <div className="w-full h-full px-2">{props.value}</div>;
}
