import ButtonRenderer from 'components/core-ui-lib/Table/renderers/ButtonRenderer';
import ShowsTextInputRenderer from 'components/shows/table/ShowsTextInputRenderer';
import TableCheckboxRenderer from './TableCheckboxRenderer';
import ShowNameAndCodeRenderer from './ShowNameAndCodeRenderer';
import { ICellRendererParams } from 'ag-grid-community';
import React from 'react';
import CurrencyExchangeRenderer from './CurrencyExchangeRenderer';

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

export const showsTableConfig = [
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
    cellRendererParams: (params) => {
      return {
        ...(params.data.productions.length > 0 &&
        params.data.productions.some((production) => production.IsArchived === false)
          ? {
              disabled: true,
              tpActive: true,
              body: 'Please archive all Productions before archiving a Show',
              position: 'right',
              width: 'w-40',
            }
          : {}),
      };
    },
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
    resizable: false,
    width: 60,
    headerClass: 'text-center',
  },
  {
    headerName: '',
    field: 'Id',
    width: 70,
    cellRenderer: ButtonRenderer,
    cellRendererParams: (params) => {
      return {
        buttonText: 'Delete',
        variant: 'tertiary',
        ...(params.data.productions.length > 0 && {
          disabled: true,
          tpActive: true,
          body: 'Please delete all Productions before deleting a Show',
          position: 'right',
          width: 'w-36',
        }),
      };
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
    headerName: 'Currency',
    headerClass: 'justify-center font-bold text-base ',
    field: 'currency',
    width: 185,
    cellStyle: {
      paddingRight: '0.75em',
      paddingLeft: '0.75em',
    },
  },
  {
    headerName: 'Countries',
    headerClass: 'justify-center font-bold text-base ',
    field: 'countries',
    flex: 1,
    width: 185,
    wrapText: true,
    autoHeight: true,
    cellStyle: {
      paddingRight: '0.75em',
      paddingLeft: '0.75em',
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
      overflow: 'unset',
      textOverflow: 'unset',
    },
  },
  {
    headerName: 'Region',
    headerClass: 'justify-center font-bold text-base ',
    field: 'region',
    flex: 1,
    width: 185,
    cellStyle: {
      paddingRight: '0.75em',
      paddingLeft: '0.75em',
    },
  },
  {
    headerName: 'Exchange rate for Production \n (Production Currency : Venue Currency)',
    headerClass: 'justify-center font-bold text-base ',
    field: 'rate',
    cellRenderer: CurrencyExchangeRenderer,
    width: 300,
    autoHeaderHeight: true,
    resizable: false,
    cellStyle: {
      paddingRight: '0.75em',
      paddingLeft: '0.75em',
      display: 'flex',
      justifyContent: 'center',
    },
  },
];

export const productionsTableConfig = [
  {
    headerName: 'Production',
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
    cellRendererParams: {
      disabled: true,
    },
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
    field: 'updateCurrencyConversion',
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
  {
    headerName: '',
    field: 'delete',
    width: 70,
    cellRenderer: ButtonRenderer,
    cellRendererParams: (params) => ({
      buttonText: 'Delete',
      variant: 'tertiary',
      ...(!params.data.IsArchived && {
        disabled: true,
        tpActive: true,
        body: 'Please archive the production prior to deleting',
        position: 'right',
        width: 'w-36',
      }),
    }),
    cellStyle: {
      paddingRight: '0.5em',
    },
    resizable: false,
    headerClass: 'text-center',
  },
];
