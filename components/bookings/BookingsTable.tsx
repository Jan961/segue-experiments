import Table from 'components/core-ui-lib/Table';
import { styleProps, columnDefs } from 'components/bookings/table/tableConfig';
import { useState } from 'react';
import NotesPopup from './NotesPopup';

interface BookingsTableProps {
  rowData?: any;
}

const defaultColDef = {
  wrapHeaderText: true,
};

export default function BookingsTable({ rowData }: BookingsTableProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [productionItem, setProductionItem] = useState(null);

  const gridOptions = {
    defaultColDef,
    autoSizeStrategy: {
      type: 'fitGridWidth',
      defaultMinWidth: 50,
    },
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
      <div className="w-full h-[calc(100%-140px)]">
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
