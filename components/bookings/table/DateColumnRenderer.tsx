import { CustomCellRendererProps } from 'ag-grid-react';

export default function DateColumnRenderer(props: CustomCellRendererProps) {
  const isMonday = props.value ? props.value.includes('Mon') : false;
  return (
    <div className="h-full pr-[2px]">
      <div className={`px-1 truncate ${isMonday ? 'bg-[#FDCE74]' : ''}`}>{props.value || ''}</div>
    </div>
  );
}
