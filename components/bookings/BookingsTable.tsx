import Table from 'components/core-ui-lib/Table';
import { styleProps, columnDefs } from 'components/bookings/table/tableConfig';
import { useEffect, useRef, useState } from 'react';
import NotesPopup from './NotesPopup';
import { bookingState, addEditBookingState, ADD_EDIT_MODAL_DEFAULT_STATE } from 'state/booking/bookingState';
import { useRecoilState } from 'recoil';
import { filterState } from 'state/booking/filterState';
import AddBooking from './modal/NewBooking';
import useAxios from 'hooks/useAxios';
import { useRouter } from 'next/router';
import { isNullOrEmpty } from 'utils';
import { formatRowsForMultipeBookingsAtSameVenue, formatRowsForPencilledBookings } from './utils';

interface BookingsTableProps {
  rowData?: any;
}

export default function BookingsTable({ rowData }: BookingsTableProps) {
  const tableRef = useRef(null);
  const router = useRouter();
  const [filter, setFilter] = useRecoilState(filterState);
  const [bookingDict, setBookingDict] = useRecoilState(bookingState);
  const [showAddEditBookingModal, setShowAddEditBookingModal] = useRecoilState(addEditBookingState);
  const [rows, setRows] = useState([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [productionItem, setProductionItem] = useState(null);

  const { fetchData } = useAxios();

  const gridOptions = {
    getRowStyle: (params) => {
      return params.data.bookingStatus === 'Pencilled' ? { fontStyle: 'italic' } : '';
    },
  };

  const handleCellClick = (e) => {
    if (!e.data.Id) {
      setShowAddEditBookingModal({
        visible: true,
        startDate: e.data.dateTime,
        endDate: e.data.dateTime,
      });
      return;
    }
    if (e.column.colId === 'note' && e.data.venue && !isNullOrEmpty(e.data.dayType)) {
      setProductionItem(e.data);
      setShowModal(true);
    }
  };

  const handleSaveNote = (value: string) => {
    setShowModal(false);

    fetchData({
      url: '/api/bookings/update/',
      method: 'POST',
      data: { Id: productionItem.Id, Notes: value },
    })
      .then((data: any) => {
        const updatedBooking = { ...bookingDict[data.Id], ...data };
        const replacement = { ...bookingDict, [data.Id]: updatedBooking };
        setBookingDict(replacement);
      })
      .catch((error) => {
        console.log(error);
      });
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

  const handleClose = (bookings = null) => {
    if (bookings) {
      router.reload();
    }
    setShowAddEditBookingModal(ADD_EDIT_MODAL_DEFAULT_STATE);
  };

  return (
    <>
      <div className="w-full h-[calc(100%-140px)]">
        <Table
          columnDefs={columnDefs}
          rowData={rows}
          styleProps={styleProps}
          onCellClicked={handleCellClick}
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
      {showAddEditBookingModal.visible && <AddBooking {...showAddEditBookingModal} onClose={handleClose} />}
    </>
  );
}
