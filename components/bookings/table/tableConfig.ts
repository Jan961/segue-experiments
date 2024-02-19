import { tileColors } from 'config/global';
import NoteColumnRenderer from './NoteColumnRenderer';
import DateColumnRenderer from './DateColumnRenderer';
import DefaultCellRenderer from './DefaultCellRenderer';
import VenueColumnRenderer from './VenueColumnRenderer';
import MilesRenderer from './MilesRenderer';
import TravelTimeRenderer from './TravelTimeRenderer';

import TimeInput from 'components/core-ui-lib/TimeInput';
import SelectBookingStatusRender from './SelectBookingStatusRender';
import SelectDayTypeRender from './SelectDayTypeRender';
import NoPerfRender from './NoPerfRender';
import { ISelectCellEditorParams } from 'ag-grid-community';

import SelectVenueRender from './SelectVenueRender';

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

const venue = ['Venue Dropdown', 'Performance'];

const pencilNo = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

// const mappedPencilNo = pencilNo.map((value, index) => {
//   return { text: value === '0' ? '-' : value, value: index };
// });

export const NewBookingColumnDefs = [
  { headerName: 'Date', field: 'date', cellRenderer: DefaultCellRenderer, width: 130 },

  // for perf y/n the style for the checkbox is givin in the components\core-ui-lib\Table\gridStyles.ts
  {
    headerName: 'Perf Y/N',
    field: 'perf',
    width: 100,
    editable: true,
    cellStyle: {
      width: 100,
    },
  },

  {
    headerName: 'Day Type',
    field: 'dayType',
    editable: false,
    cellRenderer: SelectDayTypeRender,
    width: 170,
    maxWidth: 160,

    cellStyle: {
      overflow: 'visible',
      width: 160,
      maxWidth: 160,
    },
  },
  {
    headerName: 'Venue',
    field: 'venue',

    cellRenderer: SelectVenueRender,
    cellEditorParams: {
      values: venue,
    },
    width: 242,
    cellStyle: {
      overflow: 'visible',
      width: 242,
      maxWidth: 242,
    },
  },
  {
    headerName: 'No Perf',
    field: 'noPerf',
    editable: true,
    cellRenderer: NoPerfRender,
    width: 75,
    cellStyle: {
      height: 'fit-content',
      paddingTop: '10px',
    },
  },
  {
    headerName: 'Times',
    field: 'times',
    editable: true,
    cellRenderer: TimeInput,
    width: 80,
  },
  {
    headerName: 'Booking Status',
    field: 'bookingStatus',
    cellRenderer: SelectBookingStatusRender,
    width: 146,
  },
  {
    headerName: 'Pencil No.',
    field: 'pencilNo',
    // cellRenderer: SelectPencilRender,
    // options: mappedPencilNo,
    width: 100,
    maxWidth: 100,
    editable: true,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: {
      values: pencilNo,
      valueListMaxHeight: 200,
      valueListMaxWidth: 150,
    } as ISelectCellEditorParams,
    cellStyle: {
      overflow: 'visible',
      // marginLeft: 'auto',
      // marginRight: 'auto',
      zIndex: '200',
      // text: 'center',
      width: 80,
      maxWidth: 80,
    },
  },
  { headerName: 'Notes', field: 'notes', width: 100, cellRenderer: NoteColumnRenderer },
];
