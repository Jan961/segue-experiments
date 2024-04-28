import Table from 'components/core-ui-lib/Table';
import { useEffect, useRef, useState } from 'react';
import { bookingState, addEditBookingState, ADD_EDIT_MODAL_DEFAULT_STATE } from 'state/booking/bookingState';
import { useRecoilState } from 'recoil';
import { filterState } from 'state/booking/filterState';
import { useRouter } from 'next/router';
import { isNullOrEmpty } from 'utils';
import { RowDoubleClickedEvent } from 'ag-grid-community';
import axios from 'axios';
import { rehearsalState } from 'state/booking/rehearsalState';
import { getInFitUpState } from 'state/booking/getInFitUpState';
import { otherState } from 'state/booking/otherState';
import NotesPopup from 'components/bookings/NotesPopup';
import { columnDefs, styleProps } from './tableConfig';

interface TasksTableProps {
  rowData?: any;
}

export default function TasksTable({ rowData }: TasksTableProps) {
  const tableRef = useRef(null);
  const router = useRouter();
  const [filter, setFilter] = useRecoilState(filterState);
  const [bookings, setBookings] = useRecoilState(bookingState);
  const [rehearsals, setRehearsals] = useRecoilState(rehearsalState);
  const [getInFitUps, setGetInFitUps] = useRecoilState(getInFitUpState);
  const [others, setOthers] = useRecoilState(otherState);
  const [showAddEditBookingModal, setShowAddEditBookingModal] = useRecoilState(addEditBookingState);
  const [rows, setRows] = useState([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [productionItem, setProductionItem] = useState(null);

  const gridOptions = {
    getRowStyle: (params) => {
      return params.data.bookingStatus === 'Pencilled' ? { fontStyle: 'italic' } : '';
    },
  };

  const handleCellClick = (e) => {
    if (e.column.colId === 'note' && e.data.venue && !isNullOrEmpty(e.data.dayType)) {
      setProductionItem(e.data);
      setShowModal(true);
    }
  };

  const handleRowDoubleClicked = (e: RowDoubleClickedEvent) => {
    const { data } = e;
    if (!data.Id) {
      setShowAddEditBookingModal({
        visible: true,
        startDate: e.data.dateTime,
        endDate: e.data.dateTime,
      });
    } else {
      setShowAddEditBookingModal({
        visible: true,
        startDate: data.dateTime,
        endDate: data.dateTime,
        booking: data,
      });
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

  //   useEffect(() => {
  //     if (rowData) {
  //       let formattedRows = formatRowsForPencilledBookings(rowData);
  //       formattedRows = formatRowsForMultipeBookingsAtSameVenue(formattedRows);
  //       setRows(formattedRows);
  //     }
  //   }, [rowData]);

  const handleClose = (bookings = null) => {
    if (bookings) {
      router.replace(router.asPath);
    }
    setShowAddEditBookingModal(ADD_EDIT_MODAL_DEFAULT_STATE);
  };

  console.log(showAddEditBookingModal, setRows, handleClose);

  return (
    <>
      <div className="w-full h-[calc(100%-140px)]">
        <Table
          columnDefs={columnDefs}
          rowData={rows}
          styleProps={styleProps}
          onCellClicked={handleCellClick}
          onRowDoubleClicked={handleRowDoubleClicked}
          gridOptions={gridOptions}
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
