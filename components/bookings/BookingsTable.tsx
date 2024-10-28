import Table from 'components/core-ui-lib/Table';
import { styleProps, columnDefs, columnDefsExportStyles } from 'components/bookings/table/tableConfig';
import { useEffect, useMemo, useState } from 'react';
import NotesPopup from './NotesPopup';
import { bookingState, addEditBookingState, ADD_EDIT_MODAL_DEFAULT_STATE } from 'state/booking/bookingState';
import { useRecoilState, useRecoilValue } from 'recoil';
import { filterState } from 'state/booking/filterState';
import AddBooking from './modal/NewBooking';
import { useRouter } from 'next/router';
import { isNullOrEmpty } from 'utils';
import { formatRowsForMultipeBookingsAtSameVenue, formatRowsForPencilledBookings } from './utils';
import { RowDoubleClickedEvent } from 'ag-grid-community';
import axios from 'axios';
import { rehearsalState } from 'state/booking/rehearsalState';
import { getInFitUpState } from 'state/booking/getInFitUpState';
import { otherState } from 'state/booking/otherState';
import { currentProductionSelector } from 'state/booking/selectors/currentProductionSelector';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import useComponentMountStatus from 'hooks/useComponentMountStatus';
import { accessBookingsHome } from 'state/account/selectors/permissionSelector';
import { ColDef } from 'ag-grid-enterprise';

interface BookingsTableProps {
  rowData?: any;
  tableRef?: any;
}

export default function BookingsTable({ rowData, tableRef }: BookingsTableProps) {
  const permissions = useRecoilValue(accessBookingsHome);
  const router = useRouter();
  const [filter, setFilter] = useRecoilState(filterState);
  const [bookings, setBookings] = useRecoilState(bookingState);
  const [rehearsals, setRehearsals] = useRecoilState(rehearsalState);
  const [getInFitUps, setGetInFitUps] = useRecoilState(getInFitUpState);
  const [others, setOthers] = useRecoilState(otherState);
  const [showAddEditBookingModal, setShowAddEditBookingModal] = useRecoilState(addEditBookingState);
  const currentProduction = useRecoilValue(currentProductionSelector);
  const [rows, setRows] = useState([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [productionItem, setProductionItem] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [bookingInfo, setBookingInfo] = useState(null);
  const isMounted = useComponentMountStatus();
  const canAccessNotes = useMemo(() => permissions && permissions.includes('ACCESS_BOOKING_NOTES'), [permissions]);
  const bookingColumDefs = useMemo(() => (isMounted ? columnDefs(canAccessNotes) : []), [isMounted, canAccessNotes]);

  const gridOptions = {
    suppressColumnVirtualisation: false,
    getRowStyle: (params) => {
      return params.data.bookingStatus === 'Pencilled' ? { fontStyle: 'italic' } : '';
    },
    getRowNodeId: (data) => {
      return data.id;
    },
    onRowDataUpdated: (params) => {
      params.api.forEachNode((rowNode) => {
        rowNode.id = rowNode.data.date;
      });
    },
  };

  const handleCellClick = (e) => {
    if (
      e.column.colId === 'note' &&
      permissions.includes('EDIT_BOOKING_NOTES') &&
      e.data.venue &&
      !isNullOrEmpty(e.data.dayType)
    ) {
      setProductionItem(e.data);
      setShowModal(true);
    }
  };

  const handleRowDoubleClicked = (e: RowDoubleClickedEvent) => {
    if (permissions.includes('EDIT_BOOKING_DETAILS')) {
      if (!currentProduction) {
        setShowConfirmationModal(true);
        return;
      }
      const { data } = e;
      setBookingInfo(data);
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
      let formattedRows = formatRowsForPencilledBookings(rowData);
      formattedRows = formatRowsForMultipeBookingsAtSameVenue(formattedRows);
      setRows(formattedRows);
    }
  }, [rowData]);

  const handleClose = (bookings = null) => {
    if (bookings) {
      router.replace(router.asPath);
    }
    setShowAddEditBookingModal(ADD_EDIT_MODAL_DEFAULT_STATE);
  };

  if (bookingColumDefs.length > 0) {
    (bookingColumDefs[0] as ColDef).sortable = currentProduction === undefined;
  }
  return (
    <>
      <div className="w-full h-[calc(100%-140px)]">
        <Table
          testId="bookings"
          columnDefs={bookingColumDefs}
          rowData={rows}
          styleProps={styleProps}
          onCellClicked={handleCellClick}
          onRowDoubleClicked={handleRowDoubleClicked}
          gridOptions={gridOptions}
          ref={tableRef}
          excelStyles={columnDefsExportStyles}
        />
      </div>
      <NotesPopup
        show={showModal}
        productionItem={productionItem}
        onSave={handleSaveNote}
        onCancel={() => setShowModal(false)}
      />
      {showAddEditBookingModal.visible && (
        <AddBooking {...showAddEditBookingModal} onClose={handleClose} bookingInfo={bookingInfo} />
      )}
      <ConfirmationDialog
        labelYes="OK"
        labelNo=""
        show={showConfirmationModal}
        content={{ question: 'To Add / Edit Bookings please', warning: 'select a single Production' }}
        onYesClick={() => setShowConfirmationModal(false)}
      />
    </>
  );
}
