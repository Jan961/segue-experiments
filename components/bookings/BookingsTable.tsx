import Table from 'components/core-ui-lib/Table';
import { styleProps, columnDefs } from 'components/bookings/table/tableConfig';
import { useEffect, useRef, useState } from 'react';
import NotesPopup from './NotesPopup';
import { bookingState } from 'state/booking/bookingState';
import { useRecoilState } from 'recoil';
import { filterState } from 'state/booking/filterState';
import AddBooking from './modal/NewBooking';
import useAxios from 'hooks/useAxios';

interface BookingsTableProps {
  rowData?: any;
}

const defaultColDef = {
  wrapHeaderText: true,
};

type AddBookingModalState = {
  visible: boolean;
  startDate?: string;
  endDate?: string;
};

const AddBookingInitialState = {
  visible: false,
  startDate: null,
  endDate: null,
};

export default function BookingsTable({ rowData }: BookingsTableProps) {
  const tableRef = useRef(null);
  const [filter, setFilter] = useRecoilState(filterState);
  const [bookingDict, setBookingDict] = useRecoilState(bookingState);
  const [rows, setRows] = useState([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [productionItem, setProductionItem] = useState(null);
  const [showAddBookingModal, setShowAddBookingModal] = useState<AddBookingModalState>(AddBookingInitialState);
  const { fetchData } = useAxios();

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
    if (!e.data.Id) {
      setShowAddBookingModal({
        visible: true,
        startDate: e.data.dateTime,
        endDate: e.data.dateTime,
      });
      return;
    }
    if (e.column.colId === 'note') {
      setProductionItem(e.data);
      setShowModal(true);
    }
  };

  const handleSaveNote = (value: string) => {
    setShowModal(false);
    
    fetchData({
      url: '/api/bookings/update/', 
      method: 'POST',
      data: { Id: productionItem.Id, Notes: value }})
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

  const formatRowsForPencilledBookings = (values) => {
    const pencilled = values.filter(({ bookingStatus }) => bookingStatus === 'Pencilled');
    const groupedByDate = pencilled.reduce((acc, item) => {
      if (acc[item.date] !== undefined) {
        acc[item.date] = acc[item.date] + 1;
      } else {
        acc[item.date] = 1;
      }
      return acc;
    }, {});

    const multiple = Object.entries(groupedByDate)
      .filter(([_, v]: [string, number]) => v > 1)
      .map((arr) => arr[0]);

    const updated = values.map((r) => (multiple.includes(r.date) ? { ...r, multipleVenuesOnSameDate: true } : r));
    return updated;
  };

  const formatRowsForMultipeBookingsAtSameVenue = (values) => {
    const groupedByVenue = values.reduce((acc, item) => {
      if (item.venue) {
        acc[item.venue] !== undefined ? (acc[item.venue] = acc[item.venue] + 1) : (acc[item.venue] = 1);
      }

      return acc;
    }, {});

    const venuesWithMultipleBookings = Object.entries(groupedByVenue)
      .filter(([_, v]: [string, number]) => v > 1)
      .map((arr) => arr[0]);

    const updated = values.map((r) =>
      venuesWithMultipleBookings.includes(r.venue) ? { ...r, venueHasMultipleBookings: true } : r,
    );
    return updated;
  };

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
        onShow={() => setShowModal(true)}
      />
      {showAddBookingModal.visible && (
        <AddBooking {...showAddBookingModal} onClose={() => setShowAddBookingModal(AddBookingInitialState)} />
      )}
    </>
  );
}
