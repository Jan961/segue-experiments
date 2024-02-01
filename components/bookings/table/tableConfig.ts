import { tileColors } from 'config/global';
import NoteColumnRenderer from './NoteColumnRenderer';
import DateColumnRenderer from './DateColumnRenderer';
import DefaultCellRenderer from './DefaultCellRenderer';

export const styleProps = { headerColor: tileColors.bookings };

export const columnDefs = [
  { headerName: 'Production', field: 'productionCode', cellRenderer: DefaultCellRenderer, width: 120 },
  {
    headerName: 'Date',
    field: 'date',
    cellRenderer: DateColumnRenderer,
    width: 120,
  },
  { headerName: 'Week', field: 'week', cellRenderer: DefaultCellRenderer, width: 120 },
  { headerName: 'Venue Details', field: 'venue', cellRenderer: DefaultCellRenderer, width: 250 },
  { headerName: 'Town', field: 'town', cellRenderer: DefaultCellRenderer, width: 250 },
  { headerName: 'Day Type', field: 'dayType', cellRenderer: DefaultCellRenderer },
  {
    headerName: 'Booking Status',
    field: 'bookingStatus',
    cellRenderer: DefaultCellRenderer,
    resizable: false,
    width: 120,
  },
  { headerName: 'Capacity', field: 'capacity', cellRenderer: DefaultCellRenderer },
  { headerName: 'No. of Prefs', field: 'noOfPrefs', cellRenderer: DefaultCellRenderer, width: 120 },
  { headerName: 'Performance Times', field: 'performanceTimes', cellRenderer: DefaultCellRenderer, width: 150 },
  { headerName: 'Miles', field: 'miles', cellRenderer: DefaultCellRenderer },
  { headerName: 'Travel Time', field: 'travelTime', cellRenderer: DefaultCellRenderer, width: 110 },
  { headerName: '', field: 'note', cellRenderer: NoteColumnRenderer, resizable: false, width: 40 },
];
