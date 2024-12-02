import { useEffect, useState } from 'react';
import PopupModal from 'components/core-ui-lib/PopupModal';
import TextInput from 'components/core-ui-lib/TextInput';
import DateInput from 'components/core-ui-lib/DateInput';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import Button from 'components/core-ui-lib/Button';
import { BookingContactNoteDTO } from 'interfaces';
import { dateTimeToTime, newDate, toISO } from 'services/dateService';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import { ConfDialogVariant } from 'components/core-ui-lib/ConfirmationDialog/ConfirmationDialog';
import { hasContactNoteChanged } from '../utils';
import { useRecoilValue } from 'recoil';
import { userState } from 'state/account/userState';
import classNames from 'classnames';
import Select from 'components/core-ui-lib/Select';
import { UTCDate } from '@date-fns/utc';

export type ContactNoteModalVariant = 'add' | 'edit' | 'delete';

const titleOptions = {
  add: 'Add New Contact Note',
  edit: 'Edit Contact Note',
};

interface ContactModalProps {
  show: boolean;
  onCancel: () => void;
  onSave: (variant: ContactNoteModalVariant, data: BookingContactNoteDTO) => void;
  variant: ContactNoteModalVariant;
  bookingId;
  data?: BookingContactNoteDTO;
}

export default function ContactNoteModal({
  show = false,
  onCancel,
  variant,
  onSave,
  bookingId,
  data,
}: Partial<ContactModalProps>) {
  const [visible, setVisible] = useState<boolean>(show);
  const [personContacted, setPersonContacted] = useState<string>(null);
  const [date, setDate] = useState<UTCDate>();
  const [time, setTime] = useState<string>();
  const [actionedBy, setActionedBy] = useState<number>();
  const [notes, setNotes] = useState<string>();
  const [id, setId] = useState(null);
  const [confVariant, setConfVariant] = useState<ConfDialogVariant>('close');
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [userList, setUserList] = useState([]);
  const users = useRecoilValue(userState);
  const [showNameLengthError, setShowNameLengthError] = useState<boolean>(false);

  useEffect(() => {
    setVisible(show);
    initForm();

    const userTempList = Object.values(users).map(({ AccUserId, FirstName = '', LastName = '' }) => ({
      value: AccUserId,
      text: `${FirstName || ''} ${LastName || ''}`,
    }));
    setUserList(userTempList);
  }, [show]);

  const initForm = () => {
    if (variant === 'add') {
      setPersonContacted('');
      setDate(newDate());
      setTime(dateTimeToTime(newDate()));
      setActionedBy(null);
      setNotes('');
      setShowNameLengthError(false);
    } else if (variant === 'edit') {
      setPersonContacted(data.CoContactName);
      setDate(newDate(data.ContactDate));
      setTime(dateTimeToTime(newDate(data.ContactDate)));
      setActionedBy(data.ActionAccUserId);
      setNotes(data.Notes);
      setId(data.Id);
    }
  };

  const handleConfirm = (type: ConfDialogVariant) => {
    // only check if variant is edit
    if (variant === 'edit') {
      const newRow: BookingContactNoteDTO = {
        BookingId: bookingId,
        ActionAccUserId: actionedBy,
        CoContactName: personContacted,
        ContactDate: toISO(date),
        Notes: notes,
      };

      if (hasContactNoteChanged(data, newRow)) {
        setConfVariant(type);
        setShowConfirm(true);
      } else {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  const handleSave = () => {
    let data: BookingContactNoteDTO = {
      BookingId: bookingId,
      ActionAccUserId: actionedBy,
      CoContactName: personContacted,
      ContactDate: toISO(date),
      Notes: notes,
    };

    if (variant !== 'add') {
      data = { ...data, Id: id };
    }
    onSave(variant, data);
  };

  const handleConfCancel = () => {
    setShowConfirm(false);
    onCancel();
  };

  return (
    <div>
      <PopupModal
        show={visible}
        onClose={() => handleConfirm('close')}
        showCloseIcon={true}
        hasOverlay={false}
        title={titleOptions[variant]}
      >
        <div>
          <div className="flex gap-x-2 align-middle">
            <div className="text-base font-bold text-primary-input-text">Name of Person Contacted</div>
            {showNameLengthError && (
              <div className="text-xs text-primary-red flex items-center">
                Please enter a Name less than 30 characters
              </div>
            )}
          </div>
          <TextInput
            className="w-full mb-4"
            testId="contacted-person-name"
            placeholder="Enter Person Contacted"
            id="input"
            value={personContacted}
            onChange={(event) => {
              if (event.target.value.length <= 30) {
                setPersonContacted(event.target.value);
              } else {
                setShowNameLengthError(true);
              }
            }}
          />

          <div className="flex flex-row gap-[105px]">
            <div className="flex flex-col">
              <div className="text-base font-bold text-primary-input-text">Date</div>
              <DateInput
                onChange={null}
                value={date}
                disabled={true}
                inputClass="w-[150px]"
                labelClassName="text-primary-input-text"
              />
            </div>

            <div className="flex flex-col">
              <div className="text-base font-bold text-primary-input-text">Time</div>
              <TextInput className="w-[150px] mb-4" id="time" value={time} disabled={true} onChange={null} />
            </div>
          </div>

          <div className="text-base font-bold text-primary-input-text">Actioned By</div>
          <Select
            className={classNames('w-full !border-0 text-primary-input-text mb-4')}
            testId="select-user"
            options={userList}
            value={actionedBy}
            onChange={(value) => setActionedBy(parseInt(value.toString()))}
            placeholder="Select User"
            isClearable
            isSearchable
          />

          <div className="text-base font-bold text-primary-input-text">Notes</div>
          <TextArea
            className="mt-2 h-[162px] w-full"
            testId="notes-area"
            value={notes}
            placeholder="Notes Field"
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="float-right flex flex-row mt-5 py-2">
            <Button
              className="ml-4 w-[132px]"
              onClick={() => handleConfirm('cancel')}
              variant="secondary"
              text="Cancel"
            />
            <Button className="ml-4 w-[132px]" onClick={handleSave} variant="primary" text="Save and Close" />
          </div>
        </div>
      </PopupModal>

      <ConfirmationDialog
        variant={confVariant}
        show={showConfirm}
        onYesClick={handleConfCancel}
        onNoClick={() => setShowConfirm(false)}
        hasOverlay={false}
      />
    </div>
  );
}
