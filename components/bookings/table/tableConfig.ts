import { tileColors } from 'config/global';
import NoteColumnRenderer from './NoteColumnRenderer';
import DateColumnRenderer from './DateColumnRenderer';
import DefaultCellRenderer from './DefaultCellRenderer';
import VenueColumnRenderer from './VenueColumnRenderer';
import MilesRenderer from './MilesRenderer';
import TravelTimeRenderer from './TravelTimeRenderer';
import TableTooltip from 'components/core-ui-lib/Table/TableTooltip';
import { ITooltipParams } from 'ag-grid-community';
import BarringCheckButtonRenderer from './BarringCheckButtonRenderer';
import SelectableColumnRenderer from './SelectableColumnRenderer';
import SelectBookingStatusRenderer from './SelectBookingStatusRenderer';
import SelectDayTypeRender from './SelectDayTypeRender';
import NoPerfRenderer from './NoPerfRenderer';
import SelectVenueRenderer from './SelectVenueRenderer';
import SelectPencilRenderer from './SelectPencilRenderer';
import CheckPerfRenderer from './CheckPerfRenderer';
import TimeArrayRenderer from './TimeArrayRenderer';
import IconRenderer from './IconRenderer';
import { formatMinutes } from 'utils/booking';

export const styleProps = { headerColor: tileColors.bookings };

