import NoteColumnRenderer from 'components/bookings/table/NoteColumnRenderer';
import CustomSelectCelRenderer from 'components/core-ui-lib/Table/renderers/CustomSelectCellRenderer';
import DateRenderer from 'components/core-ui-lib/Table/renderers/DateRenderer';
import DefaultCellRenderer from 'components/core-ui-lib/Table/renderers/DefaultCellRenderer';
import NotesRenderer from 'components/core-ui-lib/Table/renderers/NotesRenderer';
import { tileColors } from 'config/global';
import { TaskStatusLabelMap } from 'config/tasks';
import { format } from 'date-fns';
import getTaskDateStatusColor from 'utils/getTaskDateStatus';
import { calculateTaskStatus } from 'utils/tasks';


export const styleProps = { headerColor: tileColors.tasks };

const generatePercentageOptions = Array.from({ length: 101 }, (_, index) => ({
  text: index,
  value: index
}));

export const getColumnDefs = (usersList = [], productionName = '') => {
  return [
    {
      headerName: 'Code',
      field: 'Code',
      cellRenderer: DefaultCellRenderer,
      width: 72,
      cellStyle: function (params) {
        const taskDateStatusColor = getTaskDateStatusColor(params?.data?.DueDate, params?.data?.Status);
        if (taskDateStatusColor === 'bg-none') return null;
        else return { backgroundColor: taskDateStatusColor, color: 'white' }
      }
    },
    {
      headerName: 'Task Name',
      field: 'Name',
      cellRenderer: DefaultCellRenderer,
      headerValueGetter: function () {
        if (productionName) return `${productionName} Task Name`;
        else return 'Task Name'
      },
      cellStyle: function (params) {
        const taskDateStatusColor = getTaskDateStatusColor(params?.data?.DueDate, params?.data?.Status);
        if (taskDateStatusColor === 'bg-none') return null;
        else return { backgroundColor: taskDateStatusColor, color: 'white' }
      },
      width: 445,
      flex: 1,
    },
    {
      headerName: 'Start by (WK)',
      field: 'StartByWeekNum',
      cellRenderer: CustomSelectCelRenderer,
      cellStyle: {
        overflow: 'visible',
      },
      cellRendererParams: function (params) {
        return {
          options: params.data.weekOptions,
          isSearchable: true
        }
      },
      width: 120,
      minWidth: 120,
    },
    {
      headerName: 'Start by ',
      field: 'StartDate',
      cellRenderer: DefaultCellRenderer,
      valueGetter: function(params){
        return format(params.data.StartDate, 'dd/MM/yy');
      },
      width: 120,
      minWidth: 120,
      cellStyle: {
        overflow: 'visible',
      },
    },
    {
      headerName: 'Due (WK)',
      field: 'CompleteByWeekNum',
      cellRenderer: CustomSelectCelRenderer,
      cellStyle: {
        overflow: 'visible',
      },
      cellRendererParams: function (params) {
        return {
          options: params.data.weekOptions,
          isSearchable: true
        }
      },
      width: 110,
      minWidth: 100
    },
    {
      headerName: 'Due',
      field: 'CompleteDate',
      cellRenderer: DefaultCellRenderer,
      cellStyle: {
        overflow: 'visible',
      },
      valueGetter: function(params){
        return format(params.data.CompleteDate, 'dd/MM/yy');
      },
      width: 120, minWidth: 120
    },
    {
      headerName: 'Progress %', field: 'Progress',
      cellRendererParams: {
        options: generatePercentageOptions,
        isSearchable: true
      },
      cellStyle: {
        overflow: 'visible',
      }, 
      cellRenderer: CustomSelectCelRenderer, width: 116
    },
    {
      headerName: 'Status',
      field: 'Status',
      cellRenderer: DefaultCellRenderer,
      valueGetter: function (params) {
        const status = TaskStatusLabelMap[calculateTaskStatus(params.data?.Progress || 0)];
        return status;
      },
      resizable: true,
      width: 105,
    },
    {
      headerName: 'Assigned to', field: 'AssignedToUserId',
      valueGetter: function (params) {
        return params.data?.AssignedToUserId ? usersList.filter((user) => user.value === params.data?.AssignedToUserId)[0].text : null;
      }, cellRenderer: DefaultCellRenderer, width: 136
    },
    { headerName: 'Priority', field: 'Priority', cellRenderer: DefaultCellRenderer, width: 100 },
    {
      headerName: 'Notes',
      field: 'Notes',
      cellRenderer: NotesRenderer,
      cellRendererParams: {
        tpActive: true,
      },
      resizable: false,
      width: 78,
      cellStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'visible',
      },
    },
  ];
}

