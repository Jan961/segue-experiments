import DefaultTextRenderer from '../../core-ui-lib/Table/renderers/DefaultTextRenderer';
import { tileColors } from 'config/global';

export const styleProps = { headerColor: tileColors.systemAdmin };

export const productionCompaniesColDefs = [
  {
    headerName: 'Company name',
    field: 'CompanyName',
    editable: false,
    cellRenderer: DefaultTextRenderer,
    width: 400,
  },
  {
    headerName: 'Company Website',
    field: 'CompanyWebsite',
    cellRenderer: DefaultTextRenderer,
    width: 400,
  },
  {
    headerName: 'Company Logo',
    field: 'CompanyLogo',
    cellRenderer: DefaultTextRenderer,
    width: 200,
  },
];
