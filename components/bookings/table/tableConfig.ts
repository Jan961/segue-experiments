import { tileColors } from 'config/global';
import NoteColumnRenderer from './NoteColumnRenderer';

export const styleProps = { headerColor: tileColors.bookings };

export const columnDefs = [
  { headerName: 'Production', field: 'production' },
  { headerName: 'Date', field: 'date' },
  { headerName: 'Week', field: 'week' },
  { headerName: 'Venue Details', field: 'venue' },
  { headerName: 'Town', field: 'town' },
  { headerName: 'Day Type', field: 'dayType' },
  { headerName: 'Booking Status', field: 'bookingStatus' },
  { headerName: 'Capacity', field: 'capacity' },
  { headerName: 'No. of Perfs', field: 'performanceCount' },
  { headerName: 'Performance Times', field: 'performanceTimes' },
  { headerName: 'Miles', field: 'miles' },
  { headerName: 'Travel Time', field: 'travelTime' },
  { headerName: '', field: 'note', cellRenderer: NoteColumnRenderer },
];
