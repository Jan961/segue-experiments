import DefaultCellRenderer from '../bookings/table/DefaultCellRenderer';
import VenueColumnRenderer from './table/VenueColumnRenderer';
import DateColumnRenderer from './table/DateColumnRenderer';
import { tileColors } from 'config/global';
import DefaultTextRenderer from 'components/core-ui-lib/Table/renderers/DefaultTextRenderer';
import formatInputDate from 'utils/dateInputFormat';
import { compareDatesWithoutTime, dateTimeToTime, newDate } from 'services/dateService';
import ButtonRenderer from 'components/core-ui-lib/Table/renderers/ButtonRenderer';
import IconRowRenderer from 'components/global/salesTable/renderers/IconRowRenderer';
import SelectCellRenderer from 'components/core-ui-lib/Table/renderers/SelectCellRenderer';
import {
  companyContractStatusOptions,
  contractsStatusMap,
  statusToBgColorMap,
  venueContractStatusToStyleMap,
} from 'config/contracts';
import DateRenderer from 'components/core-ui-lib/Table/renderers/DateRenderer';
import NotesRenderer from 'components/core-ui-lib/Table/renderers/NotesRenderer';
import TextInputRenderer from 'components/core-ui-lib/Table/renderers/TextInputRenderer';
import CurrencyInputRenderer from 'components/core-ui-lib/Table/renderers/CurrencyInputRenderer';
import { formatValue } from './utils';
import { ContractPermissionGroup } from 'interfaces';

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
  {
    headerName: 'No. of Perfs',
    cellRenderer: DefaultCellRenderer,
    valueGetter: (params) => {
      return params.data.PerformanceTimes?.filter((x) =>
        compareDatesWithoutTime(x.split('?')[1], params.data.dateTime, '=='),
      ).length;
    },
    width: 90,
  },
  {
    headerName: 'Deal Memo Status',
    field: 'dealMemoStatus',
    cellRenderer: DefaultCellRenderer,
    width: 180,
    valueGetter: (params) => contractsStatusMap[params?.data?.dealMemoStatus],
    cellStyle: function (params) {
      const { dealMemoStatus } = params.data;
      return {
        backgroundColor: 'white',
        ...(venueContractStatusToStyleMap[dealMemoStatus] || {}),
      };
    },
  },
  {
    headerName: 'Contract Status',
    field: 'contractStatus',
    cellRenderer: DefaultCellRenderer,
    resizable: false,
    width: 180,
    valueGetter: (params) => contractsStatusMap[params?.data?.contractStatus],
    cellStyle: function (params) {
      const { contractStatus } = params.data;
      return {
        backgroundColor: 'white',
        ...(venueContractStatusToStyleMap[contractStatus] || {}),
      };
    },
  },
];

