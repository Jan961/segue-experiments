import { tileColors } from 'config/global';
import NoteColumnRenderer from './NoteColumnRenderer';
import DateColumnRenderer from './DateColumnRenderer';
import DefaultCellRenderer from './DefaultCellRenderer';
import VenueColumnRenderer from './VenueColumnRenderer';
import MilesRenderer from './MilesRenderer';
import TravelTimeRenderer from './TravelTimeRenderer';

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
  { headerName: 'Venue Details', field: 'venue', cellRenderer: VenueColumnRenderer, minWidth: 300, flex: 2 },
  { headerName: 'Town', field: 'town', cellRenderer: DefaultCellRenderer, minWidth: 200, flex: 1 },
  { headerName: 'Day Type', field: 'dayType', cellRenderer: DefaultCellRenderer, width: 120 },
  {
    headerName: 'Booking Status',
    field: 'bookingStatus',
    cellRenderer: DefaultCellRenderer,
    resizable: false,
    width: 120,
  },
  { headerName: 'Capacity', field: 'capacity', cellRenderer: DefaultCellRenderer, width: 100 },
  { headerName: 'No. of Perfs', field: 'performanceCount', cellRenderer: DefaultCellRenderer, width: 120 },
  { headerName: 'Performance Times', field: 'performanceTimes', cellRenderer: DefaultCellRenderer, width: 200 },
  {
    headerName: 'Miles',
    field: 'miles',
    cellRenderer: MilesRenderer,
  },
  { headerName: 'Travel Time', field: 'travelTime', cellRenderer: TravelTimeRenderer, width: 110 },
  { headerName: '', field: 'note', cellRenderer: NoteColumnRenderer, resizable: false, width: 50 },
];

export const bookingConflictsColumnDefs = [
  { headerName: 'Venue', field: 'venue', cellRenderer: DefaultCellRenderer, flex: 1 },
  { headerName: 'Date', field: 'date', cellRenderer: DefaultCellRenderer, width: 110 },
  { headerName: 'Booking Status', field: 'bookingStatus', cellRenderer: DefaultCellRenderer, width: 145 },
];

export const barringIssueColumnDefs = [
  { headerName: 'Venue', field: 'venue', cellRenderer: DefaultCellRenderer, flex: 1 },
  { headerName: 'Date', field: 'date', cellRenderer: DefaultCellRenderer, width: 110 },
  { headerName: 'Miles', field: 'miles', cellRenderer: DefaultCellRenderer, width: 75 },
];

export const gapSuggestColumnDefs = [
  { headerName: 'Venue', field: 'venue', cellRenderer: DefaultCellRenderer, flex: 1 },
  { headerName: 'Town', field: 'town', cellRenderer: DefaultCellRenderer, flex: 1 },
  { headerName: 'Seats', field: 'seats', cellRenderer: DefaultCellRenderer, width: 75 },
  { headerName: 'Travel Time', field: 'travelTime', cellRenderer: DefaultCellRenderer, width: 75 },
  { headerName: 'Barring Check', field: 'barringCheck', cellRenderer: DefaultCellRenderer, flex: 1 },
];
