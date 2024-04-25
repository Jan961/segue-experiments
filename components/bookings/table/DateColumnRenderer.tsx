import { CustomCellRendererProps } from 'ag-grid-react';

export default function DateColumnRenderer(props: CustomCellRendererProps) {
  const isMonday = props.value ? props.value.includes('Mon') : false;
  return (
    <div className="h-full pl-1 pr-2 ">
      <div className={`px-4 truncate ${isMonday ? 'bg-[#FDCE74]' : ''}`}>{props.value || ''}</div>
    </div>
  );
}
