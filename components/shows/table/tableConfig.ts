import DefaultCellRenderer from 'components/bookings/table/DefaultCellRenderer';
import ButtonRenderer from 'components/core-ui-lib/Table/renderers/ButtonRenderer';
import ShowsTextInputRenderer from 'components/shows/table/ShowsTextInputRenderer';
import TableCheckboxRenderer from './TableCheckboxRenderer';

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
