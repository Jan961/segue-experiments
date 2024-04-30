import Table from 'components/core-ui-lib/Table';
import { contractsStyleProps, contractsColumnDefs } from 'components/contracts/tableConfig';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { contractsFilterState } from 'state/contracts/contractsFilterState';
import { formatRowsForMultipeBookingsAtSameVenue, formatRowsForPencilledBookings } from '../bookings/utils';

interface ContractsTableProps {
  rowData?: any;
}

export default function ContractsTable({ rowData }: ContractsTableProps) {
  const tableRef = useRef(null);
  const [filter, setFilter] = useRecoilState(contractsFilterState);
  const [rows, setRows] = useState([]);
  const gridOptions = {
    getRowStyle: (params) => {
      return params.data.bookingStatus === 'Pencilled' ? { fontStyle: 'italic' } : '';
    },
  };

  useEffect(() => {
    if (tableRef && tableRef.current && filter?.scrollToDate) {
      const rowIndex = rowData.findIndex(({ date }) => date === filter.scrollToDate);
      if (rowIndex !== -1) {
        tableRef.current?.getApi().ensureIndexVisible(rowIndex, 'middle');
        setFilter({ ...filter, scrollToDate: '' });
      }
    }
  }, [filter, setFilter, rowData]);

  useEffect(() => {
    if (rowData) {
      let formattedRows = formatRowsForPencilledBookings(rowData);
      formattedRows = formatRowsForMultipeBookingsAtSameVenue(formattedRows);
      setRows(formattedRows);
    }
  }, [rowData]);

  return (
    <>
      <div className="w-full h-[calc(100%-140px)]">
        <Table
          columnDefs={contractsColumnDefs}
          rowData={rows}
          styleProps={contractsStyleProps}
          // onCellClicked={handleCellClick}
          // onRowDoubleClicked={handleRowDoubleClicked}
          gridOptions={gridOptions}
          ref={tableRef}
        />
      </div>
      {/* <NotesPopup
        show={showModal}
        productionItem={productionItem}
        onSave={handleSaveNote}
        onCancel={() => setShowModal(false)}
      /> */}
      {/* {showAddEditBookingModal.visible && <AddBooking {...showAddEditBookingModal} onClose={handleClose} />} */}
    </>
  );
}
