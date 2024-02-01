import { CustomCellRendererProps } from 'ag-grid-react';

export default function VenueColumnRenderer(props: CustomCellRendererProps) {
  const { dayType } = props.data;

  const endClass = dayType !== 'Performance' ? 'bg-[#E94580]/75 text-[#21345B]' : '';
  return (
    <div className="w-full h-full pr-[2px]">
      <div className={`h-full px-4 ${endClass}`}>{props.value}</div>
    </div>
  );
}
