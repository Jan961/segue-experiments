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
<<<<<<< HEAD
import TimeArrayRenderer from './TimeArrayRenderer';
<<<<<<< HEAD
<<<<<<< HEAD
import IconRenderer from './IconRenderer';
<<<<<<< HEAD
<<<<<<< HEAD
import { formatMinutes } from 'utils/booking';
=======
=======
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
<<<<<<< HEAD
>>>>>>> 14383bc (feature/SK-49-VenueHistoryModalSK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)
=======
=======
import TimeArrayRender from './TimeArrayRender';
import SalesDataButtonRenderer from './SalesDataButtonRenderer';
import SelectCompOrderRender from './SelectCompOrderRender';
>>>>>>> e349e74 (SK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)
<<<<<<< HEAD
>>>>>>> 3a6cc8d (feature/SK-49-VenueHistoryModalSK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)
=======
=======
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
>>>>>>> ef562f9 (feature/SK-49-VenueHistoryModalSK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)
=======
>>>>>>> a76f448 (flow complete will loading handlers and the week row does not repeat on the sales comparison table)
=======
import SalesDataButtonRenderer from './SalesDataButtonRenderer';
import SelectCompOrderRender from './SelectCompOrderRender';
>>>>>>> 6849499 (merged main into VenueHistory and added final modal with column grouping - UI still needs tweaked and code needs tidied)
=======
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
import TimeArrayRender from './TimeArrayRender';
import SalesDataButtonRenderer from './SalesDataButtonRenderer';
import SelectCompOrderRender from './SelectCompOrderRender';
>>>>>>> e349e74 (SK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)

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
    width: 75,
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

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 6da9241 (bookings tableConfig seemed to be missing previewColDefs causing the build to fail)
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
<<<<<<< HEAD
    width: 123,
    minWidth: 123,
=======
    width: 120,
    minWidth: 120,
>>>>>>> 6da9241 (bookings tableConfig seemed to be missing previewColDefs causing the build to fail)
  },
  { headerName: 'Wk', field: 'week', cellRenderer: DefaultCellRenderer, width: 60 },
  { headerName: 'Venue Details', field: 'venue', cellRenderer: VenueColumnRenderer, minWidth: 256, flex: 2 },
  { headerName: 'Town', field: 'town', cellRenderer: DefaultCellRenderer, minWidth: 100, flex: 1 },
  { headerName: 'Day Type', field: 'dayType', cellRenderer: DefaultCellRenderer, width: 95 },
  {
    headerName: 'Booking Status',
    field: 'bookingStatus',
<<<<<<< HEAD
    valueFormatter: ({ value, data }) =>
      value === 'Pencilled' && data.pencilNo ? `${value} (${data.pencilNo})` : value,
    cellStyle: {
      paddingLeft: '0.5rem',
    },
=======
    cellRenderer: DefaultCellRenderer,
    resizable: true,
>>>>>>> 6da9241 (bookings tableConfig seemed to be missing previewColDefs causing the build to fail)
    width: 105,
  },
  { headerName: 'Capacity', field: 'capacity', cellRenderer: DefaultCellRenderer, width: 100 },
  { headerName: 'No. Perfs', field: 'performanceCount', cellRenderer: DefaultCellRenderer, width: 90 },
  { headerName: 'Perf Times', field: 'performanceTimes', cellRenderer: DefaultCellRenderer, width: 90, minWidth: 90 },
  {
<<<<<<< HEAD
    valueFormatter: (params) => (params.value === -1 ? 'No Data' : params.value),
    headerName: 'Miles',
    field: 'miles',
    cellStyle: ({ value, data }) => ({
      paddingLeft: '0.5rem',
      backgroundColor: value === -1 ? '#D41818' : data.highlightRow ? '#FAD0CC' : '#FFF',
      color: value === -1 ? '#FFBE43' : '#617293',
      fontStyle: value === -1 ? 'italic' : 'normal',
    }),
    width: 80,
  },
  {
    headerName: 'Travel Time',
    field: 'travelTime',
    valueFormatter: (params) => (params.value === -1 ? 'No Data' : formatMinutes(Number(params.value))),
    width: 90,
    cellStyle: ({ value, data }) => ({
      paddingLeft: '0.5rem',
      backgroundColor: value === -1 ? '#D41818' : data.highlightRow ? '#FAD0CC' : '#FFF',
      color: value === -1 ? '#FFBE43' : '#617293',
      fontStyle: value === -1 ? 'italic' : 'normal',
    }),
    resizable: false,
  },
];

