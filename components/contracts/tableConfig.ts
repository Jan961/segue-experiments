import ContractStatusCellRenderer from 'components/contracts/table/ContractStatusCellRenderer';
import DefaultCellRenderer from '../bookings/table/DefaultCellRenderer';
import VenueColumnRenderer from './table/VenueColumnRenderer';
import DateColumnRenderer from './table/DateColumnRenderer';
import { tileColors } from 'config/global';

export const contractsStyleProps = { headerColor: tileColors.contracts };

export const contractsColumnDefs = [
  {
    headerName: 'Production',
    field: 'production',
    cellRenderer: DefaultCellRenderer,
    width: 106,
  },
  {
    headerName: 'Date',
    field: 'date',
    cellRenderer: DateColumnRenderer,
    width: 120,
    minWidth: 120,
    cellClassRules: {
      isMonday: (params) => params.value.includes('Mon'),
    },
  },
  { headerName: 'Week', field: 'week', cellRenderer: DefaultCellRenderer, width: 80 },
  {
    headerName: 'Venue Details',
    field: 'venue',
    cellRenderer: VenueColumnRenderer,
    minWidth: 6,
    flex: 2,
    cellClassRules: {
      dayTypeNotPerformance: (params) => {
        const { dayType } = params.data;
        return dayType !== 'Performance' && params.value !== '';
      },
      cancelledBooking: (params) => {
        const { bookingStatus } = params.data;
        return bookingStatus === 'Cancelled' && params.value !== '';
      },
      suspendedBooking: (params) => {
        const { bookingStatus } = params.data;
        return bookingStatus === 'Suspended' && params.value !== '';
      },
      pencilledBooking: (params) => {
        const { bookingStatus, multipleVenuesOnSameDate } = params.data;
        return bookingStatus === 'Pencilled' && multipleVenuesOnSameDate && params.value !== '';
      },
      multipleBookings: (params) => {
        const { dayType, venueHasMultipleBookings } = params.data;
        return dayType === 'Performance' && venueHasMultipleBookings && params.value !== '';
      },
    },
  },
  { headerName: 'Town', field: 'town', cellRenderer: DefaultCellRenderer, minWidth: 80, flex: 1 },
  { headerName: 'Capacity', field: 'capacity', cellRenderer: DefaultCellRenderer, width: 90 },
  { headerName: 'No. of Perfs', field: 'performanceCount', cellRenderer: DefaultCellRenderer, width: 90 },
  { headerName: 'Deal Memo Status', field: 'contractStatus', cellRenderer: ContractStatusCellRenderer, width: 180 },
  {
    headerName: 'Contract Status',
    field: 'contractStatus',
    cellRenderer: ContractStatusCellRenderer,
    resizable: false,
    width: 180,
  },
];
