import ButtonRenderer from 'components/core-ui-lib/Table/renderers/ButtonRenderer';
import ShowsTextInputRenderer from 'components/shows/table/ShowsTextInputRenderer';
import TableCheckboxRenderer from './TableCheckboxRenderer';
import ShowNameAndCodeRenderer from './ShowNameAndCodeRenderer';
import { ICellRendererParams } from 'ag-grid-community';
import React from 'react';
import SelectCellRenderer from 'components/core-ui-lib/Table/renderers/SelectCellRenderer';
import { SelectOption } from 'components/core-ui-lib/Select/Select';

export const generateChildCol = (
  headerName: string,
  field: string,
  dateBlockIndex,
  startDateField,
  cellRendererParams = {},
  renderer: (params: ICellRendererParams) => React.ReactElement,
) => {
  return {
    headerName,
    field,
    valueGetter: function (params) {
      return params.data?.DateBlock ? params.data?.DateBlock?.[dateBlockIndex]?.[startDateField] : null;
    },
    cellStyle: {
      paddingRight: '0.1em',
      overflow: 'visible',
      paddingLeft: '0.1em',
    },
    headerClass: 'group-header-child',
    cellRenderer: renderer,
    cellRendererParams: { ...cellRendererParams },
    suppressMovable: true,
    width: 120,
    resizable: false,
    sortable: false,
  };
};

export const getShowsTableConfig = (prodCompanyOptions: SelectOption[]) => [
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
    field: 'ShowProdCoId',
    cellRenderer: SelectCellRenderer,
    cellRendererParams: {
      options: prodCompanyOptions,
    },
    cellStyle: {
      overflow: 'visible',
    },
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

export const currencyConversionTableConfig = [
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
      buttonText: 'View/Edit',
    },
    resizable: false,
    width: 133,
    headerClass: 'text-center',
  },
  {
    headerName: '',
    field: 'updateCurrency',
    width: 270,
    cellRenderer: ButtonRenderer,
    cellRendererParams: {
      buttonText: 'SET CURRENCY CONVERSION RATES',
      variant: 'secondary',
      width: 270,
    },
    resizable: false,
    headerClass: 'text-center',
  },
];
