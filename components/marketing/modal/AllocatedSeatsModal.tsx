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
import { isNullOrEmpty } from 'utils';
import FormError from 'components/core-ui-lib/FormError';
import { Label } from 'components/core-ui-lib';

interface AllocatedModalProps {
  show: boolean;
  onCancel: () => void;
  onSave: (data, perfId, type: string) => void;
  bookingId: number;
  data?: any;
  type: string;
}

interface PerformanceType {
  text: string;
  value: number;
  date: string;
  time: string;
}

interface FormInterface {
  perfSelected: number;
  custName: string;
  email: string;
  numSeatsReq: number;
  seatNumList: string;
  requestBy: string;
  comments: string;
  arrangedBy: number;
  venueConfNotes: string;
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
  const [perfList, setPerfList] = useState<PerformanceType[]>([]);
  const [userList, setUserList] = useState<{ value: number; text: string }[]>([]);
  const users = useRecoilValue(userState);
  const [form, setForm] = useState<FormInterface>({
    perfSelected: null,
    custName: '',
    email: '',
    numSeatsReq: null,
    seatNumList: '',
    requestBy: '',
    comments: '',
    arrangedBy: null,
    venueConfNotes: '',
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [confVariant, setConfVariant] = useState<ConfDialogVariant>('cancel');
  const [allocId, setAllocId] = useState<number>(null);

  const labelClass = 'text-md text-primary-input-text flex-col text-left w-1/2 whitespace-pre-wrap: 1';

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

      setForm({
        perfSelected: perf.value,
        custName: data.TicketHolderName,
        email: data.TicketHolderEmail,
        numSeatsReq: data.Seats,
        seatNumList: data.SeatsAllocated,
        requestBy: data.RequestedBy,
        comments: data.Comments,
        arrangedBy: null,
        venueConfNotes: data.VenuteConfirmationNotes,
      });
      setAllocId(data.Id);

      if (data.ArrangedByAccUserId === undefined) {
        setForm((data) => ({ ...data, arrangedBy: null }));
      } else {
        const accUserId = userTempList.find((user) => user.text === data.ArrangedByAccUserId).value;
        setForm((data) => ({ ...data, arrangedBy: accUserId }));
      }
    } else if (type === 'new') {
      resetForm();
    }
  };

  // handle saving of form
  const handleSave = () => {
    // Check for required fields
    if (isNullOrEmpty(form.arrangedBy) || isNullOrEmpty(form.numSeatsReq) || isNullOrEmpty(form.perfSelected)) {
      setErrors({
        arrangedBy: isNullOrEmpty(form.arrangedBy),
        numberOfSeats: isNullOrEmpty(form.numSeatsReq),
        performance: isNullOrEmpty(form.perfSelected),
      });
      return;
    }

    const perf = perfList.find((perfRec) => perfRec.value === form.perfSelected);
    let data = {
      ArrangedByAccUserId: form.arrangedBy,
      Comments: form.comments,
      RequestedBy: form.requestBy,
      Seats: parseInt(form.numSeatsReq.toString()),
      SeatsAllocated: form.seatNumList.toString(),
      TicketHolderEmail: form.email,
      TicketHolderName: form.custName,
      VenueConfirmationNotes: form.venueConfNotes,
      date: formatInputDate(perf.date),
      time: perf.time,
      Id: null,
    };

    if (type === 'edit') {
      data = { ...data, Id: allocId };
    }

    onSave(data, form.perfSelected, type);
  };

  const formIsEmpty = (): boolean => {
    if (
      !isNullOrEmpty(form.arrangedBy) ||
      !isNullOrEmpty(form.comments) ||
      !isNullOrEmpty(form.custName) ||
      !isNullOrEmpty(form.email) ||
      !isNullOrEmpty(form.numSeatsReq) ||
      !isNullOrEmpty(form.perfSelected) ||
      !isNullOrEmpty(form.requestBy) ||
      !isNullOrEmpty(form.seatNumList) ||
      !isNullOrEmpty(form.venueConfNotes)
    ) {
      return false;
    }
    return true;
  };

