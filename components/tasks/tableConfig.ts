import DefaultCellRenderer from 'components/core-ui-lib/Table/renderers/DefaultCellRenderer';
import NotesRenderer from 'components/tasks/NotesRenderer';
import SelectCellRenderer from 'components/core-ui-lib/Table/renderers/SelectCellRenderer';
import { tileColors } from 'config/global';
import { TaskStatusLabelMap } from 'config/tasks';
import { format } from 'date-fns';
import getTaskDateStatusColor, { getWeekOptions } from 'utils/taskDate';
import { calculateTaskStatus, generatePercentageOptions } from 'utils/tasks';
import IconRenderer from 'components/bookings/table/IconRenderer';
import MasterTaskNameRenderer from './modals/renderers/MasterTaskNameRenderer';
import ButtonRenderer from '../core-ui-lib/Table/renderers/ButtonRenderer';
import { isNullOrEmpty } from 'utils';

export const styleProps = { headerColor: tileColors.tasks };

export const getColumnDefs = (usersList = [], production) => {
  const weekOptions = getWeekOptions(production, false, false);
  return [
    {
      headerName: 'Code',
      field: 'Code',
      cellRenderer: DefaultCellRenderer,
      width: 120,
      valueGetter: function (params) {
        if (production) return `${production.ShowCode}${production?.Code}-${params?.data?.Code}`;
      },
      cellStyle: function (params) {
        const { CompleteDate, Progress } = params.data;
        const taskDateStatusColor = getTaskDateStatusColor(CompleteDate, Progress);
        if (taskDateStatusColor === 'bg-none') return null;
        else return { backgroundColor: taskDateStatusColor, color: '#FFF' };
      },
    },
    {
      headerName: 'Task Name',
      field: 'Name',
      cellRenderer: DefaultCellRenderer,
      headerValueGetter: function () {
        if (production.ShowName) return `${production.ShowName} Task Name`;
        else return 'Task Name';
      },
      cellStyle: function (params) {
        const { CompleteDate, Progress } = params.data;
        const taskDateStatusColor = getTaskDateStatusColor(CompleteDate, Progress);
        if (taskDateStatusColor === 'bg-none') return null;
        else return { backgroundColor: taskDateStatusColor, color: '#FFF' };
      },
      width: 445,
      flex: 1,
    },
    {
      headerName: 'Start by (WK)',
      field: 'StartByWeekNum',
      cellRenderer: SelectCellRenderer,
      cellStyle: {
        overflow: 'visible',
      },
      cellRendererParams: function () {
        return {
          options: weekOptions,
          isSearchable: true,
        };
      },
      width: 120,
      minWidth: 120,
    },
    {
      headerName: 'Start by ',
      field: 'StartDate',
      cellRenderer: DefaultCellRenderer,
      valueGetter: function (params) {
        return params?.data?.StartDate && format(params?.data?.StartDate, 'dd/MM/yy');
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
      cellRenderer: SelectCellRenderer,
      cellStyle: {
        overflow: 'visible',
      },
      cellRendererParams: function () {
        return {
          options: weekOptions,
          isSearchable: true,
        };
      },
      width: 110,
      minWidth: 100,
    },
    {
      headerName: 'Due',
      field: 'CompleteDate',
      cellRenderer: DefaultCellRenderer,
      cellStyle: {
        overflow: 'visible',
      },
      valueGetter: function (params) {
        return params?.data?.CompleteDate && format(params.data.CompleteDate, 'dd/MM/yy');
      },
      width: 120,
      minWidth: 120,
    },
    {
      headerName: 'Progress %',
      field: 'Progress',
      cellRendererParams: {
        options: generatePercentageOptions,
        isSearchable: true,
      },
      valueGetter: function (params) {
        return params.data?.Progress.toString();
      },
      cellStyle: {
        overflow: 'visible',
      },
      cellRenderer: SelectCellRenderer,
      width: 116,
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
      headerName: 'Assigned to',
      field: 'TaskAssignedToAccUserId',
      valueGetter: function (params) {
        return params.data?.TaskAssignedToAccUserId
          ? usersList?.find((user) => user.value === params.data?.TaskAssignedToAccUserId)?.text || null
          : null;
      },
      cellRenderer: DefaultCellRenderer,
      width: 136,
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
};

export const getMasterTasksColumnDefs = (usersList = []) => {
  return [
    {
      headerName: 'Code',
      field: 'Code',
      cellRenderer: DefaultCellRenderer,
      width: 72,
    },
    {
      headerName: 'Task Name',
      field: 'Name',
      cellRenderer: MasterTaskNameRenderer,
      width: 445,
      flex: 1,
    },
    {
      headerName: 'Start by (WK)',
      field: 'StartByWeekNum',
      cellRenderer: DefaultCellRenderer,
      width: 100,
      minWidth: 100,
    },
    {
      headerName: 'Complete by (WK)',
      field: 'CompleteByWeekNum',
      cellRenderer: DefaultCellRenderer,
      width: 110,
      minWidth: 100,
    },
    { headerName: 'Priority', field: 'Priority', cellRenderer: DefaultCellRenderer, width: 100 },
    {
      headerName: 'Assigned to',
      field: 'TaskAssignedToAccUserId',
      valueGetter: function (params) {
        return params.data?.TaskAssignedToAccUserId
          ? usersList?.find((user) => user?.value === params.data?.TaskAssignedToAccUserId)?.text || null
          : null;
      },
      cellRenderer: DefaultCellRenderer,
      width: 136,
    },
    {
      headerName: 'Notes',
      field: 'Notes',
      cellRenderer: NotesRenderer,
      cellRendererParams: {
        tpActive: true,
      },
      width: 78,
      cellStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'visible',
      },
    },
    {
      headerName: '',
      field: 'clone',
      cellRenderer: ButtonRenderer,
      cellRendererParams: (params) => ({
        buttonText: 'Clone',
        disabled: !isNullOrEmpty(params.data.MTRId),
      }),
      resizable: false,
      cellClass: 'no-right-border',
      width: 80,
      headerClass: 'text-center',
    },
    {
      headerName: '',
      field: 'edit',
      cellRenderer: IconRenderer,
      cellRendererParams: {
        iconProps: {
          iconName: 'edit',
        },
      },
      width: 20,
      cellClass: 'no-right-border',
      resizable: false,
      headerClass: 'text-center',
    },
    {
      headerName: '',
      field: 'delete',
      cellRenderer: IconRenderer,
      cellRendererParams: {
        iconProps: {
          iconName: 'delete',
        },
      },
      width: 20,
      resizable: false,
      headerClass: 'text-center',
    },
  ];
};
