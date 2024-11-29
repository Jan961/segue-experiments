import { tileColors } from 'config/global';
import NoteColumnRenderer from './NoteColumnRenderer';
import DateColumnRenderer from './DateColumnRenderer';
import DefaultCellRenderer from './DefaultCellRenderer';
import VenueColumnRenderer from './VenueColumnRenderer';
import SelectableColumnRenderer from './SelectableColumnRenderer';
import SelectBookingStatusRenderer from './SelectBookingStatusRenderer';
import SelectDayTypeRender from './SelectDayTypeRender';
import NoPerfRenderer from './NoPerfRenderer';
import SelectVenueRenderer from './SelectVenueRenderer';
import SelectPencilRenderer from './SelectPencilRenderer';
import CheckPerfRenderer from './CheckPerfRenderer';
import PerformanceTimesRenderer from './PerformanceTimesRenderer';
import IconRenderer from './IconRenderer';
import ButtonRenderer from 'components/core-ui-lib/Table/renderers/ButtonRenderer';
import SelectBarredVenuesRenderer from './SelectBarredVenuesRenderer';
import { formatMinutes } from 'utils/booking';
import AddDeleteRowRenderer from './AddDeleteRowRenderer';
import { dateToReadableFormat } from 'utils/export';
import { FilterState } from 'state/booking/filterState';

export const styleProps = { headerColor: tileColors.bookings };

const milesFormatter = (params) => (params.value === -1 ? 'No Data' : params.value);
const travelTimeFormatter = (params) => (params.value === -1 ? 'No Data' : formatMinutes(Number(params.value)));
const milesCellStyle = ({ value, data, node }) => ({
  paddingLeft: '0.5rem',
  backgroundColor:
    value === -1
      ? '#D41818'
      : data.isDeleted
      ? '#D4D4D4'
      : data.highlightRow
      ? '#FAD0CC'
      : node?.rowStyle?.backgroundColor,
  color: value === -1 ? '#FFBE43' : '#617293',
  fontStyle: value === -1 ? 'italic' : 'normal',
});

export const columnDefs = (canAccessNotes: boolean) => {
  const columns = [
    {
      headerName: 'Production',
      field: 'production',
      cellRenderer: DefaultCellRenderer,
      headerClass: ['bgOrangeTextWhite'],
      width: 106,
      sortable: true,
    },
    {
      headerName: 'Date',
      field: 'date',
      cellRenderer: DateColumnRenderer,
      headerClass: ['bgOrangeTextWhite'],
      width: 120,
      minWidth: 120,
      cellClassRules: {
        isMonday: (params) => params.value.includes('Mon'),
      },
      comparator: (valueA, valueB, _nodeA, _nodeB, _isDescending) => {
        const aTrimmed = valueA.slice(4);
        const bTrimmed = valueB.slice(4);
        const aDateParts = aTrimmed
          .split('/')
          .map((item: string) => {
            return parseInt(item);
          })
          .reverse();
        const bDateParts = bTrimmed
          .split('/')
          .map((item: string) => {
            return parseInt(item);
          })
          .reverse();
        const compareDates = (date1: number[], date2: number[]) => {
          if (date1.length === 0 || date2.length === 0) return 0;

          if (date1[0] === date2[0]) {
            return compareDates(date1.slice(1), date2.slice(1));
          } else {
            return date1[0] > date2[0] ? 1 : -1;
          }
        };
        return compareDates(aDateParts, bDateParts);
      },
    },
    {
      headerName: 'Wk',
      field: 'week',
      headerClass: ['bgOrangeTextWhite'],
      cellRenderer: DefaultCellRenderer,
      width: 55,
    },
    {
      headerName: 'Venue Details',
      field: 'venue',
      cellRenderer: VenueColumnRenderer,
      headerClass: ['bgOrangeTextWhite'],
      minWidth: 6,
      flex: 2,

      cellClassRules: {
        dayTypeNotPerformance: (params) => {
          const { dayType } = params.data;
          return dayType !== 'Performance' && params.value !== '';
        },
        cancelledBooking: (params) => {
          const { bookingStatus } = params.data;
          return bookingStatus === 'Cancelled' && params.value !== '';
        },
        suspendedBooking: (params) => {
          const { bookingStatus } = params.data;
          return bookingStatus === 'Suspended' && params.value !== '';
        },
        pencilledBooking: (params) => {
          const { bookingStatus, multipleVenuesOnSameDate } = params.data;
          return bookingStatus === 'Pencilled' && multipleVenuesOnSameDate && params.value !== '';
        },
        multipleBookings: (params) => {
          const { dayType, venueHasMultipleBookings } = params.data;
          return dayType === 'Performance' && venueHasMultipleBookings && params.value !== '';
        },
      },
    },
    {
      headerName: 'Town',
      field: 'town',
      cellRenderer: DefaultCellRenderer,
      headerClass: ['bgOrangeTextWhite'],
      minWidth: 100,
      flex: 1,
    },
    {
      headerName: 'Day Type',
      field: 'dayType',
      cellRenderer: DefaultCellRenderer,
      headerClass: ['bgOrangeTextWhite'],
      width: 95,
    },
    {
      headerName: 'Booking Status',
      field: 'bookingStatus',
      valueFormatter: ({ value, data }) =>
        value === 'Pencilled' && data.pencilNo ? `${value} (${data.pencilNo})` : value,
      headerClass: ['bgOrangeTextWhite'],
      cellStyle: {
        paddingLeft: '0.5rem',
      },
      resizable: true,
      width: 105,
    },
    {
      headerName: 'Capacity',
      field: 'capacity',
      cellRenderer: DefaultCellRenderer,
      headerClass: ['bgOrangeTextWhite'],
      width: 90,
    },
    {
      headerName: 'No. Perfs',
      field: 'performanceCount',
      cellRenderer: DefaultCellRenderer,
      headerClass: ['bgOrangeTextWhite'],
      width: 70,
    },
    {
      headerName: 'Perf Times',
      field: 'performanceTimes',
      cellRenderer: DefaultCellRenderer,
      headerClass: ['bgOrangeTextWhite'],
      width: 90,
      minWidth: 90,
    },
    {
      headerName: 'Miles',
      field: 'miles',
      valueFormatter: milesFormatter,
      headerClass: ['bgOrangeTextWhite'],
      cellStyle: milesCellStyle,
      width: 80,
    },
    {
      headerName: 'Travel Time',
      field: 'travelTime',
      width: 90,
      valueFormatter: travelTimeFormatter,
      headerClass: ['bgOrangeTextWhite'],
      cellStyle: milesCellStyle,
    },
  ];

  const notesColumn = {
    headerName: '',
    field: 'note',
    cellRenderer: NoteColumnRenderer,
    headerClass: ['bgOrangeTextWhite'],
    cellRendererParams: {
      tpActive: true,
    },
    resizable: false,
    width: 50,
    cellStyle: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'visible',
    },
  };
  return canAccessNotes ? [...columns, notesColumn] : columns;
};

