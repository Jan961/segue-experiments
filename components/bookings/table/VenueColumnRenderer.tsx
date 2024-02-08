import { CustomCellRendererProps } from 'ag-grid-react';

export default function VenueColumnRenderer(props: CustomCellRendererProps) {
  const { dayType, bookingStatus, multipleVenuesOnSameDate, venueHasMultipleBookings } = props.data;

  const getEndClass = () => {
    if (!dayType) {
      return '';
    }

    if (dayType !== 'Performance') {
      return 'bg-primary-red text-primary-yellow';
    } else if (bookingStatus === 'Cancelled') {
      return 'bg-primary-black text-primary-white';
    } else if (bookingStatus === 'Suspended') {
      return 'bg-secondary-purple text-primary-white';
    } else if (bookingStatus === 'Pencilled' && multipleVenuesOnSameDate) {
      return 'bg-primary-blue text-primary-white';
    } else if (venueHasMultipleBookings) {
      return 'text-primary-red font-bold';
    }
    return '';
  };

  return (
    <div className="w-full h-full pr-[2px]">
      <div className={`h-full px-4 ${getEndClass()}`}>{props.value}</div>
    </div>
  );
}