  // Confirmation popup cancel handling
  const handleConfCancel = () => {
    if (confVariant === 'delete') {
      const perf = perfList.find((perfRec) => perfRec.value === form.perfSelected);
      const data = {
        ArrangedBy: userList.find((user) => user.value === form.arrangedBy).text,
        Comments: form.comments,
        RequestedBy: form.requestBy,
        Seats: form.numSeatsReq,
        SeatsAllocated: form.seatNumList,
        TicketHolderEmail: form.email,
        TicketHolderName: form.custName,
        VenueConfirmationNotes: form.venueConfNotes,
        date: formatInputDate(perf.date),
        time: perf.time,
        Id: allocId,
      };

      setShowConfirm(false);
      onSave(data, form.perfSelected, 'delete');
    } else {
      resetErrors();
      setShowConfirm(false);
      onCancel();
    }
  };

  // handle form changes
  const handleChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setForm((data) => ({ ...data, [name]: value }));
  };

  // reset form values
  const resetForm = () => {
    setForm({
      perfSelected: null,
      custName: '',
      email: '',
      numSeatsReq: null,
      seatNumList: '',
      requestBy: '',
      comments: '',
      arrangedBy: null,
      venueConfNotes: '',
    });
  };

  // reset form errors
  const resetErrors = () => {
    setErrors({
      arrangedBy: false,
      numberOfSeats: false,
      performance: false,
    });
  };

  // Handle closing of form
  const handleClose = (confType: ConfDialogVariant) => {
    if (confType === 'close') {
      if (formIsEmpty()) {
        // Close popup without confirmation
        onCancel();
      } else {
        // Open confirmation popup
        setConfVariant(confType);
        setShowConfirm(true);
      }
    }
  };

  // Handle confirming of form
  const handleConfirm = (confType: ConfDialogVariant) => {
    if (type === 'new') {
      if (!formIsEmpty()) {
        setConfVariant(confType);
        setShowConfirm(true);
      } else {
        resetErrors();
        onCancel();
      }
    } else if (type === 'edit') {
      const perf = perfList.find((perfRec) => perfRec.value === form.perfSelected);
      const updatedRec = {
        ArrangedBy: userList.find((user) => user.value === form.arrangedBy).text,
        Comments: form.comments,
        RequestedBy: form.requestBy,
        Seats: form.numSeatsReq,
        SeatsAllocated: form.seatNumList,
        TicketHolderEmail: form.email,
        TicketHolderName: form.custName,
        VenueConfirmationNotes: form.venueConfNotes,
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

  // Get performance list
  const getPerformanceList = async (bookingId: number) => {
    try {
      const data = await fetchData({
        url: '/api/performances/read/' + bookingId,
        method: 'POST',
      });

      if (typeof data === 'object') {
        const perfList = data as Array<PerformanceDTO>;
        const optionList: PerformanceType[] = [];
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

  useEffect(() => {
    if (bookingId !== null && bookingId !== undefined) {
      getPerformanceList(bookingId);
    }
  }, [bookingId]);

  // Update state of the form popup when show var is changed
  useEffect(() => {
    if (show) {
      initForm();
    }
    setVisible(show);
  }, [show]);

  return (
    <div>
      <PopupModal show={visible} onClose={() => handleClose('close')} showCloseIcon={true} hasOverlay={showConfirm}>
        <div className="h-[552px] w-[448px]">
          <div className="text-xl text-primary-navy font-bold mb-4 mt-3">Allocated Seats</div>
          <div className="flex flex-row">
            <Label text="Performance" required className={labelClass} />
            <div className="flex flex-col w-2/3 mb-2">
              <Select
                testId="perf-date-or-time"
                className={classNames('w-full', errors.arrangedBy ? '' : 'mb-4')}
                options={perfList}
                value={form.perfSelected}
                onChange={(e) => handleChange({ target: { name: 'perfSelected', value: e } })}
                placeholder="Select Date/Time"
                error={errors.performance}
                isClearable
                isSearchable
              />
              {errors.performance && <FormError error="This is a Required Field" className="mt-1 ml-2" />}
            </div>
          </div>

          <div className="flex flex-row">
            <Label text="Customer Name" className={labelClass} />
            <div className="flex flex-col w-2/3">
              <TextInput
                className="w-full mb-4"
                testId="customer-name"
                placeholder="Enter Customer Name"
                name="custName"
                id="custName"
                value={form.custName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-row">
            <Label text="Email" className={labelClass} />
            <div className="flex flex-col w-2/3">
              <TextInput
                className="w-full mb-4"
                testId="email-id"
                placeholder="Enter Email Address"
                id="emailAddress"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-row">
            <Label text="Number of Seats Required" required className={labelClass} />
            <div className={classNames('flex flex-col w-2/3 mb-2')}>
              <TextInput
                className={classNames('w-full', errors.numberOfSeats ? '' : 'mb-4')}
                testId="no-of-seats"
                placeholder="Enter No. Seats"
                id="seatsRequired"
                name="numSeatsReq"
                value={form.numSeatsReq}
                onChange={handleChange}
                error={errors.numberOfSeats ? 'Seat number required' : ''}
                type="number"
              />
              {errors.numberOfSeats && <FormError error="This is a Required Field" className="mt-2 ml-2" />}
            </div>
          </div>

          <div className="flex flex-row">
            <Label text="Seat Numbers" className={labelClass} />
            <div className="flex flex-col w-2/3">
              <TextInput
                className="w-full mb-4"
                testId="required-seat-numbers"
                placeholder="Seat Numbers"
                id="seatsNumList"
                name="seatNumList"
                value={form.seatNumList}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-row">
            <Label text="Requested by" className={labelClass} />
            <div className="flex flex-col w-2/3">
              <TextInput
                className="w-full mb-4"
                testId="requested-by-name"
                placeholder="Enter Name"
                id="requestedBy"
                name="requestBy"
                value={form.requestBy}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-row">
            <Label text="Comments" className={labelClass} />
            <div className="flex flex-col w-2/3">
              <TextInput
                className="w-full mb-4"
                testId="notes-field"
                placeholder="Notes Field"
                id="comments"
                name="comments"
                value={form.comments}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-row">
            <Label text="Arranged By" required className={labelClass} />
            <div className="flex flex-col w-2/3 mb-2">
              <Select
                className={classNames('w-full text-primary-input-text', errors.arrangedBy ? '' : 'mb-4')}
                testId="select-user"
                options={userList}
                value={form.arrangedBy}
                onChange={(e) => handleChange({ target: { name: 'arrangedBy', value: e } })}
                placeholder="Select User"
                isClearable
                isSearchable
                error={errors.arrangedBy}
              />
              {errors.arrangedBy && <FormError error="This is a Required Field" className="mt-2 ml-2" />}
            </div>
          </div>

          <div className="flex flex-row">
            <Label text={'Venue' + '\n' + 'Confirmation' + '\n' + 'notes'} className={labelClass} />
            <div className="flex flex-col">
              <TextArea
                className="w-[300px] h-[80px] mb-4"
                testId="venue-confirmation-notes"
                value={form.venueConfNotes}
                placeholder="Notes Field"
                onChange={handleChange}
                name="venueConfNotes"
              />
            </div>
          </div>
          {(errors.arrangedBy || errors.numberOfSeats || errors.performance) && (
            <FormError error="Please ensure you fill in the required fields" className="mt-4 -mb-2 float-right" />
          )}

          <div className="float-right flex flex-row mt-5">
            <Button
              className="ml-4 w-32 flex float-left"
              variant="secondary"
              text="Cancel"
              onClick={() => handleConfirm('cancel')}
            />
            {type !== 'ne' ? (
              <Button className="ml-4 w-32" onClick={() => handleConfirm('delete')} variant="tertiary" text="Delete" />
            ) : (
              <></>
            )}
            <Button
              className="ml-4 w-32 flex float-right"
              variant="primary"
              text="Save and Close"
              onClick={handleSave}
            />
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