export const getExportExtraContent = (
  showName: string,
  showCode: string,
  code: string,
  appliedFilters: FilterState,
) => {
  return {
    prependContent: [
      { cells: [] },
      {
        cells: [
          {
            data: { value: `${showCode}${code} - ${showName}`, type: 'String', mergeCells: true },
            styleId: 'selectedProductionName',
            mergeCells: true,
          },
          {},
          {},
          {},
        ],
        height: 70,
        width: 500,
        mergeCells: true,
      },
      { cells: [] },
      { cells: [{ data: { value: 'Filter(s) applied', type: 'String' } }] },
      {
        cells: [
          { data: { value: 'Start Date', type: 'String' } },
          { data: { value: dateToReadableFormat(appliedFilters?.startDate), type: 'Date' } },
        ],
      },
      {
        cells: [
          { data: { value: 'End Date', type: 'String' } },
          { data: { value: dateToReadableFormat(appliedFilters?.endDate), type: 'Date' } },
        ],
      },
      {
        cells: [
          { data: { value: 'Search', type: 'String' } },
          { data: { value: appliedFilters?.venueText, type: 'String' } },
        ],
      },
      {
        cells: [
          { data: { value: 'Booking Status', type: 'String' } },
          { data: { value: appliedFilters?.status, type: 'String' } },
        ],
      },
      { cells: [] },
    ],
    fileName: `Tour Schedule for ${showCode + code}`,
    columnKeys: [
      'production',
      'date',
      'week',
      'venue',
      'town',
      'dayType',
      'bookingStatus',
      'capacity',
      'performanceCount',
      'performanceTimes',
      'miles',
      'travelTime',
    ],
  };
};

