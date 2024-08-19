import ContractStatusCellRenderer from 'components/contracts/table/ContractStatusCellRenderer';
import DefaultCellRenderer from '../bookings/table/DefaultCellRenderer';
import VenueColumnRenderer from './table/VenueColumnRenderer';
import DateColumnRenderer from './table/DateColumnRenderer';
import { tileColors } from 'config/global';
import InputRenderer from 'components/global/salesTable/renderers/InputRenderer';
import DefaultTextRenderer from 'components/core-ui-lib/Table/renderers/DefaultTextRenderer';
import formatInputDate from 'utils/dateInputFormat';
import { getTimeFromDateAndTime } from 'services/dateService';
import ButtonRenderer from 'components/core-ui-lib/Table/renderers/ButtonRenderer';
import IconRowRenderer from 'components/global/salesTable/renderers/IconRowRenderer';
import SelectCellRenderer from 'components/core-ui-lib/Table/renderers/SelectCellRenderer';
import { statusOptions, statusToBgColorMap } from 'config/contracts';
import NotesRenderer from 'components/tasks/NotesRenderer';
import DateRenderer from 'components/core-ui-lib/Table/renderers/DateRenderer';

export const contractsStyleProps = { headerColor: tileColors.contracts };

export const contractsColumnDefs = [
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
    cellClassRules: {
      isMonday: (params) => params.value.includes('Mon'),
    },
  },
  { headerName: 'Week', field: 'week', cellRenderer: DefaultCellRenderer, width: 80 },
  {
    headerName: 'Venue Details',
    field: 'venue',
    cellRenderer: VenueColumnRenderer,
    minWidth: 6,
    flex: 2,
    cellClassRules: {
      dayTypeNotPerformance: (params) => {
        const { dayType } = params.data;
        return dayType !== 'Performance' && params.value !== '';
      },
      cancelledBooking: (params) => {
        const { status } = params.data;
        return status === 'X' && params.value !== '';
      },
      suspendedBooking: (params) => {
        const { status } = params.data;
        return status === 'S' && params.value !== '';
      },
      pencilledBooking: (params) => {
        const { status, multipleVenuesOnSameDate } = params.data;
        return status === 'U' && multipleVenuesOnSameDate && params.value !== '';
      },
      multipleBookings: (params) => {
        const { dayType, venueHasMultipleBookings } = params.data;
        return dayType === 'Performance' && venueHasMultipleBookings && params.value !== '';
      },
    },
  },
  { headerName: 'Town', field: 'town', cellRenderer: DefaultCellRenderer, minWidth: 80, flex: 1 },
  { headerName: 'Capacity', field: 'capacity', cellRenderer: DefaultCellRenderer, width: 90 },
  { headerName: 'No. of Perfs', field: 'performanceCount', cellRenderer: DefaultCellRenderer, width: 90 },
  { headerName: 'Deal Memo Status', field: 'contractStatus', cellRenderer: ContractStatusCellRenderer, width: 180 },
  {
    headerName: 'Contract Status',
    field: 'contractStatus',
    cellRenderer: ContractStatusCellRenderer,
    resizable: false,
    width: 180,
  },
];

