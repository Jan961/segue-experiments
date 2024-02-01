import Table from 'components/core-ui-lib/Table';
import { styleProps, columnDefs } from 'components/bookings/table/tableConfig';
import { useState } from 'react';
import NotesPopup from './NotesPopup';

const rows = [
  {
    production: 'MTM23 - Name',
    date: '2024-01-29T11:30:30',
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
    date: '2024-01-23T11:30:30',
    week: 3,
    venue: 'Alhambra',
    town: 'Dunfermline',
    dayType: 'xxx',
    bookingStatus: 'Pencilled',
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
  const [showModal, setShowModal] = useState<boolean>(false);
  const [productionItem, setProductionItem] = useState(null);

  const gridOptions = {
    getRowStyle: (params) => {
      return params.data.bookingStatus === 'Pencilled' ? { fontStyle: 'italic' } : '';
    },
  };

  const handleCellClick = (e) => {
    if (e.column.colId === 'note') {
      setProductionItem(e.data);
      setShowModal(true);
    }
  };

  const handleSaveNote = (value) => {
    console.log(value);
    setShowModal(false);
  };

  const handleCancelNote = () => {
    setProductionItem(null);
    setShowModal(false);
  };

  return (
    <>
      <div className="w-full h-full">
        <Table
          columnDefs={columnDefs}
          rowData={rowData}
          styleProps={styleProps}
          onCellClicked={handleCellClick}
          gridOptions={gridOptions}
        />
      </div>
      <NotesPopup
        show={showModal}
        value={productionItem?.note || ''}
        onSave={handleSaveNote}
        onCancel={handleCancelNote}
      />
    </>
  );
}
