import DefaultTextRenderer from '../../core-ui-lib/Table/renderers/DefaultTextRenderer';
import { tileColors } from 'config/global';
export const styleProps = { headerColor: tileColors.systemAdmin };

export const productionCompaniesColDefs = [
  {
    headerName: 'Company name',
    field: 'Name',
    editable: false,
    cellRenderer: DefaultTextRenderer,
    width: 400,
  },
  {
    headerName: 'Company Website',
    field: 'WebSite',
    cellRenderer: DefaultTextRenderer,
    width: 400,
  },
  {
    headerName: 'Company Logo',
    field: 'Logo',
    cellRenderer: function (params) {
      return params.data.logo || 'Image';
    },
    width: 200,
  },
];