export const columnDefsExportStyles = [
  {
    id: 'bgOrangeTextWhite',
    interior: {
      color: tileColors.bookings,
      pattern: 'Solid',
    },
    font: {
      color: '#FFFFFF',
    },
    alignment: {
      horizontal: 'center',
    },
  },
  {
    id: 'dayTypeNotPerformance',
    interior: {
      color: '#D41818', // bg-primary-red
      pattern: 'Solid',
    },
    font: {
      color: '#FDCE74', // text-primary-yellow
      italic: true,
    },
  },
  {
    id: 'cancelledBooking',
    interior: {
      color: '#111827', // bg-primary-black
      pattern: 'Solid',
    },
    font: {
      color: '#FFFFFF', // text-primary-white
    },
  },
  {
    id: 'suspendedBooking',
    interior: {
      color: '#8B5CF6', // bg-secondary-purple
      pattern: 'Solid',
    },
    font: {
      color: '#FFFFFF', // text-primary-white
    },
  },
  {
    id: 'pencilledBooking',
    interior: {
      color: '#3B82F6', // bg-primary-blue
      pattern: 'Solid',
    },
    font: {
      color: '#FFFFFF', // text-primary-white
    },
  },
  {
    id: 'multipleBookings',
    font: {
      color: '#D41818', // text-primary-red
      bold: 'bold',
    },
  },
  {
    id: 'isMonday',
    interior: {
      color: '#FDCE74',
      pattern: 'Solid',
    },
  },
  {
    id: 'selectedProductionName',
    interior: {
      color: tileColors.bookings,
      pattern: 'Solid',
    },
    font: {
      bold: true,
      color: '#FFFFFF',
      size: 15,
    },
    alignment: {
      horizontal: 'Center',
      vertical: 'Center',
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
    valueFormatter: ({ value, data }) =>
      value === 'Pencilled' && data.pencilNo ? `${value} (${data.pencilNo})` : value,
    cellStyle: {
      paddingLeft: '0.5rem',
    },
    width: 105,
  },
  { headerName: 'Capacity', field: 'capacity', cellRenderer: DefaultCellRenderer, width: 100 },
  { headerName: 'No. Perfs', field: 'performanceCount', cellRenderer: DefaultCellRenderer, width: 90 },
  { headerName: 'Perf Times', field: 'performanceTimes', cellRenderer: DefaultCellRenderer, width: 90, minWidth: 90 },
  {
    valueFormatter: milesFormatter,
    headerName: 'Miles',
    field: 'miles',
    cellStyle: milesCellStyle,
    width: 80,
  },
  {
    headerName: 'Travel Time',
    field: 'travelTime',
    valueFormatter: travelTimeFormatter,
    width: 90,
    cellStyle: milesCellStyle,
    resizable: false,
  },
];

export const bookingConflictsColumnDefs = [
  { headerName: 'Venue', field: 'venue', cellRenderer: DefaultCellRenderer, flex: 1 },
  { headerName: 'Date', field: 'date', cellRenderer: DefaultCellRenderer, width: 120 },
  {
    headerName: 'Booking Status',
    field: 'bookingStatus',
    cellRenderer: DefaultCellRenderer,
    width: 145,
    resizable: false,
  },
];

export const barringIssueColumnDefs = [
  { headerName: 'Venue', field: 'name', cellRenderer: DefaultCellRenderer, flex: 1 },
  { headerName: 'Date', field: 'date', cellRenderer: DefaultCellRenderer, width: 110 },
  { headerName: 'Miles', field: 'mileage', cellRenderer: DefaultCellRenderer, width: 90, resizable: false },
];

export const newBookingColumnDefs = (
  dayTypeOptions = [],
  venueOptions = [],
  addRow,
  deleteRow,
  showAddDeleteRow = false,
  canAccessNotes: boolean,
) => {
  const columns = [
    {
      headerName: 'Date',
      field: 'date',
      cellRenderer: showAddDeleteRow ? AddDeleteRowRenderer : DefaultCellRenderer,
      cellRendererParams: {
        addRow,
        deleteRow,
      },
      width: showAddDeleteRow ? 155 : 112,
      maxWidth: showAddDeleteRow ? 155 : 112,
    },

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
      cellRenderer: PerformanceTimesRenderer,
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
      width: 110,
      maxWidth: 110,
      cellStyle: {
        overflow: 'visible',
      },
    },
  ];

  const notesColumn = {
    headerName: 'Notes',
    field: 'notes',
    cellRenderer: NoteColumnRenderer,
    cellRendererParams: {
      tpActive: false,
      testId: `cnb-booking-details-tbl-notes`,
    },
    resizable: false,
    width: 85,
    maxWidth: 85,
    cellStyle: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  };

  return canAccessNotes ? [...columns, notesColumn] : columns;
};

