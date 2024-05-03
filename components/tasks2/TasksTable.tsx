import Table from 'components/core-ui-lib/Table';
import { useEffect, useRef, useState } from 'react';
import { bookingState } from 'state/booking/bookingState';
import { useRecoilState } from 'recoil';
import { filterState } from 'state/booking/filterState';
import axios from 'axios';
import { rehearsalState } from 'state/booking/rehearsalState';
import { getInFitUpState } from 'state/booking/getInFitUpState';
import { otherState } from 'state/booking/otherState';
import { styleProps } from './tableConfig';
import NotesPopup from './NotesPopup';

interface TasksTableProps {
  rowData?: any;
  columnDefs?: any;
  tableHeight?: boolean;
}

export default function TasksTable({ rowData = [], columnDefs = [], tableHeight = false }: TasksTableProps) {
  const tableRef = useRef(null);
  const [filter, setFilter] = useRecoilState(filterState);
  const [bookings, setBookings] = useRecoilState(bookingState);
  const [rehearsals, setRehearsals] = useRecoilState(rehearsalState);
  const [getInFitUps, setGetInFitUps] = useRecoilState(getInFitUpState);
  const [others, setOthers] = useRecoilState(otherState);
  const [rows, setRows] = useState([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [productionItem, setProductionItem] = useState(null);

  const gridOptions = {
    getRowStyle: (params) => {
      return params.data.bookingStatus === 'Pencilled' ? { fontStyle: 'italic' } : '';
    },
  };

  const handleCellClick = (e) => {
    if (e.column.colId === 'Notes') {
      setProductionItem(e.data);
      setShowModal(true);
    }
  };

  const handleSaveNote = async (value: string) => {
    setShowModal(false);
    const { data } = await axios.post('/api/bookings/note/update', {
      ...productionItem,
      note: value,
    });

    if (productionItem.isBooking) {
      const rowItem = bookings[data.Id];
      const replacement = { ...bookings, [data.Id]: { ...rowItem, Notes: value } };
      setBookings(replacement);
    } else if (productionItem.isRehearsal) {
      const rowItem = rehearsals[data.Id];
      const replacement = { ...rehearsals, [data.Id]: { ...rowItem, Notes: value } };
      setRehearsals(replacement);
    } else if (productionItem.isGetInFitUp) {
      const rowItem = getInFitUps[data.Id];
      const replacement = { ...getInFitUps, [data.Id]: { ...rowItem, Notes: value } };
      setGetInFitUps(replacement);
    } else {
      const rowItem = others[data.Id];
      const replacement = { ...others, [data.Id]: { ...rowItem, Notes: value } };
      setOthers(replacement);
    }
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
      setRows(rowData);
    }
  }, [rowData]);

  return (
    <>
      <div className="w-full h-[calc(100%-140px)]">
        <Table
          columnDefs={columnDefs}
          rowData={rows}
          styleProps={styleProps}
          tableHeight={tableHeight ? 234 : 0}
          gridOptions={gridOptions}
          onCellClicked={handleCellClick}
          ref={tableRef}
        />
      </div>
      <NotesPopup
        show={showModal}
        productionItem={productionItem}
        onSave={handleSaveNote}
        onCancel={() => setShowModal(false)}
      />
      {/* {showAddEditBookingModal.visible && <AddBooking {...showAddEditBookingModal} onClose={handleClose} />} */}
    </>
  );
}
