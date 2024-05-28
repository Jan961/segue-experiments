import Button from 'components/core-ui-lib/Button';
import Table from 'components/core-ui-lib/Table';
import ContactNoteModal, { ContactNoteModalVariant } from '../modal/ContactNoteModal';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { BookingContactNoteDTO } from 'interfaces';
import useAxios from 'hooks/useAxios';
import { contactNoteColDefs, styleProps } from '../table/tableConfig';
import { useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import { userState } from 'state/account/userState';

interface ContactNotesTabProps {
  bookingId: string;
}

export interface ContactNoteTabRef {
  resetData: () => void;
}

const ContactNotesTab = forwardRef<ContactNoteTabRef, ContactNotesTabProps>((props, ref) => {
  const { fetchData } = useAxios();

  const [showContactNoteModal, setShowContactNoteModal] = useState<boolean>(false);
  const [contactModalVariant, setContactModalVariant] = useState<ContactNoteModalVariant>();
  const [contactNoteRows, setContactNoteRows] = useState<Array<BookingContactNoteDTO>>();
  const [contNoteColDefs, setContNoteColDefs] = useState([]);
  const [contactNoteRow, setContactNoteRow] = useState<BookingContactNoteDTO>();
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [bookingIdVal, setBookingIdVal] = useState(null);
  const [dataAvail, setDataAvail] = useState<boolean>(false);
  const { selected: productionId } = useRecoilValue(productionJumpState);
  const users = useRecoilValue(userState);

  useImperativeHandle(ref, () => ({
    resetData: () => {
      setDataAvail(false);
    },
  }));

  const getContactNotes = async (bookingId: string, users) => {
    try {
      const data = await fetchData({
        url: '/api/marketing/contactNotes/' + bookingId,
        method: 'POST',
      });

      if (typeof data === 'object') {
        const contactNoteList = data as Array<BookingContactNoteDTO>;

        const sortedContactNotes = contactNoteList.sort(
          (a, b) => new Date(b.ContactDate).getTime() - new Date(a.ContactDate).getTime(),
        );

        setContNoteColDefs(contactNoteColDefs(contactNoteUpdate, users));
        setContactNoteRows(sortedContactNotes);
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
      await fetchData({
        url: '/api/marketing/contactNotes/create',
        data,
        method: 'POST',
      });

      const conNoteData = [...contactNoteRows, data];

      // re sort the rows to ensure the new field is put in the correct place chronologically
      const sortedContactNotes = conNoteData.sort(
        (a, b) => new Date(b.ContactDate).getTime() - new Date(a.ContactDate).getTime(),
      );

      setContactNoteRows(sortedContactNotes);
      setShowContactNoteModal(false);
    } else if (variant === 'edit') {
      await fetchData({
        url: '/api/marketing/contactNotes/update',
        method: 'POST',
        data,
      });

      const rowIndex = contactNoteRows.findIndex((conNote) => conNote.Id === data.Id);
      const newRows = [...contactNoteRows];
      newRows[rowIndex] = data;

      const sortedContactNotes = newRows.sort(
        (a, b) => new Date(b.ContactDate).getTime() - new Date(a.ContactDate).getTime(),
      );

      setContactNoteRows(sortedContactNotes);
      setShowContactNoteModal(false);
    } else if (variant === 'delete') {
      await fetchData({
        url: '/api/marketing/contactNotes/delete',
        method: 'POST',
        data,
      });

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
    const userTempList = Object.values(users).map(({ Id, FirstName = '', LastName = '' }) => ({
      value: Id,
      text: `${FirstName || ''} ${LastName || ''}`,
    }));

    if (props.bookingId !== null && props.bookingId !== undefined) {
      getContactNotes(props.bookingId.toString(), userTempList);
      setBookingIdVal(props.bookingId);

      setDataAvail(true);
    }
  }, [props.bookingId]);

  return (
    <>
      {dataAvail && (
        <div>
          <div className="flex justify-end">
            <div className="flex flex-row items-center justify-between pb-5 gap-4">
              <Button
                text="Contact Notes Report"
                className="w-[203px]"
                disabled={!productionId}
                iconProps={{ className: 'h-4 w-3' }}
                sufixIconName="excel"
              />
              <Button text="Add New" className="w-[160px]" onClick={addContactNote} />
            </div>
          </div>

          <div className="flex flex-row">
            <div className="w-[1086px] h-[500px]">
              <Table columnDefs={contNoteColDefs} rowData={contactNoteRows} styleProps={styleProps} />
            </div>
          </div>

          <ContactNoteModal
            show={showContactNoteModal}
            onCancel={() => setShowContactNoteModal(false)}
            variant={contactModalVariant}
            data={contactNoteRow}
            onSave={(variant, data) => saveContactNote(variant, data)}
            bookingId={bookingIdVal}
          />

          <ConfirmationDialog
            variant="delete"
            show={showConfirm}
            onYesClick={() => saveContactNote('delete', contactNoteRow)}
            onNoClick={() => setShowConfirm(false)}
            hasOverlay={false}
          />
        </div>
      )}
    </>
  );
});

ContactNotesTab.displayName = 'ContactNotesTab';
export default ContactNotesTab;