export const getCompanyContractsColumnDefs = (
  contractStatusDisable: ContractPermissionGroup,
  pdfDisabled: ContractPermissionGroup,
  editDisabled: ContractPermissionGroup,
  userList = [],
) => [
  {
    headerName: 'First Name',
    field: 'firstName',
    cellRenderer: DefaultCellRenderer,
    flex: 1,
    cellStyle: function (params) {
      const { contractStatus } = params.data;
      return {
        backgroundColor: 'white',
        ...(statusToBgColorMap[contractStatus] || {}),
      };
    },
  },
  {
    headerName: 'Last Name',
    field: 'lastName',
    cellRenderer: DefaultCellRenderer,
    flex: 1,
    cellStyle: function (params) {
      const { contractStatus } = params.data;
      return {
        backgroundColor: 'white',
        ...(statusToBgColorMap[contractStatus] || {}),
      };
    },
  },
  { headerName: 'Role', field: 'role', cellRenderer: DefaultCellRenderer, flex: 1 },
  {
    headerName: 'Contract Status',
    field: 'contractStatus',
    cellRenderer: SelectCellRenderer,
    valueGetter: (params) => params?.data?.contractStatus,
    flex: 1,
    cellRendererParams: (params) => ({
      options: companyContractStatusOptions,
      isSearchable: true,
      disabled:
        (params.data.departmentId === 1 && !contractStatusDisable.artisteContracts) ||
        (params.data.departmentId === 2 && !contractStatusDisable.creativeContracts) ||
        (params.data.departmentId === 3 && !contractStatusDisable.smTechCrewContracts),
    }),
  },
  {
    headerName: '',
    field: 'edit',
    width: 60,
    cellRenderer: ButtonRenderer,
    cellRendererParams: (params) => ({
      buttonText: 'Edit',
      variant: 'primary',
      width: 60,
      disabled:
        (params.data.departmentId === 1 && !editDisabled.artisteContracts) ||
        (params.data.departmentId === 2 && !editDisabled.creativeContracts) ||
        (params.data.departmentId === 3 && !editDisabled.smTechCrewContracts),
    }),
    resizable: false,
    headerClass: 'text-center',
  },
  {
    headerName: '',
    field: 'pdf',
    width: 100,
    cellRenderer: ButtonRenderer,
    cellRendererParams: (params) => ({
      buttonText: 'Save as PDF',
      variant: 'primary',
      width: 90,
      disabled:
        (params.data.departmentId === 1 && !pdfDisabled.artisteContracts) ||
        (params.data.departmentId === 2 && !pdfDisabled.creativeContracts) ||
        (params.data.departmentId === 3 && !pdfDisabled.smTechCrewContracts),
    }),
    cellStyle: {
      paddingRight: '0.5em',
    },
  },
  {
    headerName: 'Completed By',
    field: 'completedBy',
    cellRenderer: SelectCellRenderer,
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
    flex: 1,
    editable: true,
    valueGetter: (params) => params?.data?.checkedBy,
    cellRendererParams: () => ({
      options: userList,
      isSearchable: true,
    }),
  },
  {
    headerName: 'Date Issued',
    field: 'dateIssued',
    cellRenderer: DateRenderer,
    width: 120,
    cellStyle: {
      overflow: 'visible',
    },
  },
  {
    headerName: 'Date Returned',
    field: 'dateReturned',
    cellRenderer: DateRenderer,
    resizable: false,
    width: 120,
    cellStyle: {
      overflow: 'visible',
    },
    cellEditorParams: { popupParent: document.body },
  },
  {
    headerName: '',
    field: 'notes',
    cellRenderer: NotesRenderer,
    headerClass: ['bgOrangeTextWhite'],
    cellRendererParams: {
      tpActive: true,
      activeFillColor: '#D41818',
      strokeColor: '#082B4B',
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

export const seatKillsColDefs = (handleChange, currencySymbol, disabled: boolean) => [
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
    cellRenderer: TextInputRenderer,
    cellRendererParams: (params) => ({
      inline: true,
      onChange: (value) => handleChange(params.data, value, 'seats'),
      className: 'w-[108px] ml-1 mt-1 font-bold',
      value: formatValue(params.data.seats),
      pattern: /^\d*$/,
      disabled,
    }),
    width: 120,
    headerClass: 'right-border-full',
    suppressMovable: true,
    sortable: false,
    resizable: false,
  },
  {
    headerName: 'Value',
    field: 'value',
    cellRenderer: CurrencyInputRenderer,
    cellRendererParams: (params) => ({
      inline: true,
      onChange: (value) => handleChange(params.data, value, 'value'),
      currency: currencySymbol,
      value: formatValue(params.data.value),
      className: 'w-24 font-bold',
      pattern: /^\d*(\.\d*)?$/,
      disabled,
    }),
    width: 120,
    suppressMovable: true,
    sortable: false,
    resizable: false,
  },
];

export const attachmentsColDefs = (exportPdfPermission: boolean) => [
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
      const updDate = newDate(params.data.FileUploadedDateTime);
      return {
        value: formatInputDate(updDate) + ' ' + dateTimeToTime(updDate),
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
      disabled: !exportPdfPermission,
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

export const contractTourScheduleColumns = [
  {
    headerName: 'PROD',
    field: 'productionCode',
    editable: true,
    cellRenderer: DefaultTextRenderer,
    width: 150,
  },
  {
    headerName: 'DAY',
    field: 'day',
    editable: true,
    cellRenderer: DefaultTextRenderer,
    width: 150,
  },
  {
    headerName: 'DATE',
    field: 'date',
    editable: true,
    cellRenderer: DefaultTextRenderer,
    width: 150,
  },
  {
    headerName: 'Week',
    field: 'week',
    editable: true,
    cellRenderer: DefaultTextRenderer,
    width: 150,
  },
  {
    headerName: 'VENUE/DETAILS',
    field: 'venue',
    editable: true,
    cellRenderer: DefaultTextRenderer,
    width: 150,
  },
  {
    headerName: 'TOWN',
    field: 'location',
    editable: true,
    cellRenderer: DefaultTextRenderer,
    width: 150,
  },
  {
    headerName: 'DAY TYPE',
    field: 'type',
    editable: true,
    cellRenderer: DefaultTextRenderer,
    width: 150,
  },
  {
    headerName: 'STATUS',
    field: 'status',
    editable: true,
    cellRenderer: DefaultTextRenderer,
    width: 150,
  },
  {
    headerName: 'CAPACITY',
    field: 'capacity',
    editable: true,
    cellRenderer: DefaultTextRenderer,
    width: 150,
  },
  {
    headerName: 'Performances per day',
    field: 'performancesPerDay',
    editable: true,
    cellRenderer: DefaultTextRenderer,
    width: 150,
  },
  {
    headerName: 'Performance 1 Time',
    field: 'performance1',
    editable: true,
    cellRenderer: DefaultTextRenderer,
    width: 150,
  },
  {
    headerName: 'Performance 2 Time',
    field: 'performance2',
    editable: true,
    cellRenderer: DefaultTextRenderer,
    width: 150,
  },
  {
    headerName: 'MILES',
    field: 'mileage',
    editable: true,
    cellRenderer: DefaultTextRenderer,
    width: 150,
  },
  {
    headerName: 'TIME',
    field: 'time',
    editable: true,
    cellRenderer: DefaultTextRenderer,
    width: 150,
  },
  {
    headerName: '',
    field: 'delete',
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
