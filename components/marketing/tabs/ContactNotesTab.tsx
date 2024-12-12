import Button from 'components/core-ui-lib/Button';
import Table from 'components/core-ui-lib/Table';
import ContactNoteModal, { ContactNoteModalVariant } from '../modal/ContactNoteModal';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { BookingContactNoteDTO } from 'interfaces';
import { contactNoteColDefs, styleProps } from '../table/tableConfig';
import { useRecoilState, useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import { userState } from 'state/account/userState';
import { Spinner } from 'components/global/Spinner';
import { exportExcelReport } from 'components/bookings/modal/request';
import { notify } from 'components/core-ui-lib';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import axios from 'axios';
import { accessMarketingHome } from 'state/account/selectors/permissionSelector';

interface ContactNotesTabProps {
  bookingId: string;
}

export interface ContactNoteTabRef {
  resetData: () => void;
}

const ContactNotesTab = forwardRef<ContactNoteTabRef, ContactNotesTabProps>((props, ref) => {
  const [showContactNoteModal, setShowContactNoteModal] = useState<boolean>(false);
  const [contactModalVariant, setContactModalVariant] = useState<ContactNoteModalVariant>();
  const [contactNoteRows, setContactNoteRows] = useState<Array<BookingContactNoteDTO>>();
  const [contNoteColDefs, setContNoteColDefs] = useState([]);
  const [contactNoteRow, setContactNoteRow] = useState<BookingContactNoteDTO>();
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [bookingIdVal, setBookingIdVal] = useState(null);
  const [dataAvailable, setDataAvailable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { selected: productionId, productions } = useRecoilValue(productionJumpState);
  const bookings = useRecoilState(bookingJumpState);
  const users = useRecoilValue(userState);
  const permissions = useRecoilValue(accessMarketingHome);
  const canDeleteNote = permissions.includes('DELETE_CONTACT_NOTES');
  const canEditNote = permissions.includes('EDIT_CONTACT_NOTE');
  const canExportNotes = permissions.includes('EXPORT_CONTACT_NOTES_REPORT');

  useImperativeHandle(ref, () => ({
    resetData: () => {
      setDataAvailable(false);
    },
  }));

  const getContactNotes = async (bookingId: string, users) => {
    try {
      const contactNoteResponse = await axios.get(`/api/marketing/contact-notes/${bookingId}`);
      const contactNotes = contactNoteResponse.data;

      if (contactNotes && Array.isArray(contactNotes)) {
        setContNoteColDefs(contactNoteColDefs(contactNoteUpdate, users, canDeleteNote, canEditNote));
        setContactNoteRows(contactNotes);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const contactNoteUpdate = (variant: ContactNoteModalVariant, data: BookingContactNoteDTO) => {
    setContactModalVariant(variant);
    setContactNoteRow(data);

    if (variant === 'edit') {
      setShowContactNoteModal(true);
    } else if (variant === 'delete') {
      setShowConfirm(true);
    }
  };

  const saveContactNote = async (variant: ContactNoteModalVariant, data) => {
    if (variant === 'add') {
      const result = await axios.post('/api/marketing/contact-notes/create', data);
      const conNoteData = [...contactNoteRows, result.data];

      // re sort the rows to ensure the new field is put in the correct place chronologically
      const sortedContactNotes = conNoteData.sort(
        (a, b) => new Date(b.ContactDate).getTime() - new Date(a.ContactDate).getTime(),
      );

      setContactNoteRows(sortedContactNotes);
      setShowContactNoteModal(false);
    } else if (variant === 'edit') {
      await axios.post('/api/marketing/contact-notes/update', data);

      const rowIndex = contactNoteRows.findIndex((conNote) => conNote.Id === data.Id);
      const newRows = [...contactNoteRows];
      newRows[rowIndex] = data;

      const sortedContactNotes = newRows.sort(
        (a, b) => new Date(b.ContactDate).getTime() - new Date(a.ContactDate).getTime(),
      );

      setContactNoteRows(sortedContactNotes);
      setShowContactNoteModal(false);
    } else if (variant === 'delete') {
      await axios.post('/api/marketing/contact-notes/delete', data);

      const rowIndex = contactNoteRows.findIndex((conNote) => conNote.Id === data.Id);
      const newRows = [...contactNoteRows];
      if (rowIndex !== -1) {
        newRows.splice(rowIndex, 1);
      }

      setContactNoteRows(newRows);
      setShowConfirm(false);
    }
  };

  const addContactNote = () => {
    setContactModalVariant('add');
    setShowContactNoteModal(true);
  };

  useEffect(() => {
    const userTempList = Object.values(users).map(({ AccUserId, FirstName = '', LastName = '' }) => ({
      value: AccUserId,
      text: `${FirstName || ''} ${LastName || ''}`,
    }));

    if (props.bookingId !== null && props.bookingId !== undefined) {
      getContactNotes(props.bookingId.toString(), userTempList);
      setBookingIdVal(props.bookingId);

      setDataAvailable(true);
    }
  }, [props.bookingId]);

  const onExport = async () => {
    const urlPath = `/api/reports/marketing/contact-notes/${props.bookingId}`;
    const selectedVenue = bookings[0].bookings?.filter((booking) => booking.Id === bookings[0].selected);
    const venueAndDate = selectedVenue[0].Venue.Code + ' ' + selectedVenue[0].Venue.Name;
    const selectedProduction = productions?.filter((production) => production.Id === productionId);
    const { ShowName, ShowCode, Code } = selectedProduction[0];
    const productionName = `${ShowName} (${ShowCode + Code})`;
    const payload = {
      productionName,
      venueAndDate,
    };

    notify.promise(exportExcelReport(urlPath, payload), {
      loading: 'Generating contact notes report',
      success: 'Contact notes report downloaded successfully',
      error: 'Error generating contact notes report',
    });
  };

  if (dataAvailable) {
    return (
      <div>
        <div className="flex justify-end">
          <div className="flex flex-row items-center justify-between pb-5 gap-4">
            <Button
              text="Contact Notes Report"
              className="w-[203px]"
              disabled={!productionId || !canExportNotes}
              iconProps={{ className: 'h-4 w-3' }}
              sufixIconName="excel"
              onClick={() => onExport()}
              testId="btnExportConNotes"
            />

            <Button text="Add New" className="w-[160px]" onClick={addContactNote} testId="btnAddConNote" />
          </div>
        </div>

        {isLoading ? (
          <div className="mt-[150px] text-center">
            <Spinner size="lg" className="mr-3" />
          </div>
        ) : (
          <div className="flex flex-row">
            <div className="w-[1086px] h-[500px]">
              <Table
                columnDefs={contNoteColDefs}
                rowData={contactNoteRows}
                styleProps={styleProps}
                testId="tableContactNotes"
              />
            </div>
          </div>
        )}

        <ContactNoteModal
          show={showContactNoteModal}
          onCancel={() => setShowContactNoteModal(false)}
          variant={contactModalVariant}
          data={contactNoteRow}
          onSave={(variant, data) => saveContactNote(variant, data)}
          bookingId={bookingIdVal}
          editable={canEditNote}
        />

        <ConfirmationDialog
          variant="delete"
          show={showConfirm}
          onYesClick={() => saveContactNote('delete', contactNoteRow)}
          onNoClick={() => setShowConfirm(false)}
          hasOverlay={false}
          testId="confDialog"
        />
      </div>
    );
  }
});

ContactNotesTab.displayName = 'ContactNotesTab';
export default ContactNotesTab;
