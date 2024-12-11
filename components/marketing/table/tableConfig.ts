import CheckboxRenderer from 'components/core-ui-lib/Table/renderers/CheckboxRenderer';
import DefaultCellRenderer from 'components/core-ui-lib/Table/renderers/DefaultCellRenderer';
import DefaultTextRenderer from 'components/core-ui-lib/Table/renderers/DefaultTextRenderer';
import IconRowRenderer from 'components/global/salesTable/renderers/IconRowRenderer';
import { tileColors } from 'config/global';
import { dateTimeToTime, formatDate } from 'services/dateService';
import formatInputDate from 'utils/dateInputFormat';
import TwoLineRenderer from './TwoLineRenderer';
import ButtonRenderer from 'components/core-ui-lib/Table/renderers/ButtonRenderer';
import SalesValueInputRenderer from './SalesValueInputRenderer';
import { isNullOrEmpty } from 'utils';
import SelectRenderer from 'components/core-ui-lib/Table/renderers/SelectRenderer';
import { isValid } from 'date-fns';

export const styleProps = { headerColor: tileColors.marketing };

export const activityColDefs = (
  updateActivity: (type: string, data: any) => void,
  currencySymbol: string,
  editPermission: boolean,
  deletePermission: boolean,
) => [
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
      return params.data.actDate ? formatInputDate(params.data.actDate) : '';
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
      return currencySymbol + params.data.companyCost.toFixed(2);
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
      return currencySymbol + params.data.venueCost.toFixed(2);
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
    width: 320,
  },
  {
    headerName: 'Due By Date',
    field: 'followUpDt',
    cellRenderer: function (params) {
      return isValidDate(params.data.followUpDt) ? formatInputDate(params.data.followUpDt) : '';
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
          table: 'activity',
          onClick: () => (editPermission ? updateActivity('edit', params.data) : null),
          color: editPermission ? '#617293' : '#ddd',
        },
        {
          name: 'delete',
          table: 'activity',
          onClick: () => (deletePermission ? updateActivity('delete', params.data) : null),
          color: deletePermission ? '#617293' : '#ddd',
        },
      ],
    }),
    width: 90,
    resizable: false,
  },
];

export const contactNoteColDefs = (updateContactNote, userList) => [
  {
    headerName: 'Person Contacted',
    field: 'CoContactName',
    cellRenderer: DefaultCellRenderer,
    width: 300,
  },
  {
    headerName: 'Date',
    field: 'ContactDate',
    cellRenderer: function (params) {
      return params.data.ContactDate ? formatInputDate(params.data.ContactDate) : '';
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
      return dateTimeToTime(params.data.ContactDate);
    },
    cellStyle: {
      paddingLeft: '8px',
      paddingRight: '8px',
    },
    width: 70,
  },
  {
    headerName: 'Actioned By',
    field: 'UserId',
    cellRenderer: function (params) {
      if (params.data.ActionAccUserId === null) {
        return '';
      } else {
        const actByName = userList.find((user) => user.value === parseInt(params.data.ActionAccUserId)).text;
        return actByName;
      }
    },
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
          table: 'contactnotes',
          onClick: () => updateContactNote('edit', params.data),
        },
        {
          name: 'delete',
          table: 'contactnotes',
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
    headerName: 'Id',
    field: 'Id',
    cellRenderer: DefaultCellRenderer,
    width: 95,
    hide: true,
  },
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
    cellStyle: {
      marginLeft: '4px',
    },
    wrapText: true,
    width: 200,
  },
  {
    headerName: 'Arranged by',
    field: 'ArrangedByAccUserId',
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
    field: 'OriginalFilename',
    editable: true,
    cellRenderer: DefaultTextRenderer,
    width: 600,
  },
  {
    headerName: 'Date Uploaded',
    field: 'FileUploadedDateTime',
    cellRenderer: DefaultTextRenderer,
    cellRendererParams: function (params) {
      const updDate = params.data.UploadDateTime;
      return {
        value: formatDate(updDate, 'dd/MM/yy') + ' ' + dateTimeToTime(updDate),
      };
    },
    width: 150,
  },
  {
    headerName: 'Date File Created',
    field: 'FileDateTime',
    cellRenderer: DefaultTextRenderer,
    cellRendererParams: function (params) {
      const fileDt = params.data.UploadDateTime;
      return {
        value: formatDate(fileDt, 'dd/MM/yy') + ' ' + dateTimeToTime(fileDt),
      };
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

export const salesEntryColDefs = (type: string, currency: string, handleUpdate) => {
  const colDefs = [
    {
      headerName: 'Type ID',
      field: 'id',
      cellRenderer: DefaultTextRenderer,
      hide: true,
    },
    {
      headerName: type,
      field: 'name',
      cellRenderer: DefaultTextRenderer,
      width: 185,
      cellStyle: {},
      resizable: true,
    },
    {
      headerName: 'Seats',
      field: 'seats',
      cellRenderer: SalesValueInputRenderer,
      cellRendererParams: function (params) {
        return {
          value: isNullOrEmpty(params.data.seats) ? '0' : params.data.seats.toString(),
          className: 'w-[100px] ml-1 mt-1',
          onUpdate: (value) => {
            handleUpdate(value, params.data, type, 'seats');
          },
          currency: '',
        };
      },
      width: 112,
      cellStyle: {},
      resizable: type === 'Holds',
    },
  ];

  if (type === 'Holds') {
    colDefs.push({
      headerName: 'Value',
      field: 'value',
      cellRenderer: SalesValueInputRenderer,
      cellRendererParams: function (params) {
        return {
          value: isNullOrEmpty(params.data.value) ? '0' : params.data.value.toString(),
          className: 'w-[90px] ml-1',
          onUpdate: (value) => handleUpdate(value, params.data, type, 'value'),
          currency,
        };
      },
      cellStyle: {
        marginLeft: '4px',
      },
      width: 120,
      resizable: false,
    });
  }

  return colDefs;
};

export const updateWarningColDefs = (type) => {
  const colDefs = [];

  colDefs.push(
    {
      headerName: 'Date',
      field: 'date',
      cellRenderer: DefaultTextRenderer,
      cellRendererParams: (params) => {
        return {
          value: formatInputDate(params.data.date),
        };
      },
      width: 185,
    },
    {
      headerName: 'Seats',
      field: 'seats',
      cellRenderer: DefaultTextRenderer,
      width: 185,
      resizable: type !== 'Hold',
    },
  );

  if (type === 'Hold') {
    colDefs.push({
      headerName: 'Value',
      field: 'value',
      cellRenderer: DefaultTextRenderer,
      width: 185,
      resizable: false,
    });
  }

  return colDefs;
};

export const globalActivityColDefs = (
  updateActivity: (type: string, data: any) => void,
  currencySymbol: string,
  editPermission: boolean,
  deletePermission: boolean,
) => [
  {
    headerName: 'Id',
    field: 'id',
    cellRenderer: DefaultCellRenderer,
    width: 95,
    hide: true,
  },
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
    cellRenderer: (params) => {
      return isValid(params.data.actDate) ? formatInputDate(params.data.actDate) : '';
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
    headerName: 'Cost',
    field: 'cost',
    cellRenderer: (params) => {
      return `${currencySymbol || ''}${params.data.cost ? params.data.cost.toFixed(2) : '0.00'}`;
    },
    cellStyle: {
      paddingLeft: '8px',
      paddingRight: '8px',
    },
    width: 100,
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
    width: 420,
  },
  {
    headerName: 'Due By Date',
    field: 'followUpDt',
    cellRenderer: (params) => {
      return isValid(params.data.followUpDt) ? formatInputDate(params.data.followUpDt) : ' ';
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
          table: 'activity',
          onClick: () => (editPermission ? updateActivity('edit', params.data) : null),
          color: editPermission ? '#617293' : '#ddd',
        },
        {
          name: 'delete',
          table: 'activity',
          onClick: () => (deletePermission ? updateActivity('delete', params.data) : null),
          color: deletePermission ? '#617293' : '#ddd',
        },
      ],
    }),
    width: 20,
    resizable: false,
  },
];