=======
>>>>>>> a76f448 (flow complete will loading handlers and the week row does not repeat on the sales comparison table)
=======
    headerName: 'Miles',
    field: 'miles',
    cellRenderer: MilesRenderer,
    width: 80,
  },
  { headerName: 'Travel Time', field: 'travelTime', cellRenderer: TravelTimeRenderer, width: 80, resizable: false },
];
>>>>>>> 6da9241 (bookings tableConfig seemed to be missing previewColDefs causing the build to fail)
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
    cellRendererParams: {
      dayTypeOptions,
    },
    maxWidth: 180,
    width: 180,
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
<<<<<<< HEAD
];
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

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
    tooltipComponentParams: { color: '#ffffff', backgroundColor: '#617293' },
    tooltipValueGetter: (props) => props?.data?.info,
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
=======
>>>>>>> 3a6cc8d (feature/SK-49-VenueHistoryModalSK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)
=======
=======
>>>>>>> a76f448 (flow complete will loading handlers and the week row does not repeat on the sales comparison table)

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
<<<<<<< HEAD
    width: 125,
    cellStyle: {
      textAlign: 'center',
>>>>>>> e349e74 (SK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)
    },
  },
>>>>>>> 226d528 (feature/SK-49-VenueHistoryModalSK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)
  {
    headerName: 'Production',
<<<<<<< HEAD
    field: 'prodName',
    cellRenderer: DefaultCellRenderer,
    width: 350,
=======
    field: 'prodNum',
    cellRenderer: DefaultCellRenderer,
    width: 115,
>>>>>>> e349e74 (SK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)
  },
  {
    headerName: 'Date of First Performance',
    field: 'firstPerfDt',
    cellRenderer: DateColumnRenderer,
    width: 130,
    cellStyle: {
      textAlign: 'center',
    },
  },
  {
    headerName: 'No. Perfs',
    field: 'numPerfs',
    cellRenderer: DefaultCellRenderer,
    width: 70,
    cellStyle: {
      textAlign: 'center',
    },
  },
  {
    headerName: 'Production Duration (Wks)',
    field: 'prodWks',
    cellRenderer: DefaultCellRenderer,
    width: 140,
    cellStyle: {
      textAlign: 'center',
    },
  },
  {
    headerName: 'Sales Data',
    cellRenderer: SalesDataButtonRenderer,
<<<<<<< HEAD
    width: 150,
    cellStyle: {
      textAlign: 'center',
    },
    resizable: false
=======
>>>>>>> a76f448 (flow complete will loading handlers and the week row does not repeat on the sales comparison table)
  },
<<<<<<< HEAD
>>>>>>> b5184e9 (SalesTable component added, Venue History integrates new component, table UI perfected)
];
<<<<<<< HEAD
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
=======


export const venueHistCompColumnDefs = (optionsLength = 0) => [
=======


export const venueHistCompColumnDefs = (optionsLength = 0, selectForComparison) => [
>>>>>>> 6849499 (merged main into VenueHistory and added final modal with column grouping - UI still needs tweaked and code needs tidied)
  {
    headerName: 'Order for Comparison',
    field: 'compOrder',
    cellRenderer: SelectCompOrderRender,
    cellRendererParams: {
      optionsLength,
<<<<<<< HEAD
    },
    width: 125,
    cellStyle: {
      textAlign: 'center',
    },
  },
  {
    headerName: 'Production',
    field: 'prodNum',
    cellRenderer: DefaultCellRenderer,
    width: 115,
  },
  {
    headerName: 'Date of First Performance',
    field: 'firstPerfDt',
    cellRenderer: DateColumnRenderer,
    width: 130,
    cellStyle: {
      textAlign: 'center',
    },
  },
  {
    headerName: 'No. Perfs',
    field: 'numPerfs',
    cellRenderer: DefaultCellRenderer,
    width: 70,
    cellStyle: {
      textAlign: 'center',
    },
  },
  {
    headerName: 'Production Duration (Wks)',
    field: 'prodWks',
    cellRenderer: DefaultCellRenderer,
    width: 140,
    cellStyle: {
      textAlign: 'center',
    },
  },
  {
    headerName: 'Sales Data',
    cellRenderer: SalesDataButtonRenderer,
    width: 115,
    cellStyle: {
      textAlign: 'center',
    },
  },

>>>>>>> 0c9e4c4 (SK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)
=======
>>>>>>> a31260e (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
];
=======
>>>>>>> f3a124c (feature/SK-49-VenueHistoryModalSK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)
=======
];
<<<<<<< HEAD
>>>>>>> b5184e9 (SalesTable component added, Venue History integrates new component, table UI perfected)
<<<<<<< HEAD
>>>>>>> 226d528 (feature/SK-49-VenueHistoryModalSK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)
=======
=======
];
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
<<<<<<< HEAD
>>>>>>> 14383bc (feature/SK-49-VenueHistoryModalSK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)
=======
=======
    width: 115,
    cellStyle: {
      textAlign: 'center',
    },
