import DefaultCellRenderer from 'components/bookings/table/DefaultCellRenderer';
import ButtonRenderer from 'components/core-ui-lib/Table/renderers/ButtonRenderer';
import ShowsTextInputRenderer from 'components/shows/table/ShowsTextInputRenderer';
import TableCheckboxRenderer from './TableCheckboxRenderer';
import CustomDateCell from './CustomDateCellRenderer';
import ShowNameAndCodeRenderer from './ShowNameAndCodeRenderer';
import CustomSelectCell from './CustomSelectCellRenderer';
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
    headerTooltip:
      'This is the name of your Theatre Show e.g. “Touring Show”. A “Show” can have multiple “productions”, you can give a specific “production” a reference in the Production Section.',
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
    headerTooltip:
      'The Show Code should be unique to this particular Show and should be a recognisable abbreviation for example Touring Show may be ‘TOUR’. This will be used in combination with the production code, eg Touring Show touring the UK in 2025 could be ‘TOURUK25’',
  },
  {
    headerName: 'Company',
    field: '',
    cellRenderer: DefaultCellRenderer,
    width: 270,
    headerClass: 'text-center',
    headerTooltip: 'Please select the Company Name or “Special Purpose Vehicle” that is presenting this production.',
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
    headerTooltip:
      'Access to view and edit all Productions of this particular Show. e.g. Touring Show UK Tour 2025; Touring Show USA Tour 2022',
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
    headerTooltip: 'Only when all activity (including “settlements”) is complete, select tick box to archive Show.',
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
    headerGroupComponent: 'AGGridHeaderGroupComponent',
    headerClass: 'justify-center font-bold text-base border-r-4',
    marryChildren: true,
    children: [
      {
        headerName: 'Start',
        field: 'DateBlock[1].StartDate',
        valueGetter: function (params) {
          return params.data?.DateBlock ? params.data?.DateBlock[1]?.StartDate : null;
        },
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
        valueGetter: function (params) {
          return params.data?.DateBlock ? params.data?.DateBlock[1]?.EndDate : null;
        },
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
    headerGroupComponent: 'AGGridHeaderGroupComponent',
    headerClass: 'justify-center font-bold text-base border-r-4',
    marryChildren: true,
    children: [
      {
        headerName: 'Start',
        field: 'DateBlock[0].StartDate',
        valueGetter: function (params) {
          return params.data?.DateBlock ? params.data?.DateBlock[0]?.StartDate : null;
        },
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
        valueGetter: function (params) {
          return params.data?.DateBlock ? params.data?.DateBlock[0]?.EndDate : null;
        },
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
    field: 'RegionList',
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
    field: 'SalesEmail',
    cellRendererParams: {
      placeholder: 'Enter email address',
    },
    width: 172,
    cellRenderer: ShowsTextInputRenderer,
    headerClass: 'text-center',
  },
  {
    headerName: 'Input Freq of Sales Figs',
    field: 'SalesFrequency',
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
