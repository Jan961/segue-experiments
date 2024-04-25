import CheckboxRenderer from 'components/core-ui-lib/Table/renderers/CheckboxRenderer';
import DefaultCellRenderer from 'components/core-ui-lib/Table/renderers/DefaultCellRenderer';
import DefaultTextRenderer from 'components/core-ui-lib/Table/renderers/DefaultTextRenderer';
import IconRowRenderer from 'components/global/salesTable/renderers/IconRowRenderer';
import { tileColors } from 'config/global';

export const styleProps = { headerColor: tileColors.marketing };

export const activityColDefs = (updateActivity, venueCurrency) => [
  {
    headerName: 'Activity Name',
    field: 'actName',
    cellRenderer: DefaultCellRenderer,
    width: 100,
  },
  {
    headerName: 'Type',
    field: 'actType',
    cellRenderer: DefaultCellRenderer,
    width: 120,
  },
  {
    headerName: 'Date',
    field: 'actDate',
    cellRenderer: DefaultCellRenderer,
    width: 90,
  },
  {
    headerName: 'Follow Up Req.',
    field: 'followUpCheck',
    cellRenderer: CheckboxRenderer,
    cellRendererParams: {
      onChange: () => console.log(),
    },
    width: 90,
    cellStyle: {
      display: 'flex',
      justifyContent: 'center',
      paddingTop: '1rem',
    },
  },
  {
    headerName: 'Company Cost',
    field: 'companyCost',
    cellRenderer: (params) => {
      return venueCurrency + (params.data.companyCost > 0 ? parseFloat(params.data.companyCost).toFixed(2) : '0.00');
    },
    width: 100,
  },
  {
    headerName: 'Venue Cost',
    field: 'venueCost',
    cellRenderer: (params) => {
      return venueCurrency + (params.data.venueCost > 0 ? parseFloat(params.data.venueCost).toFixed(2) : '0.00');
    },
    width: 90,
  },
  {
    headerName: 'Notes',
    field: 'notes',
    wrapText: true,
    autoHeight: true,
    cellRenderer: DefaultTextRenderer,
    cellRendererParams: {
      truncate: false,
    },
    width: 320,
  },
  {
    headerName: '',
    field: 'icons',
    cellRenderer: IconRowRenderer,
    cellRendererParams: (params) => ({
      iconList: [
        {
          name: 'edit',
          onClick: () => updateActivity('edit', params.data),
        },
        {
          name: 'delete',
          onClick: () => updateActivity('delete', params.data),
        },
      ],
    }),
    width: 90,
    resizable: false,
  },
];
