import { tileColors } from 'config/global';
import NoteColumnRenderer from './NoteColumnRenderer';
import DateColumnRenderer from './DateColumnRenderer';
import DefaultCellRenderer from './DefaultCellRenderer';
import VenueColumnRenderer from './VenueColumnRenderer';

export const styleProps = { headerColor: tileColors.bookings };

export const columnDefs = [
  { headerName: 'Production', field: 'production', cellRenderer: DefaultCellRenderer, width: 120 },
  {
    headerName: 'Date',
    field: 'date',
    cellRenderer: DateColumnRenderer,
    width: 130,
  },
  { headerName: 'Week', field: 'week', cellRenderer: DefaultCellRenderer, width: 100 },
  { headerName: 'Venue Details', field: 'venue', cellRenderer: VenueColumnRenderer, width: 300 },
  { headerName: 'Town', field: 'town', cellRenderer: DefaultCellRenderer, width: 300 },
  { headerName: 'Day Type', field: 'dayType', cellRenderer: DefaultCellRenderer, width: 120 },
  {
    headerName: 'Booking Status',
    field: 'bookingStatus',
    cellRenderer: DefaultCellRenderer,
    resizable: false,
    width: 120,
  },
  { headerName: 'Capacity', field: 'capacity', cellRenderer: DefaultCellRenderer },
  { headerName: 'No. of Prefs', field: 'noOfPrefs', cellRenderer: DefaultCellRenderer, width: 120 },
  { headerName: 'Performance Times', field: 'performanceTimes', cellRenderer: DefaultCellRenderer, width: 200 },
  { headerName: 'Miles', field: 'miles', cellRenderer: DefaultCellRenderer },
  { headerName: 'Travel Time', field: 'travelTime', cellRenderer: DefaultCellRenderer, width: 110 },
  { headerName: '', field: 'note', cellRenderer: NoteColumnRenderer, resizable: false, width: 30 },
];
