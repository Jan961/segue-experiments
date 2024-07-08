import DefaultTextRenderer from '../core-ui-lib/Table/renderers/DefaultTextRenderer';
import { tileColors } from 'config/global';
import IconRenderer from '../bookings/table/IconRenderer';
import { UploadLogoRenderer } from './renderers/UploadLogoRenderer';
export const styleProps = { headerColor: tileColors.systemAdmin };

const createUploadLogoRenderer = (fetchProductionCompanies, onUploadSucess) => {
  return (params) => UploadLogoRenderer(params, fetchProductionCompanies, onUploadSucess);
};

export const productionCompaniesColDefs = (fetchProductionCompanies, onUploadSucess) => {
  return [
    {
      headerName: 'Company name',
      field: 'companyName',
      editable: true,
      cellRenderer: DefaultTextRenderer,

      width: 400,
    },
    {
      headerName: 'Company Website',
      field: 'webSite',
      cellRenderer: DefaultTextRenderer,
      flex: 1,
      editable: true,
    },
    {
      headerName: 'Company VAT No.',
      field: 'companyVATNo',
      cellRenderer: DefaultTextRenderer,
      width: 230,
      editable: true,
    },
    {
      headerName: 'Company Logo',
      field: 'fileLocation',
      cellRenderer: createUploadLogoRenderer(fetchProductionCompanies, onUploadSucess),
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
      width: 40,
    },
  ];
};
