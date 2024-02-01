import Table from 'components/core-ui-lib/Table';
import { styleProps, columnDefs } from 'components/bookings/table/tableConfig';

const rows = [
  {
    production: 'MTM23 - Name',
    date: '12/12/23',
    week: 3,
    venue: 'Alhambra',
    town: 'Dunfermline',
    dayType: 'xxx',
    bookingStatus: 'uncomfirmed',
    capacity: 1000,
    performanceCount: 6,
    performanceTimes: '3pm to 5pm',
    miles: 400,
    travelTime: '6hrs',
    note: 'Hey you!',
  },
  {
    production: 'MTM23 - Name',
    date: '12/12/23',
    week: 3,
    venue: 'Alhambra',
    town: 'Dunfermline',
    dayType: 'xxx',
    bookingStatus: 'uncomfirmed',
    capacity: 1000,
    performanceCount: 6,
    performanceTimes: '3pm to 5pm',
    miles: 400,
    travelTime: '6hrs',
    note: '',
  },
];

interface BookingsTableProps {
  rowData?: (typeof rows)[0][];
}

export default function BookingsTable({ rowData = rows }: BookingsTableProps) {
  const handleCellClick = (e) => {
    console.log(e);
  };
  return (
    <div className="w-full h-full">
      <Table columnDefs={columnDefs} rowData={rowData} styleProps={styleProps} onCellClicked={handleCellClick} />
    </div>
  );
}
