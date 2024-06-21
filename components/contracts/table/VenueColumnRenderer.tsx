import { CustomCellRendererProps } from 'ag-grid-react';

export default function VenueColumnRenderer(props: CustomCellRendererProps) {
  const { dayType, status, multipleVenuesOnSameDate, venueHasMultipleBookings } = props.data;

  const getEndClass = () => {
    if (!dayType) {
      return '';
    }

    if (dayType !== 'Performance') {
      return 'bg-primary-red text-primary-yellow';
    } else if (status === 'X') {
      return 'bg-primary-black text-primary-white';
    } else if (status === 'S') {
      return 'bg-secondary-purple text-primary-white';
    } else if (status === 'U' && multipleVenuesOnSameDate) {
      return 'bg-primary-blue text-primary-white';
    } else if (venueHasMultipleBookings && status !== 'C') {
      return 'text-primary-red font-bold';
    }
    return '';
  };

  return (
    <div className="w-full h-full pr-[2px]">
      <div className={`h-full px-4 truncate ${getEndClass()}`}>{props.value}</div>
    </div>
  );
}
