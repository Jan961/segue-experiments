import DefaultTextRenderer from '../../core-ui-lib/Table/renderers/DefaultTextRenderer';
export const productionCompaniesColDefs = [
  {
    headerName: 'Company name',
    field: 'CompanyName',
    editable: false,
    cellRenderer: DefaultTextRenderer,
    width: 600,
  },
  {
    headerName: 'Company Website',
    field: 'CompanyWebsite',
    cellRenderer: DefaultTextRenderer,
    width: 600,
  },
  {
    headerName: 'Company Logo',
    field: 'CompanyLogo',
    cellRenderer: DefaultTextRenderer,
    width: 200,
  },
];
