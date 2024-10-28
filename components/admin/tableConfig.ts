import DefaultTextRenderer from '../core-ui-lib/Table/renderers/DefaultTextRenderer';
import { tileColors } from 'config/global';
import IconRenderer from '../bookings/table/IconRenderer';
import { UploadLogoRenderer } from './renderers/UploadLogoRenderer';
import IconRowRenderer from 'components/global/salesTable/renderers/IconRowRenderer';
export const styleProps = { headerColor: tileColors.systemAdmin };

const createUploadLogoRenderer = (fetchProductionCompanies, onUploadSucess) => {
  return (params) => UploadLogoRenderer(params, fetchProductionCompanies, onUploadSucess);
};

export const productionCompaniesColDefs = (fetchProductionCompanies, onUploadSucess) => {
  return [
    {
      headerName: 'Company Name',
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
      cellRendererParams: (params) => ({
        value: 'Delete',
        iconProps: {
          iconName: 'delete',
          fill: '#617293',
          disabled: params.data?.id && params.data?.hasProductions,
        },
        tooltipPosition: 'right',
        popover: true,
      }),
      width: 40,
      resizable: false,
    },
  ];
};

export const usersColDef = (updateUser, permissions) => {
  return [
    {
      headerName: 'Name',
      field: 'name',
      cellRenderer: DefaultTextRenderer,
      width: 400,
    },
    {
      headerName: 'Email',
      field: 'email',
      cellRenderer: DefaultTextRenderer,
      flex: 1,
    },
    {
      headerName: 'User Permissions Summary',
      field: 'permissionDesc',
      cellRenderer: DefaultTextRenderer,
      flex: 1,
    },
    {
      headerName: 'Type of Licence',
      field: 'licence',
      cellRenderer: DefaultTextRenderer,
      flex: 1,
    },
    {
      headerName: '',
      field: 'icons',
      cellRenderer: IconRowRenderer,
      cellRendererParams: (params) => ({
        iconList: [
          {
            name: 'edit',
            onClick: () => updateUser('edit', params.data),
            permission: 'EDIT_USER',
          },
          {
            name: 'delete',
            onClick: () => updateUser('delete', params.data),
            permission: 'DELETE_USER',
          },
        ].filter((x) => permissions.includes(x.permission)),
      }),
      width: 90,
      resizable: false,
    },
  ];
};

export const permissionGroupColDef = (updateGroup, permissions = []) => {
  return [
    {
      headerName: 'Name of Permission Group',
      field: 'groupName',
      cellRenderer: DefaultTextRenderer,
      width: 600,
    },
    {
      headerName: '',
      field: 'icons',
      cellRenderer: IconRowRenderer,
      cellRendererParams: (params) => ({
        iconList: [
          {
            name: 'edit',
            onClick: () => updateGroup('edit', params.data),
            permission: 'EDIT_USER_PERMISSION_GROUP',
          },
          {
            name: 'delete',
            onClick: () => updateGroup('delete', params.data),
            permission: 'DELETE_USER_PERMISSION_GROUP',
          },
        ].filter((x) => permissions.includes(x.permission)),
      }),
      width: 90,
      resizable: false,
    },
  ];
};
