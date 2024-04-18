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
    width: 133,
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
    field: 'EditId',
    cellRenderer: ButtonRenderer,
    cellRendererParams: {
      buttonText: 'Save',
      variant: 'primary',
    },
    cellStyle: {
      paddingLeft: '0.75em',
    },
    resizable: false,
    width: 60,
    headerClass: 'text-center',
  },
  {
    headerName: '',
    field: 'Id',
    width: 70,
    cellRenderer: ButtonRenderer,
    cellRendererParams: {
      buttonText: 'Delete',
      variant: 'tertiary',
    },
    cellStyle: {
      paddingRight: '0.5em',
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
        field: 'DateBlock[1].StartDate',
        // cellRendererParams: {
        //   internalField: 'StartDate',
        //   fieldIndex: 1,
        // },
        cellStyle: {
          paddingRight: '0.1em',
          paddingLeft: '0.1em',
          overflow: 'visible',
        },
        cellRenderer: CustomDateCell,
        suppressMovable: true,
        headerClass: 'border-r-[1px] border-white text-center',
        width: 120,
        resizable: false,
        sortable: false,
      },
      {
        headerName: 'End',
        field: 'DateBlock[1].EndDate',
        // cellRendererParams: {
        //   internalField: 'EndDate',
        //   fieldIndex: 1,
        // },
        cellStyle: {
          paddingRight: '0.1em',
          paddingLeft: '0.1em',
          overflow: 'visible',
        },
        cellRenderer: CustomDateCell,
        suppressMovable: true,
        headerClass: 'border-r-[1px] border-white text-center',
        width: 120,
        resizable: false,
        sortable: false,
      },
    ],
  },
  {
    headerName: 'Production Dates',
    headerClass: 'justify-center font-bold text-base ',
    marryChildren: true,
    children: [
      {
        headerName: 'Start',
        field: 'DateBlock[0].StartDate',
        // cellRendererParams: {
        //   internalField: 'StartDate',
        //   fieldIndex: 0,
        // },
        cellStyle: {
          paddingRight: '0.1em',
          overflow: 'visible',
          paddingLeft: '0.1em',
        },
        cellRenderer: CustomDateCell,
        suppressMovable: true,
        headerClass: 'border-r-[1px] border-white text-center',
        width: 120,
        resizable: false,
        sortable: false,
      },
      {
        headerName: 'End',
        field: 'DateBlock[0].EndDate',
        // cellRendererParams: {
        //   internalField: 'EndDate',
        //   fieldIndex: 0,
        // },
        width: 120,
        cellStyle: {
          paddingRight: '0.1em',
          paddingLeft: '0.1em',
          overflow: 'visible',
        },
        cellRenderer: CustomDateCell,
        suppressMovable: true,
        headerClass: 'border-r-[1px] border-white text-center',
        resizable: false,
        sortable: false,
      },
    ],
  },
  {
    headerName: 'Production Image',
    field: 'IsArchived',
    width: 80,
    cellRenderer: ButtonRenderer,
    cellRendererParams: {
      buttonText: 'Upload',
    },
    headerClass: 'text-center',
  },
  {
    headerName: 'Region',
    field: 'regionId',
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
    field: 'salesEmail',
    cellRendererParams: {
      placeholder: 'Enter email address',
    },
    width: 172,
    cellRenderer: ShowsTextInputRenderer,
    headerClass: 'text-center',
  },
  {
    headerName: 'Input Freq of Sales Figs',
    field: 'salesFrequency',
    width: 120,
    cellRenderer: CustomSelectCell,
    cellRendererParams: {
      options: SALES_FIG_OPTIONS,
      defaultValue: 'W',
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
      width: 80,
    },
    width: 70,
    headerClass: 'text-center',
  },
  {
    headerName: '',
    field: 'deleteId',
    width: 70,
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
