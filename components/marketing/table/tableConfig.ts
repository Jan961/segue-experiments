import CheckboxRenderer from 'components/core-ui-lib/Table/renderers/CheckboxRenderer';
import DefaultCellRenderer from 'components/core-ui-lib/Table/renderers/DefaultCellRenderer';
import DefaultTextRenderer from 'components/core-ui-lib/Table/renderers/DefaultTextRenderer';
import IconRowRenderer from 'components/global/salesTable/renderers/IconRowRenderer';
import { tileColors } from 'config/global';
import { getTimeFromDateAndTime } from 'services/dateService';
import formatInputDate from 'utils/dateInputFormat';
import TwoLineRenderer from './TwoLineRenderer';
import ButtonRenderer from 'components/core-ui-lib/Table/renderers/ButtonRenderer';

export const styleProps = { headerColor: tileColors.marketing };

export const activityColDefs = (updateActivity, venueCurrency) => [
  {
    headerName: 'Activity Name',
    field: 'actName',
    cellRenderer: DefaultCellRenderer,
    width: 188,
  },
  {
    headerName: 'Type',
    field: 'actType',
    cellRenderer: DefaultCellRenderer,
    width: 120,
  },
  {
    headerName: 'Date',
    field: 'actDate',
    cellRenderer: function (params) {
      return formatInputDate(params.data.actDate);
    },
    cellStyle: {
      paddingLeft: '8px',
      paddingRight: '8px',
    },
    width: 90,
  },
  {
    headerName: 'Follow Up Req.',
    field: 'followUpCheck',
    cellRenderer: CheckboxRenderer,
    cellRendererParams: (params) => ({
      onChange: () => null, // no action required, checkbox fixed in table
      checked: params.data.followUpCheck,
    }),
    width: 85,
    cellStyle: {
      display: 'flex',
      justifyContent: 'center',
      paddingTop: '1rem',
    },
  },
  {
    headerName: 'Company Cost',
    field: 'companyCost',
    cellRenderer: (params) => {
      return venueCurrency + (params.data.companyCost > 0 ? parseFloat(params.data.companyCost).toFixed(2) : '0.00');
    },
    cellStyle: {
      paddingLeft: '8px',
      paddingRight: '8px',
    },
    width: 100,
  },
  {
    headerName: 'Venue Cost',
    field: 'venueCost',
    cellRenderer: (params) => {
      return venueCurrency + (params.data.venueCost > 0 ? parseFloat(params.data.venueCost).toFixed(2) : '0.00');
    },
    cellStyle: {
      paddingLeft: '8px',
      paddingRight: '8px',
    },
    width: 90,
  },
  {
    headerName: 'Notes',
    field: 'notes',
    wrapText: true,
    autoHeight: true,
    cellRenderer: DefaultTextRenderer,
    cellRendererParams: {
      truncate: false,
    },
    cellStyle: {
      marginTop: '5px',
    },
    width: 320,
  },
  {
    headerName: 'Due By Date',
    field: 'followUpDt',
    cellRenderer: function (params) {
      return formatInputDate(params.data.followUpDt);
    },
    width: 100,
    hide: true,
  },
  {
    headerName: '',
    field: 'icons',
    cellRenderer: IconRowRenderer,
    cellRendererParams: (params) => ({
      iconList: [
        {
          name: 'edit',
          onClick: () => updateActivity('edit', params.data),
        },
        {
          name: 'delete',
          onClick: () => updateActivity('delete', params.data),
        },
      ],
    }),
    width: 90,
    resizable: false,
  },
];

export const contactNoteColDefs = (updateContactNote) => [
  {
    headerName: 'Who',
    field: 'ToBeAdded - db change',
    cellRenderer: DefaultCellRenderer,
    width: 300,
  },
  {
    headerName: 'Date',
    field: 'ContactDate',
    cellRenderer: function (params) {
      return formatInputDate(params.data.ContactDate);
    },
    cellStyle: {
      paddingLeft: '8px',
      paddingRight: '8px',
    },
    width: 80,
  },
  {
    headerName: 'Time',
    field: 'ContactTime',
    cellRenderer: function (params) {
      return getTimeFromDateAndTime(params.data.ContactDate);
    },
    cellStyle: {
      paddingLeft: '8px',
      paddingRight: '8px',
    },
    width: 70,
  },
  {
    headerName: 'Actioned By',
    field: 'CoContactName',
    cellRenderer: DefaultCellRenderer,
    cellStyle: {
      paddingLeft: '8px',
      paddingRight: '8px',
    },
    width: 120,
  },
  {
    headerName: 'Notes',
    field: 'Notes',
    wrapText: true,
    autoHeight: true,
    cellRenderer: DefaultTextRenderer,
    cellRendererParams: {
      truncate: false,
    },
    cellStyle: {
      marginTop: '5px',
    },
    width: 423,
  },
  {
    headerName: '',
    field: 'icons',
    cellRenderer: IconRowRenderer,
    cellRendererParams: (params) => ({
      iconList: [
        {
          name: 'edit',
          onClick: () => updateContactNote('edit', params.data),
        },
        {
          name: 'delete',
          onClick: () => updateContactNote('delete', params.data),
        },
      ],
    }),
    width: 90,
    resizable: false,
  },
];

export const allocSeatsColDefs = [
  {
    headerName: 'Perf Date',
    field: 'date',
    cellRenderer: DefaultCellRenderer,
    width: 95,
  },
  {
    headerName: 'Perf Time',
    field: 'time',
    cellRenderer: DefaultCellRenderer,
    width: 100,
  },
  {
    headerName: 'Name / Email of Person Receiving Tickets',
    field: 'name_email',
    cellRenderer: TwoLineRenderer,
    cellRendererParams: (params) => {
      return {
        value: params.data.TicketHolderName + '\n' + params.data.TicketHolderEmail,
      };
    },
    wrapText: true,
    autoHeight: true,
    width: 200,
  },
  {
    headerName: 'Arranged by',
    field: 'ArrangedBy',
    cellRenderer: DefaultCellRenderer,
    width: 120,
  },
  {
    headerName: 'Comments',
    field: 'Comments',
    cellRenderer: DefaultTextRenderer,
    width: 150,
  },
  {
    headerName: 'Seats',
    field: 'Seats',
    cellRenderer: DefaultTextRenderer,
    width: 70,
  },
  {
    headerName: 'Allocated',
    field: 'SeatsAllocated',
    cellRenderer: DefaultTextRenderer,
    width: 95,
  },
  {
    headerName: 'Venue Confirmation Notes',
    field: 'VenueConfirmationNotes',
    wrapText: true,
    autoHeight: true,
    cellRenderer: DefaultTextRenderer,
    cellRendererParams: {
      truncate: false,
    },
    width: 235,
    resizable: false,
  },
];

export const attachmentsColDefs = [
  {
    headerName: 'Title',
    field: 'FileOriginalFilename',
    editable: true,
    cellRenderer: DefaultTextRenderer,
    width: 600,
  },
  {
    headerName: 'Date Uploaded',
    field: 'FileUploadedDateTime',
    cellRenderer: function (params) {
      const updDate = new Date(params.data.FileUploadedDateTime);
      return formatInputDate(updDate) + ' ' + getTimeFromDateAndTime(updDate);
    },
    width: 150,
  },
  {
    headerName: 'Date File Created',
    field: 'FileDateTime',
    cellRenderer: function (params) {
      const fileDt = new Date(params.data.FileDateTime);
      return formatInputDate(fileDt) + ' ' + getTimeFromDateAndTime(fileDt);
    },
    width: 150,
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
