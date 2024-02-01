import { tileColors } from 'config/global';
import NoteColumnRenderer from './NoteColumnRenderer';
import DateColumnRenderer from './DateColumnRenderer';
import DefaultCellRenderer from './DefaultCellRenderer';

export const styleProps = { headerColor: tileColors.bookings };

export const columnDefs = [
  { headerName: 'Production', field: 'production', cellRenderer: DefaultCellRenderer },
  {
    headerName: 'Date',
    field: 'date',
    cellRenderer: DateColumnRenderer,
  },
  { headerName: 'Week', field: 'week', cellRenderer: DefaultCellRenderer },
  { headerName: 'Venue Details', field: 'venue', cellRenderer: DefaultCellRenderer },
  { headerName: 'Town', field: 'town', cellRenderer: DefaultCellRenderer },
  { headerName: 'Day Type', field: 'dayType', cellRenderer: DefaultCellRenderer },
  { headerName: 'Booking Status', field: 'bookingStatus', cellRenderer: DefaultCellRenderer },
  { headerName: 'Capacity', field: 'capacity', cellRenderer: DefaultCellRenderer },
  { headerName: 'No. of Prefs', field: 'noOfPrefs', cellRenderer: DefaultCellRenderer },
  { headerName: 'Performance Times', field: 'performanceTimes', cellRenderer: DefaultCellRenderer },
  { headerName: 'Miles', field: 'miles', cellRenderer: DefaultCellRenderer },
  { headerName: 'Travel Time', field: 'travelTime', cellRenderer: DefaultCellRenderer },
  { headerName: '', field: 'note', cellRenderer: NoteColumnRenderer },
];