export const globalModalVenueColDefs = (weekList, selectVenue, selectMultiVenue, variant) => {
  const colDefs = [];

  colDefs.push(
    {
      headerName: '',
      field: 'checked',
      cellRenderer: CheckboxRenderer,
      cellRendererParams: (params) => {
        return {
          onChange: (checked) => selectVenue(params.data, checked),
          checked: params.data.selected,
          disabled: variant === 'view',
        };
      },
      width: 50,
      resizable: false,
      cellStyle: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '1rem',
      },
      sortable: false,
    },
    {
      headerName: 'Venue',
      field: 'Name',
      cellRenderer: DefaultTextRenderer,
      cellRendererParams: {
        truncate: false,
      },
      cellStyle: {
        marginTop: '5px',
      },
      width: 285,
      resizable: false,
      sortable: false,
    },
  );

  if (variant !== 'view') {
    colDefs.push({
      headerName: '',
      field: 'select',
      cellRenderer: SelectRenderer,
      cellRendererParams: function (params) {
        return {
          options: weekList,
          hidden: params.node.rowIndex !== 0,
          onChange: (value) => selectMultiVenue(value),
        };
      },
      width: 100,
      resizable: false,
      cellStyle: {
        textAlign: 'center',
        overflow: 'visible',
      },
      sortable: false,
    });
  }

  return colDefs;
};

export const globalActivityTabColDefs = (
  showGlobalActivity: (data: any) => void,
  currencySymbol: string,
  accessInfoPermission: boolean,
) => [
  {
    headerName: 'Activity Name',
    field: 'actName',
    cellRenderer: DefaultCellRenderer,
    width: 230,
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
      return isValid(params.data.actDate) ? formatInputDate(params.data.actDate) : '';
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
    width: 100,
    cellStyle: {
      display: 'flex',
      justifyContent: 'center',
      paddingTop: '1rem',
    },
  },
  {
    headerName: 'Cost',
    field: 'cost',
    cellRenderer: (params) => {
      return currencySymbol + params.data.cost.toFixed(2);
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
    width: 400,
  },
  {
    headerName: '',
    field: 'icons',
    cellRenderer: IconRowRenderer,
    cellRendererParams: (params) => ({
      iconList: [
        {
          name: 'info-circle-solid',
          onClick: () => (accessInfoPermission ? showGlobalActivity(params.data) : null),
          color: accessInfoPermission ? '#617293' : '#ddd',
        },
      ],
    }),
    width: 50,
    resizable: false,
  },
];

export const loadSalesHistoryColDefs = [
  {
    headerName: 'Upload Name',
    field: 'name',
    cellRenderer: DefaultTextRenderer,
    flex: 1,
  },
  {
    headerName: 'Date Uploaded',
    field: 'dateUploaded',
    cellRenderer: DefaultTextRenderer,
    flex: 1,
  },
  {
    headerName: 'Issues Flagged / Approved',
    field: 'UploadMessage',
    cellRenderer: DefaultTextRenderer,
    flex: 1,
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
