import { CustomCellRendererProps } from 'ag-grid-react';

export default function DateColumnRenderer(props: CustomCellRendererProps) {
  const isMonday = props.value ? props.value.includes('Mon') : false;
  return (
    <div className="w-full h-full pr-[2px]">
      <div className={`px-4 ${isMonday ? 'bg-[#FDCE74]' : ''}`}>{props.value || ''}</div>
    </div>
  );
}