export const columnDefs = [
  {
    headerName: 'Production',
    field: 'production',
    cellRenderer: DefaultCellRenderer,
    width: 106,
  },
  {
    headerName: 'Date',
    field: 'date',
    cellRenderer: DateColumnRenderer,
    width: 120,
    minWidth: 120,
  },
  { headerName: 'Wk', field: 'week', cellRenderer: DefaultCellRenderer, width: 55 },
  { headerName: 'Venue Details', field: 'venue', cellRenderer: VenueColumnRenderer, minWidth: 256, flex: 2 },
  { headerName: 'Town', field: 'town', cellRenderer: DefaultCellRenderer, minWidth: 100, flex: 1 },
  { headerName: 'Day Type', field: 'dayType', cellRenderer: DefaultCellRenderer, width: 95 },
  {
    headerName: 'Booking Status',
    field: 'bookingStatus',
    cellRenderer: DefaultCellRenderer,
    resizable: true,
    width: 105,
  },
  { headerName: 'Capacity', field: 'capacity', cellRenderer: DefaultCellRenderer, width: 90 },
  { headerName: 'No. Perfs', field: 'performanceCount', cellRenderer: DefaultCellRenderer, width: 70 },
  { headerName: 'Perf Times', field: 'performanceTimes', cellRenderer: DefaultCellRenderer, width: 90, minWidth: 90 },
  {
    headerName: 'Miles',
    field: 'miles',
    cellRenderer: MilesRenderer,
    width: 69,
  },
  { headerName: 'Travel Time', field: 'travelTime', cellRenderer: TravelTimeRenderer, width: 80 },
  {
    headerName: '',
    field: 'note',
    cellRenderer: NoteColumnRenderer,
    resizable: false,
    width: 50,
    tooltipValueGetter: (params: ITooltipParams) =>
      params.data.venue && params.data.dayType && (params.value ? 'View Notes' : 'No Notes'),
    tooltipComponentParams: { left: '-2.5rem' },
    tooltipComponent: TableTooltip,
    cellStyle: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
];

export const previewColumnDefs = [
  {
    headerName: 'Production',
    field: 'production',
    cellRenderer: DefaultCellRenderer,
    width: 118,
  },
  {
    headerName: 'Date',
    field: 'date',
    cellRenderer: DateColumnRenderer,
    width: 123,
    minWidth: 123,
  },
  { headerName: 'Wk', field: 'week', cellRenderer: DefaultCellRenderer, width: 60 },
  { headerName: 'Venue Details', field: 'venue', cellRenderer: VenueColumnRenderer, minWidth: 256, flex: 2 },
  { headerName: 'Town', field: 'town', cellRenderer: DefaultCellRenderer, minWidth: 100, flex: 1 },
  { headerName: 'Day Type', field: 'dayType', cellRenderer: DefaultCellRenderer, width: 95 },
  {
    headerName: 'Booking Status',
    field: 'bookingStatus',
    cellRenderer: DefaultCellRenderer,
    resizable: true,
    width: 105,
  },
  { headerName: 'Capacity', field: 'capacity', cellRenderer: DefaultCellRenderer, width: 100 },
  { headerName: 'No. Perfs', field: 'performanceCount', cellRenderer: DefaultCellRenderer, width: 90 },
  { headerName: 'Perf Times', field: 'performanceTimes', cellRenderer: DefaultCellRenderer, width: 90, minWidth: 90 },
  {
    headerName: 'Miles',
    field: 'miles',
    cellRenderer: DefaultCellRenderer,
    width: 80,
  },
  {
    headerName: 'Travel Time',
    field: 'travelTime',
    valueFormatter: (params) => formatMinutes(Number(params.value)),
    width: 90,
    cellStyle: {
      paddingLeft: '0.5rem',
    },
    resizable: false,
  },
];

export const bookingConflictsColumnDefs = [
  { headerName: 'Venue', field: 'venue', cellRenderer: DefaultCellRenderer, flex: 1 },
  { headerName: 'Date', field: 'date', cellRenderer: DefaultCellRenderer, width: 110 },
  {
    headerName: 'Booking Status',
    field: 'bookingStatus',
    cellRenderer: DefaultCellRenderer,
    width: 145,
    resizable: false,
  },
];

export const barringIssueColumnDefs = [
  { headerName: 'Venue', field: 'Name', cellRenderer: DefaultCellRenderer, flex: 1 },
  { headerName: 'Date', field: 'date', cellRenderer: DefaultCellRenderer, width: 110 },
  { headerName: 'Miles', field: 'Mileage', cellRenderer: DefaultCellRenderer, width: 90, resizable: false },
];

export const newBookingColumnDefs = (dayTypeOptions = [], venueOptions = []) => [
  { headerName: 'Date', field: 'date', cellRenderer: DefaultCellRenderer, width: 112, maxWidth: 112 },

  // for perf y/n the style for the checkbox is givin in the components\core-ui-lib\Table\gridStyles.ts
  {
    headerName: `Perf Y/N`,
    field: 'perf',
    width: 72,
    maxWidth: 72,
    cellRenderer: CheckPerfRenderer,
    cellRendererParams: {
      dayTypeOptions,
    },
    cellStyle: {
      display: 'flex',
      justifyContent: 'center',
      paddingTop: '0.75rem',
    },
  },

  {
    headerName: 'Day Type',
    field: 'dayType',
    cellRenderer: SelectDayTypeRender,
    cellRendererParams: {
      dayTypeOptions,
    },
    width: 230,
    maxWidth: 230,
    cellStyle: {
      overflow: 'visible',
    },
  },
  {
    headerName: 'Venue',
    field: 'venue',
    cellRenderer: SelectVenueRenderer,
    cellRendererParams: {
      dayTypeOptions,
      venueOptions,
    },
    flex: 1,
    cellStyle: {
      overflow: 'visible',
    },
  },
  {
    headerName: 'No Perf',
    field: 'noPerf',
    cellRenderer: NoPerfRenderer,
    width: 72,
    maxWidth: 72,
  },
  {
    headerName: 'Times',
    field: 'times',
    getColId: () => 'times',
    wrapText: true,
    cellRenderer: TimeArrayRenderer,
    width: 102,
    maxWidth: 102,
    cellStyle: {
      display: 'flex',
      paddingTop: '0.3rem',
    },
  },
  {
    headerName: 'Booking Status',
    field: 'bookingStatus',
    cellRenderer: SelectBookingStatusRenderer,
    maxWidth: 146,
    width: 146,
    cellStyle: {
      overflow: 'visible',
    },
  },
  {
    headerName: 'Pencil No.',
    field: 'pencilNo',
    cellRenderer: SelectPencilRenderer,
    cellRendererParams: {
      dayTypeOptions,
    },
    width: 100,
    maxWidth: 100,
    cellStyle: {
      overflow: 'visible',
    },
  },
  {
    headerName: 'Notes',
    field: 'notes',
    cellRenderer: NoteColumnRenderer,
    resizable: false,
    width: 85,
    maxWidth: 85,
    cellStyle: {
      display: 'flex',
      justifyContent: 'center',
      paddingTop: '0.4rem',
    },
  },
];

export const gapSuggestColumnDefs = [
  { headerName: 'Venue', field: 'Name', cellRenderer: SelectableColumnRenderer, flex: 1, headerClass: 'text-center' },
  { headerName: 'Town', field: 'Town', cellRenderer: DefaultCellRenderer, width: 140, headerClass: 'text-center' },
  { headerName: 'Seats', field: 'Capacity', cellRenderer: DefaultCellRenderer, width: 75, headerClass: 'text-center' },
  {
    headerName: 'Travel Time',
    field: 'TravelTime',
    cellRenderer: DefaultCellRenderer,
    width: 90,
    headerClass: 'text-center',
  },
  {
    headerName: 'Barring Check',
    field: 'barringCheck',
    cellRenderer: BarringCheckButtonRenderer,
    width: 140,
    headerClass: 'text-center',
    resizable: false,
  },
];

export const tourSummaryColumnDefs = [
  {
    headerName: 'Prod Code',
    field: 'prodCode',
    cellRenderer: DefaultCellRenderer,
    width: 100,
  },
  { headerName: ' ', field: 'name', cellRenderer: DefaultCellRenderer, width: 305 },
  {
    headerName: '',
    field: 'value',
    cellRenderer: DefaultCellRenderer,
    width: 90,
    resizable: false,
  },
];

export const barredVenueColumnDefs = [
  { headerName: 'Venue', field: 'Name', cellRenderer: SelectableColumnRenderer, flex: 1, headerClass: 'text-center' },
  {
    headerName: 'Date',
    field: 'FormattedDate',
    cellRenderer: DefaultCellRenderer,
    width: 80,
    headerClass: 'text-center',
  },
  {
    headerName: 'Miles',
    field: 'Mileage',
    cellRenderer: DefaultCellRenderer,
    width: 80,
    headerClass: 'text-center',
  },
  {
    headerName: '',
    field: 'info',
    cellRenderer: IconRenderer,
    cellRendererParams: {
      iconName: 'info-circle-solid',
      tooltipPosition: 'left',
      popover: true,
    },
    width: 40,
    headerClass: 'text-center',
    resizable: false,
    cellStyle: {
      overflow: 'visible',
    },
  },
];
export const venueColumnDefs = [
  {
    headerName: 'Venue Code',
    field: 'Code',
    cellRenderer: DefaultCellRenderer,
    width: 120,
    headerClass: 'text-center',
  },
  {
    headerName: 'Venue Name',
    field: 'Name',
    cellRenderer: DefaultCellRenderer,
    flex: 1,
    headerClass: 'text-center',
  },
  {
    headerName: 'Town',
    field: 'Town',
    cellRenderer: DefaultCellRenderer,
    flex: 1,
    headerClass: 'text-center',
  },
  {
    headerName: 'Capacity',
    field: 'Seats',
    cellRenderer: DefaultCellRenderer,
    width: 120,
    headerClass: 'text-center',
    resizable: false,
  },
];
