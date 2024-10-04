import { useEffect, useState } from 'react';
import PopupModal from 'components/core-ui-lib/PopupModal';
import TextInput from 'components/core-ui-lib/TextInput';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import Button from 'components/core-ui-lib/Button';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import formatInputDate from 'utils/dateInputFormat';
import { getTimeFromDateAndTime } from 'services/dateService';
import { UpdateAvailableSeatsParams } from 'pages/api/marketing/available-seats/update';
import { ConfDialogVariant } from 'components/core-ui-lib/ConfirmationDialog/ConfirmationDialog';
import { days } from 'config/global';

interface AvailableSeatsModalProps {
  show: boolean;
  onCancel: () => void;
  onSave: (data) => void;
  data: any;
}

export default function AvailableSeatsModal({
  show = false,
  onCancel,
  onSave,
  data,
}: Partial<AvailableSeatsModalProps>) {
  const [visible, setVisible] = useState<boolean>(show);

  const [dayName, setDayName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [allocated, setAllocated] = useState(0);
  const [available, setAvailable] = useState('');
  const [id, setId] = useState(0);
  const [perfId, setPerfId] = useState(0);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [confVariant, setConfVariant] = useState<ConfDialogVariant>('close');

  const initForm = () => {
    const dt = data.info.Date !== null ? new Date(data.info.Date) : new Date();
    setTime(getTimeFromDateAndTime(dt));
    setDate(formatInputDate(dt));
    setAllocated(data.totalAllocated);
    setAvailable(data.totalAvailable.toString());
    setDayName(days[dt.getDay()]);
    setId(data.availableCompId);
    setPerfId(data.info.Id);
    setNotes(data.note);
  };

  const handleSave = () => {
    const data: UpdateAvailableSeatsParams = {
      Id: id,
      Note: notes,
      PerformanceId: perfId,
      Seats: parseInt(available),
    };

    onSave(data);
  };

  const setNumericVal = (value: string) => {
    const regexPattern = /^-?\d*(\.\d*)?$/;
    // validate value with regex
    if (regexPattern.test(value)) {
      setAvailable(value);
    }
  };

  const handleConfCancel = () => {
    setShowConfirm(false);
    onCancel();
  };

  const handleConfirm = (variant: ConfDialogVariant) => {
    if (notes !== data.note || available !== data.totalAvailable.toString()) {
      setConfVariant(variant);
      setShowConfirm(true);
    } else {
      onCancel();
    }
  };

  useEffect(() => {
    if (data !== undefined && data !== null) {
      initForm();
    }
  }, [data]);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  return (
    <div>
      <PopupModal show={visible} onClose={() => handleConfirm('close')} showCloseIcon={true} hasOverlay={showConfirm}>
        <div className="h-[450x] w-[325px]">
          <div className="text-xl text-primary-navy font-bold mb-4 -mt-3">Available Seats</div>

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
                value={available.toString()}
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

          <div className="place-content-center flex flex-row mt-5">
            <Button className="w-132" variant="secondary" text="Cancel" onClick={() => handleConfirm('cancel')} />
            <Button className="ml-4 w-132" variant="primary" text="Save and Close" onClick={handleSave} />
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
