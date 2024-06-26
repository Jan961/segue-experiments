import DefaultTextRenderer from '../core-ui-lib/Table/renderers/DefaultTextRenderer';
import { tileColors } from 'config/global';
import IconRenderer from '../bookings/table/IconRenderer';
import { UploadLogoRenderer } from './renderers/UploadLogoRenderer';
export const styleProps = { headerColor: tileColors.systemAdmin };

const createUploadLogoRenderer = (fetchProductionCompanies) => {
  return (params) => UploadLogoRenderer(params, fetchProductionCompanies);
};
export const productionCompaniesColDefs = (fetchProductionCompanies) => {
  return [
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
      width: 325,
      editable: true,
    },
    {
      headerName: 'Company Logo',
      field: 'Logo',
      cellRenderer: createUploadLogoRenderer(fetchProductionCompanies),
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
      flex: 1,
    },
  ];
};
