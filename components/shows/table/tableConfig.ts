import DefaultCellRenderer from 'components/bookings/table/DefaultCellRenderer';
import ButtonRenderer from 'components/core-ui-lib/Table/renderers/ButtonRenderer';
import ShowsTextInputRenderer from 'components/shows/table/ShowsTextInputRenderer';
import TableCheckboxRenderer from './TableCheckboxRenderer';
import CustomDateCell from './CustomDateCell';
import ShowNameAndCodeRenderer from './ShowNameAndCodeRenderer';
import CustomSelectCell from './CustomSelectCell';
import { REGIONS_LIST, SALES_FIG_OPTIONS } from '../constants';

export const tableConfig = [
  {
    headerName: 'Show Name',
    field: 'Name',
    cellRenderer: ShowsTextInputRenderer,
    cellRendererParams: {
      placeholder: 'Please enter Show Name',
    },
    headerClass: 'text-center',
    width: 396,
    flex: 1,
  },
  {
    headerName: 'Show Code',
    field: 'Code',
    cellRendererParams: {
      placeholder: 'Please enter Show Code',
    },
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
    headerClass: 'justify-center font-bold text-base ',
    field: 'Name',
    cellRenderer: ShowNameAndCodeRenderer,
    cellStyle: {
      paddingRight: '0.75em',
      paddingLeft: '0.75em',
    },
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
    headerClass: 'justify-center font-bold text-base ',
    marryChildren: true,
    children: [
      {
        headerName: 'Start',
        field: 'DateBlock',
        cellRendererParams: {
          internalField: 'StartDate',
          fieldIndex: 1,
        },
        cellRenderer: CustomDateCell,
        suppressMovable: true,
        headerClass: 'border-r-[1px] border-white text-center',
        width: 80,
        resizable: false,
        sortable: false,
      },
      {
        headerName: 'End',
        field: 'DateBlock',
        cellRendererParams: {
          internalField: 'EndDate',
          fieldIndex: 1,
        },
        cellRenderer: CustomDateCell,
        suppressMovable: true,
        headerClass: 'border-r-[1px] border-white text-center',
        width: 80,
        resizable: false,
        sortable: false,
      },
    ],
  },
  {
    headerName: 'Production Dates',
    headerClass: 'justify-center font-bold text-base ',
    marryChildren: true,
    cellStyle: {
      paddingRight: '0.75em',
      paddingLeft: '0.75em',
    },
    children: [
      {
        headerName: 'Start',
        field: 'DateBlock',
        cellRendererParams: {
          internalField: 'StartDate',
          fieldIndex: 0,
        },
        cellRenderer: CustomDateCell,
        suppressMovable: true,
        headerClass: 'border-r-[1px] border-white text-center',
        width: 80,
        resizable: false,
        sortable: false,
      },
      {
        headerName: 'End',
        field: 'DateBlock',
        cellRendererParams: {
          internalField: 'EndDate',
          fieldIndex: 0,
        },
        cellRenderer: CustomDateCell,
        suppressMovable: true,
        headerClass: 'border-r-[1px] border-white text-center',
        width: 80,
        resizable: false,
        sortable: false,
      },
    ],
  },
  {
    headerName: 'Production Image',
    field: 'IsArchived',
    width: 120,
    cellRenderer: ButtonRenderer,
    cellRendererParams: {
      buttonText: 'Upload',
    },
    cellStyle: {
      paddingRight: '0.75em',
      paddingLeft: '0.75em',
    },
    headerClass: 'text-center',
  },
  {
    headerName: 'Region',
    field: 'EditId',
    cellRenderer: CustomSelectCell,
    cellRendererParams: {
      options: REGIONS_LIST,
      placeholder: 'Select Region(s)',
      isMulti: true,
    },
    cellStyle: {
      overflow: 'visible',
    },
    width: 170,
    headerClass: 'text-center',
  },
  {
    headerName: 'Email Address for Sales Figures',
    field: '',
    cellRendererParams: {
      placeholder: 'Enter email address',
    },
    width: 172,
    cellRenderer: ShowsTextInputRenderer,
    headerClass: 'text-center',
  },
  {
    headerName: 'Input Freq of Sales Figs',
    field: 'Id',
    width: 150,
    cellRenderer: CustomSelectCell,
    cellRendererParams: {
      options: SALES_FIG_OPTIONS,
    },
    cellStyle: {
      overflow: 'visible',
    },
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
    headerName: '',
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
    field: 'deleteId',
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
