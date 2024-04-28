import NoteColumnRenderer from 'components/bookings/table/NoteColumnRenderer';
import DefaultCellRenderer from 'components/core-ui-lib/Table/renderers/DefaultCellRenderer';
import SelectRenderer from 'components/core-ui-lib/Table/renderers/SelectRenderer';
import { tileColors } from 'config/global';

export const styleProps = { headerColor: tileColors.tasks };

export const columnDefs = [
  {
    headerName: 'Code',
    field: 'production',
    cellRenderer: DefaultCellRenderer,
    width: 72,
  },
  {
    headerName: 'Task Name',
    field: 'production',
    cellRenderer: DefaultCellRenderer,
    width: 445,
    flex: 1,
  },
  {
    headerName: 'Start by (WK)',
    field: 'date',
    cellRenderer: SelectRenderer,
    width: 120,
    minWidth: 120,
  },
  {
    headerName: 'Start by ',
    field: 'week',
    cellRenderer: DefaultCellRenderer,
    width: 120,
    minWidth: 120,
  },
  { headerName: 'Due (WK)', field: 'venue', cellRenderer: DefaultCellRenderer, width: 110, minWidth: 100 },
  { headerName: 'Due', field: 'town', cellRenderer: DefaultCellRenderer, width: 100, minWidth: 100 },
  { headerName: 'Progress %', field: 'dayType', cellRenderer: DefaultCellRenderer, width: 116 },
  {
    headerName: 'Status',
    field: 'bookingStatus',
    cellRenderer: DefaultCellRenderer,
    resizable: true,
    width: 105,
  },
  { headerName: 'Assigned to', field: 'capacity', cellRenderer: DefaultCellRenderer, width: 136 },
  { headerName: 'priority', field: 'capacity', cellRenderer: DefaultCellRenderer, width: 100 },
  {
    headerName: 'Notes',
    field: 'note',
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
