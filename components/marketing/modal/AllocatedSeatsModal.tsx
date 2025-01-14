import { useEffect, useState } from 'react';
import PopupModal from 'components/core-ui-lib/PopupModal';
import TextInput from 'components/core-ui-lib/TextInput';
import Select from 'components/core-ui-lib/Select/Select';
import classNames from 'classnames';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import Button from 'components/core-ui-lib/Button';
import { PerformanceDTO } from 'interfaces';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import { ConfDialogVariant } from 'components/core-ui-lib/ConfirmationDialog/ConfirmationDialog';
import { useRecoilValue } from 'recoil';
import { userState } from 'state/account/userState';
import useAxios from 'hooks/useAxios';
import formatInputDate from 'utils/dateInputFormat';
import { getTimeFromDateAndTime } from 'services/dateService';
import { hasAllocSeatsChanged } from '../utils';
import { isNull, isNullOrEmpty } from 'utils';

interface AllocatedModalProps {
  show: boolean;
  onCancel: () => void;
  onSave: (data, perfId, type) => void;
  bookingId;
  data?: any;
  type: string;
}

export default function AllocatedSeatsModal({
  show = false,
  onCancel,
  onSave,
  bookingId,
  data,
  type,
}: Partial<AllocatedModalProps>) {
  const { fetchData } = useAxios();

  const [visible, setVisible] = useState<boolean>(show);
  const [perfList, setPerfList] = useState([]);
  const [userList, setUserList] = useState([]);
  const users = useRecoilValue(userState);
  const [perfSelected, setPerfSelected] = useState('');
  const [custName, setCustName] = useState('');
  const [email, setEmail] = useState('');
  const [numSeatsReq, setNumSeatsReq] = useState('');
  const [seatNumList, setSeatNumList] = useState('');
  const [requestedBy, setRequestedBy] = useState('');
  const [comments, setComments] = useState('');
  const [arrangedBy, setArrangedBy] = useState(null);
  const [venueConfNotes, setVenueConfNotes] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [confVariant, setConfVariant] = useState<ConfDialogVariant>('cancel');
  const [allocId, setAllocId] = useState(null);

  const labelClass = 'text-base text-primary-input-text flex flex-col text-left w-1/3';

  const [errors, setErrors] = useState({
    performance: false,
    numberOfSeats: false,
    arrangedBy: false,
  });

  const initForm = () => {
    const userTempList = Object.values(users).map(({ AccUserId, FirstName = '', LastName = '' }) => ({
      value: AccUserId,
      text: `${FirstName || ''} ${LastName || ''}`,
    }));

    setUserList(userTempList);

    if (type === 'edit') {
      const perf = perfList.find(
        (perfRec) => formatInputDate(perfRec.date) === data.date && getTimeFromDateAndTime(perfRec.date) === data.time,
      );

      setPerfSelected(perf.value);
      setCustName(data.TicketHolderName);
      setEmail(data.TicketHolderEmail);
      setNumSeatsReq(data.Seats);
      setSeatNumList(data.SeatsAllocated);
      setRequestedBy(data.RequestedBy);
      setComments(data.Comments);
      setVenueConfNotes(data.VenueConfirmationNotes);
      setAllocId(data.Id);

      if (data.ArrangedByAccUserId === undefined) {
        setArrangedBy(null);
      } else {
        const accUserId = userTempList.find((user) => user.text === data.ArrangedByAccUserId).value;
        setArrangedBy(accUserId);
      }
    } else if (type === 'new') {
      setPerfSelected(null);
      setCustName('');
      setEmail('');
      setNumSeatsReq('');
      setSeatNumList('');
      setRequestedBy('');
      setComments('');
      setArrangedBy(null);
      setVenueConfNotes('');
    }
  };

  const handleSave = () => {
    if (isNullOrEmpty(arrangedBy) || isNullOrEmpty(numSeatsReq) || isNullOrEmpty(perfSelected)) {
      setErrors({
        arrangedBy: isNullOrEmpty(arrangedBy),
        numberOfSeats: isNullOrEmpty(numSeatsReq),
        performance: isNullOrEmpty(perfSelected),
      });
      return;
    }

    const perf = perfList.find((perfRec) => perfRec.value === parseInt(perfSelected));
    let data = {
      ArrangedByAccUserId: parseInt(arrangedBy),
      Comments: comments,
      RequestedBy: requestedBy,
      Seats: parseInt(numSeatsReq),
      SeatsAllocated: seatNumList,
      TicketHolderEmail: email,
      TicketHolderName: custName,
      VenueConfirmationNotes: venueConfNotes,
      date: formatInputDate(perf.date),
      time: perf.time,
      Id: null,
    };

    if (type === 'edit') {
      data = { ...data, Id: allocId };
    }

    onSave(data, parseInt(perfSelected), type);
  };

  const setNumericVal = (value: string) => {
    const regexPattern = /^-?\d*(\.\d*)?$/;
    // validate value with regex
    if (regexPattern.test(value)) {
      setNumSeatsReq(value);
    }
  };

  const handleConfCancel = () => {
    if (confVariant === 'delete') {
      const perf = perfList.find((perfRec) => perfRec.value === parseInt(perfSelected));
      const data = {
        ArrangedBy: userList.find((user) => user.value === parseInt(arrangedBy)).text,
        Comments: comments,
        RequestedBy: requestedBy,
        Seats: parseInt(numSeatsReq),
        SeatsAllocated: seatNumList,
        TicketHolderEmail: email,
        TicketHolderName: custName,
        VenueConfirmationNotes: venueConfNotes,
        date: formatInputDate(perf.date),
        time: perf.time,
        Id: allocId,
      };

      setShowConfirm(false);
      onSave(data, parseInt(perfSelected), 'delete');
    } else {
      resetErrors();
      setShowConfirm(false);
      onCancel();
    }
  };

  const handleConfirm = (confType: ConfDialogVariant) => {
    if (type === 'new') {
      if (
        perfSelected !== '' ||
        custName !== '' ||
        email === '' ||
        numSeatsReq !== '' ||
        seatNumList !== '' ||
        requestedBy !== '' ||
        comments !== '' ||
        arrangedBy !== '' ||
        venueConfNotes !== ''
      ) {
        setConfVariant(confType);
        setShowConfirm(true);
      } else {
        resetErrors();
        onCancel();
      }
    } else if (type === 'edit') {
      const perf = perfList.find((perfRec) => perfRec.value === parseInt(perfSelected));
      const updatedRec = {
        ArrangedBy: userList.find((user) => user.value === parseInt(arrangedBy)).text,
        Comments: comments,
        RequestedBy: requestedBy,
        Seats: parseInt(numSeatsReq),
        SeatsAllocated: seatNumList,
        TicketHolderEmail: email,
        TicketHolderName: custName,
        VenueConfirmationNotes: venueConfNotes,
        date: formatInputDate(perf.date),
        time: perf.time,
      };

      // check for deletion first before dismissing the modal
      if (confType === 'delete') {
        setConfVariant(confType);
        setShowConfirm(true);
      } else {
        if (hasAllocSeatsChanged(data, updatedRec)) {
          setConfVariant(confType);
          setShowConfirm(true);
        } else {
          resetErrors();
          onCancel();
        }
      }
    }
  };

  const getPerformanceList = async (bookingId) => {
    try {
      const data = await fetchData({
        url: '/api/performances/read/' + bookingId,
        method: 'POST',
      });

      if (typeof data === 'object') {
        const perfList = data as Array<PerformanceDTO>;
        const optionList = [];
        perfList.forEach((perf) => {
          optionList.push({
            text: formatInputDate(perf.Date) + ' | ' + perf.Time.substring(0, 5),
            value: perf.Id,
            date: perf.Date,
            time: perf.Time.substring(0, 5),
          });
        });

        setPerfList(optionList);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setPerfValue = (value) => {
    if (isNull(value)) {
      setPerfSelected(null);
    } else {
      setPerfSelected(value.toString());
      setErrors({ ...errors, performance: false });
    }
  };

  const setArrangedByVal = (value) => {
    if (isNull(value)) {
      setArrangedBy(null);
    } else {
      setArrangedBy(value.toString());
      setErrors({ ...errors, arrangedBy: false });
    }
  };

  const resetErrors = () => {
    setErrors({
      arrangedBy: false,
      numberOfSeats: false,
      performance: false,
    });
  };

  useEffect(() => {
    if (bookingId !== null && bookingId !== undefined) {
      getPerformanceList(bookingId.toString());
    }
  }, [bookingId]);

  useEffect(() => {
    if (show) {
      initForm();
    }
    setVisible(show);
  }, [show]);

  return (
    <div>
      <PopupModal show={visible} onClose={() => handleConfirm('close')} showCloseIcon={true} hasOverlay={showConfirm}>
        <div className="h-[552px] w-[448px]">
          <div className="text-xl text-primary-navy font-bold mb-4 -mt-3">Allocated Seats</div>

          <div className="flex flex-row">
            <div className={labelClass}>For Performance</div>
            <div className="flex flex-col w-2/3">
              <Select
                testId="perf-date-or-time"
                className={classNames('w-full mb-4')}
                options={perfList}
                value={perfSelected}
                onChange={setPerfValue}
                placeholder="Select Date/Time"
                error={errors.performance}
                isClearable
                isSearchable
              />
            </div>
          </div>

          <div className="flex flex-row">
            <div className={labelClass}>Customer Name</div>
            <div className="flex flex-col w-2/3">
              <TextInput
                className="w-full mb-4"
                testId="customer-name"
                placeholder="Enter Customer Name"
                id="custName"
                value={custName}
                onChange={(event) => setCustName(event.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-row">
            <div className={labelClass}>Email</div>
            <div className="flex flex-col w-2/3">
              <TextInput
                className="w-full mb-4"
                testId="email-id"
                placeholder="Enter Email Address"
                id="emailAddress"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-row">
            <div className={labelClass}>Number of Seats Required</div>
            <div className="flex flex-col w-2/3">
              <TextInput
                className="w-full mb-4"
                testId="no-of-seats"
                placeholder="Enter No. Seats"
                id="seatsRequired"
                value={numSeatsReq}
                onChange={(event) => {
                  setNumericVal(event.target.value);
                  setErrors({ ...errors, numberOfSeats: false });
                }}
                error={errors.numberOfSeats ? 'Seat number required' : ''}
              />
            </div>
          </div>

          <div className="flex flex-row">
            <div className={labelClass}>Seat Numbers</div>
            <div className="flex flex-col w-2/3">
              <TextInput
                className="w-full mb-4"
                testId="required-seat-numbers"
                placeholder="Seat Numbers"
                id="seatsNumList"
                value={seatNumList}
                onChange={(event) => setSeatNumList(event.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-row">
            <div className={labelClass}>Requested by</div>
            <div className="flex flex-col w-2/3">
              <TextInput
                className="w-full mb-4"
                testId="requested-by-name"
                placeholder="Enter Name"
                id="requestedBy"
                value={requestedBy}
                onChange={(event) => setRequestedBy(event.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-row">
            <div className={labelClass}>Comments</div>
            <div className="flex flex-col w-2/3">
              <TextInput
                className="w-full mb-4"
                testId="notes-field"
                placeholder="Notes Field"
                id="comments"
                value={comments}
                onChange={(event) => setComments(event.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-row">
            <div className={labelClass}>Arranged by</div>
            <div className="flex flex-col w-2/3">
              <Select
                className={classNames('w-full text-primary-input-text mb-4')}
                testId="select-user"
                options={userList}
                value={arrangedBy}
                onChange={setArrangedByVal}
                placeholder="Select User"
                isClearable
                isSearchable
                error={errors.arrangedBy}
              />
            </div>
          </div>

          <div className="flex flex-row">
            <div className={labelClass}>
              Venue
              <br />
              Confirmation
              <br />
              Notes
            </div>
            <div className="flex flex-col">
              <TextArea
                className="w-[300px] h-[80px]"
                testId="venue-confirmation-notes"
                value={venueConfNotes}
                placeholder="Notes Field"
                onChange={(e) => setVenueConfNotes(e.target.value)}
              />
            </div>
          </div>

          {(errors.arrangedBy || errors.numberOfSeats || errors.performance) && (
            <div className="text-primary-red flex-row flex float-right mt-3 -mb-2">
              Please ensure you fill in the required fields
            </div>
          )}

          <div className="flex flex-row mt-5 pb-5 float-right">
            <Button className="w-32" variant="secondary" text="Cancel" onClick={() => handleConfirm('cancel')} />
            <Button className="ml-4 w-32" onClick={() => handleConfirm('delete')} variant="tertiary" text="Delete" />
            <Button className="ml-4 w-32" variant="primary" text="Save and Close" onClick={handleSave} />
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
