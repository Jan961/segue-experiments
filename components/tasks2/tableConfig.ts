import NoteColumnRenderer from 'components/bookings/table/NoteColumnRenderer';
import DefaultCellRenderer from 'components/core-ui-lib/Table/renderers/DefaultCellRenderer';
import { tileColors } from 'config/global';
import { TaskStatusLabelMap } from 'config/tasks';
import { calculateTaskStatus } from 'utils/tasks';


export const styleProps = { headerColor: tileColors.tasks };

export const getColumnDefs = (usersList = [], productionName = '') => {
  return [
    {
      headerName: 'Code',
      field: 'Code',
      cellRenderer: DefaultCellRenderer,
      width: 72,
      // cellStyle: function (params) {
      //   console.log(params.data.DueDate)
      //   const taskDateStatusColor = getTaskDateStatusColor(params?.data?.DueDate || null, params?.data?.Status);
      //   console.log(taskDateStatusColor)
      //   return taskDateStatusColor
      // }
    },
    {
      headerName: 'Task Name',
      field: 'Name',
      cellRenderer: DefaultCellRenderer,
      headerValueGetter: function () {
        if (productionName) return `${productionName} Task Name`;
        else return 'Task Name'
      },
      // cellStyle: function (params) {
      //   const taskDateStatusColor = getTaskDateStatusColor(params?.data?.DueDate, params?.data?.Status);
      //   return taskDateStatusColor
      // },
      width: 445,
      flex: 1,
    },
    {
      headerName: 'Start by (WK)',
      field: 'StartByWeekNum',
      cellRenderer: DefaultCellRenderer,
      width: 120,
      minWidth: 120,
    },
    {
      headerName: 'Start by ',
      field: 'StartDate',
      cellRenderer: DefaultCellRenderer,
      width: 120,
      minWidth: 120,
    },
    { headerName: 'Due (WK)', field: 'CompleteByWeekNum', cellRenderer: DefaultCellRenderer, width: 110, minWidth: 100 },
    { headerName: 'Due', field: 'CompleteDate', cellRenderer: DefaultCellRenderer, width: 100, minWidth: 100 },
    { headerName: 'Progress %', field: 'Progress', cellRenderer: DefaultCellRenderer, width: 116 },
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
    { headerName: 'priority', field: 'Priority', cellRenderer: DefaultCellRenderer, width: 100 },
    {
      headerName: 'Notes',
      field: 'Notes',
      cellRenderer: NoteColumnRenderer,
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

