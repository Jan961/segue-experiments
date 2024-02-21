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
import SelectPencilRender from './SelectPencilRender';
import CheckPerfRender from './CheckPerfRender';

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

export const NewBookingColumnDefs = [
  { headerName: 'Date', field: 'date', cellRenderer: DefaultCellRenderer, width: 130 },

  // for perf y/n the style for the checkbox is givin in the components\core-ui-lib\Table\gridStyles.ts
  {
    headerName: 'Perf Y/N',
    field: 'perf',
    width: 100,
    cellRenderer: CheckPerfRender,
    editable: false,
    cellStyle: {
      height: 'fit-content',

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
    // cellEditorParams: {
    //   values: venue,
    // },
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
    maxWidth: 146,
    width: 146,
    cellStyle: {
      overflow: 'visible',
      width: 146,
    },
  },
  {
    headerName: 'Pencil No.',
    field: 'pencilNo',
    cellRenderer: SelectPencilRender,

    width: 100,
    maxWidth: 100,
    // editable: true,

    cellEditorParams: {
      // values: pencilNo,
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

export const gapSuggestColumnDefs = [
  { headerName: 'Venue', field: 'venue', cellRenderer: DefaultCellRenderer, flex: 1, headerClass: 'text-center' },
  { headerName: 'Town', field: 'town', cellRenderer: DefaultCellRenderer, flex: 1, headerClass: 'text-center' },
  { headerName: 'Seats', field: 'seats', cellRenderer: DefaultCellRenderer, width: 75, headerClass: 'text-center' },
  {
    headerName: 'Travel Time',
    field: 'travelTime',
    cellRenderer: DefaultCellRenderer,
    width: 75,
    headerClass: 'text-center',
  },
  {
    headerName: 'Barring Check',
    field: 'barringCheck',
    cellRenderer: DefaultCellRenderer,
    flex: 1,
    headerClass: 'text-center',
  },
];