export const gapSuggestColumnDefs = [
  { headerName: 'Venue', field: 'Name', cellRenderer: SelectableColumnRenderer, flex: 1, headerClass: 'text-center' },
  { headerName: 'Town', field: 'Town', cellRenderer: DefaultCellRenderer, width: 80, headerClass: 'text-center' },
  { headerName: 'Seats', field: 'Capacity', cellRenderer: DefaultCellRenderer, width: 70, headerClass: 'text-center' },
  {
    headerName: 'Travel Time to Venue',
    field: 'TravelTimeTo',
    cellRenderer: DefaultCellRenderer,
    width: 85,
    headerClass: 'text-center',
  },
  {
    headerName: 'Miles to Venue',
    field: 'MilesTo',
    cellRenderer: DefaultCellRenderer,
    width: 75,
    headerClass: 'text-center',
  },
  {
    headerName: 'Travel Time From Venue',
    field: 'TravelTimeFrom',
    cellRenderer: DefaultCellRenderer,
    width: 85,
    headerClass: 'text-center',
  },
  {
    headerName: 'Miles From Venue',
    field: 'MilesFrom',
    cellRenderer: DefaultCellRenderer,
    width: 75,
    headerClass: 'text-center',
  },
  {
    headerName: 'Barring Check',
    field: 'barringCheck',
    cellRenderer: ButtonRenderer,
    width: 130,
    headerClass: 'text-center',
    resizable: false,
    cellRendererParams: {
      buttonText: 'Run Barring Check',
    },
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
  { headerName: 'Venue', field: 'name', cellRenderer: SelectableColumnRenderer, flex: 1, headerClass: 'text-center' },
  {
    headerName: 'Date',
    field: 'formattedDate',
    cellRenderer: DefaultCellRenderer,
    width: 80,
    headerClass: 'text-center',
  },
  {
    headerName: 'Miles',
    field: 'mileage',
    cellRenderer: DefaultCellRenderer,
    width: 80,
    headerClass: 'text-center',
  },
  {
    headerName: '',
    field: 'info',
    cellRenderer: IconRenderer,
    cellRendererParams: {
      iconProps: {
        iconName: 'info-circle-solid',
      },
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
    field: 'venueCode',
    cellRenderer: DefaultCellRenderer,
    width: 120,
    headerClass: 'text-center',
  },
  {
    headerName: 'Venue Name',
    field: 'venueName',
    cellRenderer: DefaultCellRenderer,
    flex: 1,
    headerClass: 'text-center',
  },
  {
    headerName: 'Town',
    field: 'primaryTown',
    valueFormatter: ({ value, data }) => value || data.deliveryTown,
    cellRenderer: DefaultCellRenderer,
    flex: 1,
    headerClass: 'text-center',
  },
  {
    headerName: 'Capacity',
    field: 'venueCapacity',
    cellRenderer: DefaultCellRenderer,
    width: 120,
    headerClass: 'text-center',
    resizable: false,
  },
];

export const venueContactDefs = (defaultRoles, disabled?: boolean) => [
  {
    headerName: 'Id',
    field: 'id',
    cellRenderer: DefaultCellRenderer,
    hide: true,
  },
  {
    headerName: 'Role',
    field: 'roleName',
    cellRenderer: DefaultCellRenderer,
    editable: (params) => !defaultRoles.some((role) => role.value === params.data.venueRoleId),
    width: 150,
    headerClass: 'text-center',
  },
  {
    headerName: 'First Name',
    field: 'firstName',
    editable: !disabled,
    cellRenderer: DefaultCellRenderer,
    width: 150,
    headerClass: 'text-center',
  },
  {
    headerName: 'Last Name',
    field: 'lastName',
    editable: !disabled,
    cellRenderer: DefaultCellRenderer,
    width: 150,
    headerClass: 'text-center',
  },
  {
    headerName: 'Phone',
    field: 'phone',
    editable: !disabled,
    cellRenderer: DefaultCellRenderer,
    width: 120,
    headerClass: 'text-center',
  },
  {
    headerName: 'Email',
    field: 'email',
    editable: !disabled,
    cellRenderer: DefaultCellRenderer,
    flex: 1,
    headerClass: 'text-center',
  },
  {
    headerName: '',
    field: 'delete',
    cellRenderer: IconRenderer,
    cellRendererParams: {
      iconProps: {
        iconName: 'delete',
        testId: 'delete-contact',
      },
      tooltipPosition: 'left',
      popover: true,
    },
    width: 40,
    headerClass: 'text-center',
    resizable: false,
    cellStyle: {
      overflow: 'visible',
    },
    cellClassRules: {
      '!hidden': (params) => defaultRoles.some((role) => role.value === params.data.venueRoleId),
    },
  },
];

export const getBarredVenuesColDefs = (venueOptions, selectedVenueIds) => [
  {
    headerName: 'Barred Venues',
    field: 'barredVenueId',
    cellRenderer: SelectBarredVenuesRenderer,
    cellRendererParams: {
      venueOptions,
      selectedVenueIds,
    },
    flex: 1,
    cellStyle: {
      overflow: 'visible',
    },
  },

  {
    headerName: '',
    field: 'delete',
    cellRenderer: IconRenderer,
    cellRendererParams: {
      iconProps: {
        iconName: 'delete',
      },
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
