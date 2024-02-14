import Table from 'components/core-ui-lib/Table';
import { styleProps, columnDefs } from 'components/bookings/table/tableConfig';
import { useEffect, useRef, useState } from 'react';
import NotesPopup from './NotesPopup';
import { useRecoilState } from 'recoil';
import { filterState } from 'state/booking/filterState';
import axios from 'axios';

interface BookingsTableProps {
  rowData?: any;
}

const defaultColDef = {
  wrapHeaderText: true,
};

export default function BookingsTable({ rowData }: BookingsTableProps) {
  const tableRef = useRef(null);
  const [filter, setFilter] = useRecoilState(filterState);
  const [rows, setRows] = useState([]);
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
    setShowModal(false);

    // SK-25 PL - run update booking to add the new note
    axios
      .patch('/api/bookings/update/', { BookingId: productionItem.Id, Notes: value })
      .then(({ data }) => {
        console.log(data);
      })
      .catch((error) => {
        alert(error);
      });
  };

  const handleCancelNote = () => {
    setProductionItem(null);
    setShowModal(false);
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
        onCancel={handleCancelNote}
      />
    </>
  );
}
