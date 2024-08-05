import DefaultTextRenderer from 'components/core-ui-lib/Table/renderers/DefaultTextRenderer';
import formatInputDate from 'utils/dateInputFormat';
import { getTimeFromDateAndTime } from 'services/dateService';
import ButtonRenderer from 'components/core-ui-lib/Table/renderers/ButtonRenderer';
import IconRowRenderer from 'components/global/salesTable/renderers/IconRowRenderer';

export const attachmentsColDefs = [
  {
    headerName: 'Title',
    field: 'name',
    editable: true,
    cellRenderer: DefaultTextRenderer,
    width: 700,
  },
  {
    headerName: 'Date Uploaded',
    field: 'uploadDateTime',
    cellRenderer: DefaultTextRenderer,
    cellRendererParams: function (params) {
      const updDate = new Date(params.data.uploadDateTime);
      return {
        value: formatInputDate(updDate) + ' ' + getTimeFromDateAndTime(updDate),
      };
    },
    width: 150,
  },
  {
    headerName: 'View',
    field: 'ViewBtn',
    cellRenderer: ButtonRenderer,
    cellRendererParams: {
      buttonText: 'View',
    },
    width: 100,
  },
  {
    headerName: '',
    field: 'icons',
    cellRenderer: IconRowRenderer,
    cellRendererParams: {
      iconList: [
        {
          name: 'delete',
        },
      ],
    },
    width: 80,
    resizable: false,
  },
];
