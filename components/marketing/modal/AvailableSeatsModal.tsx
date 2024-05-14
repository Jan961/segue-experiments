import { useEffect, useState } from 'react';
import PopupModal from 'components/core-ui-lib/PopupModal';
import TextInput from 'components/core-ui-lib/TextInput';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import Button from 'components/core-ui-lib/Button';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import formatInputDate from 'utils/dateInputFormat';
import { getTimeFromDateAndTime } from 'services/dateService';

interface AvailableSeatsModalProps {
  show: boolean;
  onCancel: () => void;
  onSave: () => void;
  currAllocated: number;
  currAvailable: number;
}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AvailableSeatsModal({
  show = false,
  onCancel,
  currAllocated,
  currAvailable, // data,
} // onSave,
: Partial<AvailableSeatsModalProps>) {
  const [visible, setVisible] = useState<boolean>(show);

  const [dayName, setDayName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [seatsNum, setSeatsNum] = useState('');
  const [notes, setNotes] = useState('');
  const [allocated, setAllocated] = useState(0);
  const [available, setAvailable] = useState(0);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const initForm = () => {
    const today = new Date();
    setTime(getTimeFromDateAndTime(today));
    setDate(formatInputDate(today));
    setAllocated(currAllocated);
    setAvailable(currAvailable);
    setDayName(days[today.getDay()]);
  };

  //   const handleSave = () => {
  //     // display error if the activity type is not selected
  //     if (actType === null) {
  //       setError(true);
  //       return;
  //     }

  //     let data: ActivityDTO = {
  //       ActivityTypeId: actType,
  //       BookingId: bookingId,
  //       CompanyCost: parseFloat(companyCost),
  //       VenueCost: parseFloat(venueCost),
  //       Date: startOfDay(new Date(actDate)),
  //       FollowUpRequired: actFollowUp,
  //       Name: actName,
  //       Notes: actNotes,
  //       DueByDate: actFollowUp ? startOfDay(new Date(followUpDt)) : null,
  //     };

  //     // only add iD if not adding
  //     if (variant !== 'add') {
  //       data = { ...data, Id: actId };
  //     }

  //     onSave(variant, data);
  //   };

  const setNumericVal = (value: string) => {
    const regexPattern = /^-?\d*(\.\d*)?$/;
    // validate value with regex
    if (regexPattern.test(value)) {
      setSeatsNum(value);
    }
  };

  const handleConfCancel = () => {
    setShowConfirm(false);
    onCancel();
  };

  const handleConfirm = () => {
    onCancel();
  };

  useEffect(() => {
    initForm();
  });

  useEffect(() => {
    setVisible(show);
  }, [show]);

  return (
    <div>
      <PopupModal show={visible} onClose={() => handleConfirm()} showCloseIcon={true} hasOverlay={showConfirm}>
        <div className="h-[446px] w-[325px]">
          <div className="text-xl text-primary-navy font-bold mb-4">Available Seats</div>

          <div className="flex flex-row mb-2">
            <div className="text-base text-primary-input-text flex flex-col text-left w-1/3">Day</div>
            <div className="flex flex-col w-2/3 text-primary-input-text text-base">{dayName}</div>
          </div>

          <div className="flex flex-row mb-2">
            <div className="text-base text-primary-input-text flex flex-col text-left w-1/3">Date</div>
            <div className="flex flex-col w-2/3 text-primary-input-text text-base">{date}</div>
          </div>

          <div className="flex flex-row mb-2">
            <div className="text-base text-primary-input-text flex flex-col text-left w-1/3">Time</div>
            <div className="flex flex-col w-2/3 text-primary-input-text text-base">{time}</div>
          </div>

          <div className="flex flex-row mb-2">
            <div className="text-base text-primary-input-text flex flex-col text-left w-1/3">Seats</div>
            <div className="flex flex-col w-2/3 text-primary-input-text text-base">
              <TextInput
                className="w-[103px]"
                placeholder="Enter Number"
                id="seatsNo"
                value={seatsNum}
                onChange={(event) => setNumericVal(event.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-row mb-2">
            <div className="text-base text-primary-input-text flex flex-col text-left w-1/3">Allocated</div>
            <div className="flex flex-col w-2/3 text-primary-input-text text-base">{allocated}</div>
          </div>

          <div className="flex flex-row mb-2">
            <div className="text-base text-primary-input-text flex flex-col text-left w-1/3">Available</div>
            <div className="flex flex-col w-2/3 text-primary-input-text text-base">{available}</div>
          </div>

          <div className="flex flex-row">
            <div className="flex flex-col">
              <TextArea
                className="w-[325px] h-[129px]"
                value={notes}
                placeholder="Notes Field"
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="place-content-center flex flex-row mt-5 pb-5">
            <Button className="w-132" variant="secondary" text="Cancel" onClick={() => handleConfirm()} />
            <Button className="ml-4 w-132" variant="primary" text="Save and Close" onClick={null} />
          </div>
        </div>
      </PopupModal>

      <ConfirmationDialog
        variant={'cancel'}
        show={showConfirm}
        onYesClick={handleConfCancel}
        onNoClick={() => setShowConfirm(false)}
        hasOverlay={false}
      />
    </div>
  );
}
