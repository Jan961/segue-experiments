import DefaultCellRenderer from 'components/core-ui-lib/Table/renderers/DefaultCellRenderer';

export const getMasterTasksColumnDefs = (usersList = []) => {
  return [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 60,
      suppressMenu: true,
      headerName: '',
      cellStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      },
    },
    {
      headerName: 'Code',
      field: 'Code',
      cellRenderer: DefaultCellRenderer,
      width: 72,
    },
    {
      headerName: 'Task Name',
      field: 'Name',
      cellRenderer: DefaultCellRenderer,
      width: 445,
      flex: 1,
    },
    {
      headerName: 'Start by (WK)',
      field: 'StartByWeekNum',
      cellRenderer: DefaultCellRenderer,
      cellStyle: {
        overflow: 'visible',
      },
      width: 100,
      minWidth: 100,
    },
    {
      headerName: 'Complete by (WK)',
      field: 'CompleteByWeekNum',
      cellRenderer: DefaultCellRenderer,
      cellStyle: {
        overflow: 'visible',
      },
      width: 110,
      minWidth: 100,
    },
    { headerName: 'Priority', field: 'Priority', cellRenderer: DefaultCellRenderer, width: 100 },
    {
      headerName: 'Assigned to',
      field: 'AssignedToUserId',
      valueGetter: function (params) {
        return params.data?.AssignedToUserId
          ? usersList.filter((user) => user.value === params.data?.AssignedToUserId)[0].text
          : null;
      },
      cellRenderer: DefaultCellRenderer,
      width: 136,
    },
    {
      headerName: 'Notes',
      field: 'Notes',
      cellRenderer: DefaultCellRenderer,
      width: 320,
      resizable: false,
    },
  ];
};