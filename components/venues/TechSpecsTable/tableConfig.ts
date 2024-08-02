import DefaultTextRenderer from '../../core-ui-lib/Table/renderers/DefaultTextRenderer';
import formatInputDate from '../../../utils/dateInputFormat';
import { getTimeFromDateAndTime } from '../../../services/dateService';
import ButtonRenderer from '../../core-ui-lib/Table/renderers/ButtonRenderer';
import IconRowRenderer from '../../global/salesTable/renderers/IconRowRenderer';

export const attachmentsColDefs = [
  {
    headerName: 'Title',
    field: 'FileOriginalFilename',
    editable: true,
    cellRenderer: DefaultTextRenderer,
    width: 600,
  },
  {
    headerName: 'Date Uploaded',
    field: 'FileUploadedDateTime',
    cellRenderer: DefaultTextRenderer,
    cellRendererParams: function (params) {
      const updDate = new Date(params.data.FileUploadedDateTime);
      return {
        value: formatInputDate(updDate) + ' ' + getTimeFromDateAndTime(updDate),
      };
    },
    width: 150,
  },
  {
    headerName: 'Date File Created',
    field: 'FileDateTime',
    cellRenderer: DefaultTextRenderer,
    cellRendererParams: function (params) {
      const fileDt = new Date(params.data.FileDateTime);
      return {
        value: formatInputDate(fileDt) + ' ' + getTimeFromDateAndTime(fileDt),
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
