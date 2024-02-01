import { CustomCellRendererProps } from 'ag-grid-react';
import { isMonday, parseISO } from 'date-fns';
import { dateToSimple } from 'services/dateService';

export default function DateColumnRenderer(props: CustomCellRendererProps) {
  return (
    <div className="w-full h-full pr-[2px]">
      <div className={`px-4 ${isMonday(parseISO(props.value)) ? 'bg-[#FDCE74]' : ''}`}>
        {props.value ? dateToSimple(props.value) : ''}
      </div>
    </div>
  );
}
