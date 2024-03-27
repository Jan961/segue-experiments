import DefaultCellRenderer from 'components/bookings/table/DefaultCellRenderer';
import ButtonRenderer from 'components/core-ui-lib/Table/renderers/ButtonRenderer';
import ShowsTextInputRenderer from 'components/shows/table/ShowsTextInputRenderer';
import TableCheckboxRenderer from './TableCheckboxRenderer';
import { MultiColumnHeader } from './MultiColumnHeader';
import DateColumnRenderer from 'components/bookings/table/DateColumnRenderer';

export const tableConfig = [
  {
    headerName: 'Show Name',
    field: 'Name',
    cellRenderer: ShowsTextInputRenderer,
    headerClass: 'text-center',
    width: 396,
    flex: 1,
  },
  {
    headerName: 'Show Code',
    field: 'Code',
    cellRenderer: ShowsTextInputRenderer,
    width: 130,
    headerClass: 'text-center',
  },
  {
    headerName: 'Company',
    field: '',
    cellRenderer: DefaultCellRenderer,
    width: 270,
    headerClass: 'text-center',
  },
  {
    headerName: 'Productions',
    field: 'productions',
    cellRenderer: ButtonRenderer,
    cellRendererParams: {
      buttonText: 'View/Edit',
    },
    cellStyle: {
      paddingRight: '0.75em',
      paddingLeft: '0.75em',
    },
    width: 143,
    headerClass: 'text-center',
  },
  {
    headerName: 'Archive',
    field: 'IsArchived',
    width: 92,
    maxWidth: 92,
    cellRenderer: TableCheckboxRenderer,
    cellStyle: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerClass: 'text-center',
  },
  {
    headerName: 'Save / Delete',
    field: 'editId',
    cellRenderer: ButtonRenderer,
    cellRendererParams: {
      buttonText: 'Save',
      variant: 'primary',
    },
    resizable: false,
    cellStyle: {
      paddingLeft: '0.5em',
      width: 80,
    },
    width: 90,
    headerClass: 'text-center',
  },
  {
    headerName: '',
    field: 'Id',
    width: 80,
    cellRenderer: ButtonRenderer,
    cellRendererParams: {
      buttonText: 'Delete',
      variant: 'tertiary',
      width: 80,
    },
    resizable: false,
    headerClass: 'text-center',
  },
];

export const productionsTableConfig = [
  {
    headerName: 'Show',
    field: 'Name',
    cellRenderer: DefaultCellRenderer,
    headerClass: 'text-center',
    width: 265,
    flex: 1,
  },
  {
    headerName: 'Prod Code',
    field: 'Code',
    cellRenderer: ShowsTextInputRenderer,
    width: 72,
    headerClass: 'text-center',
  },
  {
    headerName: 'Rehearsals',
    children: [
      { headerName: 'Start', field: 'DateBlock[1].StartDate', cellRenderer: DateColumnRenderer, width: 80, height: 20 },
      { headerName: 'End', field: 'DateBlock[1].EndDate', cellRenderer: DateColumnRenderer, width: 80, height: 20 },
    ],
    height: 30,
    headerClass: 'text-center',
    headerComponentFramework: MultiColumnHeader,
  },
  {
    headerName: 'Production Dates',
    children: [
      { headerName: 'Start', field: 'DateBlock[0].StartDate', cellRenderer: DateColumnRenderer, width: 80, height: 20 },
      { headerName: 'End', field: 'DateBlock[0].EndDate', cellRenderer: DateColumnRenderer, width: 80, height: 20 },
    ],
    headerClass: 'text-center',
  },
  {
    headerName: 'Production Image',
    field: 'IsArchived',
    width: 120,
    cellRenderer: ButtonRenderer,
    cellRendererParams: {
      buttonText: 'Upload',
    },
    headerClass: 'text-center',
  },
  {
    headerName: 'Region',
    field: 'EditId',
    cellRenderer: DefaultCellRenderer,
    width: 170,
    headerClass: 'text-center',
  },
  {
    headerName: 'Email Address for Sales Figures',
    field: 'Id',
    width: 172,
    cellRenderer: DefaultCellRenderer,
    headerClass: 'text-center',
  },
  {
    headerName: 'Input Freq of Sales Figs',
    field: 'Id',
    width: 150,
    cellRenderer: DefaultCellRenderer,
    headerClass: 'text-center',
  },
  {
    headerName: 'Archive',
    field: 'IsArchived',
    width: 92,
    maxWidth: 92,
    cellRenderer: TableCheckboxRenderer,
    cellStyle: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerClass: 'text-center',
  },
  {
    headerName: 'Save / Delete',
    cellRenderer: ButtonRenderer,
    resizable: false,
    headerClass: 'text-center',
    children: [
      {
        headerName: '',
        field: 'EditId',
        cellRenderer: ButtonRenderer,
        cellRendererParams: {
          buttonText: 'Save',
          variant: 'primary',
        },
        width: 80,
        height: 20,
        suppressColumnsToolPanel: true,
        resizable: false,
      },
      {
        headerName: '',
        field: 'Id',
        cellRenderer: ButtonRenderer,
        cellRendererParams: {
          buttonText: 'Delete',
          variant: 'tertiary',
        },
        width: 80,
        height: 20,
        suppressColumnsToolPanel: true,
        resizable: false,
      },
    ],
  },
];