=======
export const venueColumnDefs = [
  {
    headerName: 'Venue Code',
    field: 'VenueCode',
    cellRenderer: DefaultCellRenderer,
    width: 120,
    headerClass: 'text-center',
  },
  {
    headerName: 'Venue Name',
    field: 'VenueName',
    cellRenderer: DefaultCellRenderer,
    flex: 1,
    headerClass: 'text-center',
  },
  {
    headerName: 'Town',
    field: 'VenueTown',
    cellRenderer: DefaultCellRenderer,
    flex: 1,
    headerClass: 'text-center',
  },
  {
    headerName: 'Capacity',
    field: 'VenueCapacity',
    cellRenderer: DefaultCellRenderer,
    width: 120,
    headerClass: 'text-center',
>>>>>>> a76f448 (flow complete will loading handlers and the week row does not repeat on the sales comparison table)
  },
<<<<<<< HEAD
<<<<<<< HEAD
=======
  {
=======
      selectForComparison
    },
    width: 120,
    cellStyle: {
      textAlign: 'center',
      overflow: 'visible',
    },
  },
  {
>>>>>>> 6849499 (merged main into VenueHistory and added final modal with column grouping - UI still needs tweaked and code needs tidied)
    headerName: 'Production',
    field: 'prodName',
    cellRenderer: DefaultCellRenderer,
    width: 350,
  },
  {
    headerName: 'Date of First Performance',
    field: 'firstPerfDt',
    cellRenderer: DateColumnRenderer,
    width: 130,
    cellStyle: {
      textAlign: 'center',
    },
  },
  {
    headerName: 'No. Perfs',
    field: 'numPerfs',
    cellRenderer: DefaultCellRenderer,
    width: 70,
    cellStyle: {
      textAlign: 'center',
    },
  },
  {
    headerName: 'Production Duration (Wks)',
    field: 'prodWks',
    cellRenderer: DefaultCellRenderer,
    width: 140,
    cellStyle: {
      textAlign: 'center',
    },
  },
  {
    headerName: 'Sales Data',
    cellRenderer: SalesDataButtonRenderer,
    width: 150,
    cellStyle: {
      textAlign: 'center',
    },
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    resizable: false
  },
>>>>>>> b5184e9 (SalesTable component added, Venue History integrates new component, table UI perfected)
];
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> e349e74 (SK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)
<<<<<<< HEAD
>>>>>>> 3a6cc8d (feature/SK-49-VenueHistoryModalSK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)
=======
=======
];
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
>>>>>>> ef562f9 (feature/SK-49-VenueHistoryModalSK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)
=======
>>>>>>> a76f448 (flow complete will loading handlers and the week row does not repeat on the sales comparison table)
=======
=======
>>>>>>> e349e74 (SK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)


export const venueHistCompColumnDefs = (optionsLength = 0) => [
  {
    headerName: 'Order for Comparison',
    field: 'compOrder',
    cellRenderer: SelectCompOrderRender,
    cellRendererParams: {
      optionsLength,
    },
    width: 125,
    cellStyle: {
      textAlign: 'center',
    },
  },
  {
    headerName: 'Production',
    field: 'prodNum',
    cellRenderer: DefaultCellRenderer,
    width: 115,
  },
  {
    headerName: 'Date of First Performance',
    field: 'firstPerfDt',
    cellRenderer: DateColumnRenderer,
    width: 130,
    cellStyle: {
      textAlign: 'center',
    },
  },
  {
    headerName: 'No. Perfs',
    field: 'numPerfs',
    cellRenderer: DefaultCellRenderer,
    width: 70,
    cellStyle: {
      textAlign: 'center',
    },
  },
  {
    headerName: 'Production Duration (Wks)',
    field: 'prodWks',
    cellRenderer: DefaultCellRenderer,
    width: 140,
    cellStyle: {
      textAlign: 'center',
    },
  },
  {
    headerName: 'Sales Data',
    cellRenderer: SalesDataButtonRenderer,
    width: 115,
    cellStyle: {
      textAlign: 'center',
    },
  },

<<<<<<< HEAD
=======
>>>>>>> a31260e (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
];
>>>>>>> 0c9e4c4 (SK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)
=======
=======
    resizable: false
>>>>>>> b5184e9 (SalesTable component added, Venue History integrates new component, table UI perfected)
=======
    resizable: false
>>>>>>> bdad6b3 (SalesTable component added, Venue History integrates new component, table UI perfected)
  },
];
>>>>>>> 6849499 (merged main into VenueHistory and added final modal with column grouping - UI still needs tweaked and code needs tidied)
=======
];
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
];
>>>>>>> e349e74 (SK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)