export const getCompanyContractsColumnDefs = (userList = []) => [
  {
    headerName: 'First Name',
    field: 'firstName',
    cellRenderer: DefaultCellRenderer,
    width: 150,
    flex: 1,
    cellStyle: function (params) {
      const { status } = params.data;
      console.log(status, statusToBgColorMap[status]);
      return { backgroundColor: statusToBgColorMap[status] || 'white' };
    },
  },
  {
    headerName: 'Last Name',
    field: 'lastName',
    cellRenderer: DefaultCellRenderer,
    width: 150,
    flex: 1,
    cellStyle: function (params) {
      const { status } = params.data;
      return { backgroundColor: statusToBgColorMap[status] || 'white' };
    },
  },
  { headerName: 'Role', field: 'role', cellRenderer: DefaultCellRenderer, width: 140, flex: 1, editable: true },
  {
    headerName: 'Contract Status',
    field: 'status',
    cellRenderer: SelectCellRenderer,
    valueGetter: (params) => params?.data?.status,
    width: 100,
    minWidth: 100,
    flex: 1,
    editable: true,
    cellRendererParams: () => ({
      options: statusOptions,
      isSearchable: true,
    }),
  },
  {
    headerName: '',
    field: 'edit',
    width: 60,
    cellRenderer: ButtonRenderer,
    cellRendererParams: {
      buttonText: 'Edit',
      variant: 'primary',
      width: 60,
    },
    resizable: false,
    headerClass: 'text-center',
  },
  {
    headerName: '',
    field: 'pdf',
    width: 100,
    cellRenderer: ButtonRenderer,
    cellRendererParams: () => ({
      buttonText: 'Save as PDF',
      variant: 'primary',
      width: 90,
    }),
    cellStyle: {
      paddingRight: '0.5em',
    },
  },
  {
    headerName: 'Completed By',
    field: 'completedBy',
    cellRenderer: SelectCellRenderer,
    width: 150,
    flex: 1,
    editable: true,
    valueGetter: (params) => params?.data?.completedBy,
    cellRendererParams: () => ({
      options: userList,
      isSearchable: true,
    }),
  },
  {
    headerName: 'Checked By',
    field: 'checkedBy',
    cellRenderer: SelectCellRenderer,
    width: 90,
    flex: 1,
    editable: true,
    valueGetter: (params) => params?.data?.checkedBy,
    cellRendererParams: () => ({
      options: userList,
      isSearchable: true,
    }),
  },
  { headerName: 'Date Issued', field: 'dateIssue', cellRenderer: DateRenderer, flex: 1, width: 180 },
  {
    headerName: 'Date Returned',
    field: 'dateReturned',
    cellRenderer: DateRenderer,
    resizable: false,
    width: 180,
    flex: 1,
  },
  {
    headerName: '',
    field: 'notes',
    cellRenderer: NotesRenderer,
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
  },
];

export const standardSeatKillsColumnDefs = (onChangeData, holdValue) => [
  {
    headerName: 'Type',
    field: 'type',
    cellRenderer: DefaultCellRenderer,
    width: 150,
    headerClass: 'right-border-full',
    suppressMovable: true,
    sortable: false,
    resizable: false,
  },
  {
    headerName: 'Seats',
    field: 'seats',
    cellRenderer: InputRenderer,
    cellRendererParams: () => ({
      placeholder: '',
      inline: true,
      onChange: (value, holdTypeValue, holdTypeName, field) => {
        onChangeData(value, holdTypeValue, holdTypeName, field);
      },
      holdValue,
    }),
    width: 120,
    cellStyle: {
      textAlign: 'center',
      overflow: 'visible',
    },
    headerClass: 'right-border-full',
    suppressMovable: true,
    sortable: false,
    resizable: false,
  },
  {
    headerName: 'Value',
    field: 'value',
    cellRenderer: InputRenderer,
    cellRendererParams: () => ({
      placeholder: '',
      inline: true,
      onChange: (value, holdTypeValue, holdTypeName, field) => {
        onChangeData(value, holdTypeValue, holdTypeName, field);
      },
      holdValue,
    }),
    width: 120,
    cellStyle: {
      textAlign: 'center',
      overflow: 'visible',
    },
    headerClass: 'right-border-full',
    suppressMovable: true,
    sortable: false,
    resizable: false,
  },
];

export const attachmentsColDefs = [
  {
    headerName: 'Title',
    field: 'FileOriginalFilename',
    editable: true,
    cellRenderer: DefaultTextRenderer,
    width: 150,
  },
  {
    headerName: 'Date Uploaded',
    field: 'FileUploadedDateTime',
    cellRenderer: DefaultTextRenderer,
    cellRendererParams: function (params) {
      const updDate = new Date(params.data.FileUploadedDateTime);
      return {
        value: formatInputDate(updDate) + ' ' + getTimeFromDateAndTime(updDate),
      };
    },
    width: 100,
  },
  {
    headerName: 'View',
    field: 'ViewBtn',
    cellRenderer: ButtonRenderer,
    cellRendererParams: {
      buttonText: 'View',
    },
    width: 100,
  },
  {
    headerName: '',
    field: 'icons',
    cellRenderer: IconRowRenderer,
    cellRendererParams: {
      iconList: [
        {
          name: 'delete',
        },
      ],
    },
    width: 80,
    resizable: false,
  },
];
