import DefaultTextRenderer from '../../core-ui-lib/Table/renderers/DefaultTextRenderer';
import { tileColors } from 'config/global';
import IconRenderer from '../../bookings/table/IconRenderer';
export const styleProps = { headerColor: tileColors.systemAdmin };

export const productionCompaniesColDefs = [
  {
    headerName: 'Company name',
    field: 'Name',
    editable: true,
    cellRenderer: DefaultTextRenderer,

    width: 400,
  },
  {
    headerName: 'Company Website',
    field: 'WebSite',
    cellRenderer: DefaultTextRenderer,
    // width was 400 but changed for the delete icon
    width: 350,
    editable: true,
  },
  {
    headerName: 'Company Logo',
    field: 'Logo',
    cellRenderer: function (params) {
      return params.data.logo || 'Image';
    },
    width: 200,
  },
  {
    headerName: '',
    field: 'delete',
    cellRenderer: IconRenderer,
    cellRendererParams: {
      iconName: 'delete',
      tooltipPosition: 'left',
      popover: true,
    },
  },
];
