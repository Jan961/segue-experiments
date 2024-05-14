import { useEffect, useState } from 'react';
import PopupModal from 'components/core-ui-lib/PopupModal';
import TextInput from 'components/core-ui-lib/TextInput';
import Select from 'components/core-ui-lib/Select/Select';
import classNames from 'classnames';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import Button from 'components/core-ui-lib/Button';
import { ActivityDTO, PerformanceDTO } from 'interfaces';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import { ConfDialogVariant } from 'components/core-ui-lib/ConfirmationDialog/ConfirmationDialog';
import { useRecoilValue } from 'recoil';
import { userState } from 'state/account/userState';
import useAxios from 'hooks/useAxios';
import formatInputDate from 'utils/dateInputFormat';

interface AllocatedModalProps {
  show: boolean;
  onCancel: () => void;
  onSave: () => void;
  bookingId;
  data?: ActivityDTO;
}

export default function AllocatedSeatsModal({
  show = false,
  onCancel,
  // onSave,
  bookingId, // data,
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
  const [arrangedBy, setArrangedBy] = useState('');
  const [venueConfNotes, setVenueConfNotes] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [confVariant, setConfVariant] = useState<ConfDialogVariant>('cancel');

  //   const initForm = () => {
  //     if (variant === 'add') {
  //       setActName('');
  //       setActType(null);
  //       setActDate(null);
  //       setActFollowUp(false);
  //       setFollowUpDt(null);
  //       setCompanyCost('');
  //       setVenueCost('');
  //       setActNotes('');
  //     } else if (variant === 'edit') {
  //       setActName(data.Name);
  //       setActType(data.ActivityTypeId);
  //       setActDate(startOfDay(new Date(data.Date)));
  //       setActFollowUp(data.FollowUpRequired);
  //       setFollowUpDt(data.DueByDate === null ? null : startOfDay(new Date(data.DueByDate)));
  //       setCompanyCost(data.CompanyCost.toString());
  //       setVenueCost(data.VenueCost.toString());
  //       setActNotes(data.Notes);
  //       setActId(data.Id);
  //     }
  //   };

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
      setNumSeatsReq(value);
    }
  };

  const handleConfCancel = () => {
    setShowConfirm(false);
    onCancel();
  };

  const handleConfirm = (type: ConfDialogVariant) => {
    setConfVariant(type);
    onCancel();
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
          });
        });
        setPerfList(optionList);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPerformanceList(bookingId.toString());

    const userTempList = Object.values(users).map(({ Id, FirstName = '', LastName = '' }) => ({
      value: Id,
      text: `${FirstName || ''} ${LastName || ''}`,
    }));

    setUserList(userTempList);
  }, [bookingId]);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  return (
    <div>
      <PopupModal show={visible} onClose={() => handleConfirm('close')} showCloseIcon={true} hasOverlay={showConfirm}>
        <div className="h-[552px] w-[448px]">
          <div className="text-xl text-primary-navy font-bold mb-4">Allocated Seats</div>

          <div className="flex flex-row">
            <div className="text-base text-primary-input-text flex flex-col text-left w-1/3">For Performance</div>
            <div className="flex flex-col w-2/3">
              <Select
                className={classNames('w-full !border-0 text-primary-input-text mb-4')}
                options={perfList}
                value={perfSelected}
                onChange={(value) => setPerfSelected(value.toString())}
                placeholder={'Select Date/Time'}
                isClearable
                isSearchable
              />
            </div>
          </div>

          <div className="flex flex-row">
            <div className="text-base text-primary-input-text flex flex-col text-left w-1/3">Customer Name</div>
            <div className="flex flex-col w-2/3">
              <TextInput
                className="w-full mb-4"
                placeholder="Enter Customer Name"
                id="custName"
                value={custName}
                onChange={(event) => setCustName(event.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-row">
            <div className="text-base text-primary-input-text flex flex-col text-left w-1/3">Email</div>
            <div className="flex flex-col w-2/3">
              <TextInput
                className="w-full mb-4"
                placeholder="Enter Email Address"
                id="emailAddress"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-row">
            <div className="text-base text-primary-input-text flex flex-col text-left w-1/3">
              Number of Seats Required
            </div>
            <div className="flex flex-col w-2/3">
              <TextInput
                className="w-full mb-4"
                placeholder="Enter No. Seats"
                id="seatsRequired"
                value={numSeatsReq}
                onChange={(event) => setNumericVal(event.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-row">
            <div className="text-base text-primary-input-text flex flex-col text-left w-1/3">Seat Numbers</div>
            <div className="flex flex-col w-2/3">
              <TextInput
                className="w-full mb-4"
                placeholder="Seat Numbers"
                id="seatsNumList"
                value={seatNumList}
                onChange={(event) => setSeatNumList(event.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-row">
            <div className="text-base text-primary-input-text flex flex-col text-left w-1/3">Requested by</div>
            <div className="flex flex-col w-2/3">
              <TextInput
                className="w-full mb-4"
                placeholder="Enter Name"
                id="requestedBy"
                value={requestedBy}
                onChange={(event) => setRequestedBy(event.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-row">
            <div className="text-base text-primary-input-text flex flex-col text-left w-1/3">Comments</div>
            <div className="flex flex-col w-2/3">
              <TextInput
                className="w-full mb-4"
                placeholder="Notes Field"
                id="comments"
                value={comments}
                onChange={(event) => setComments(event.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-row">
            <div className="text-base text-primary-input-text flex flex-col text-left w-1/3">Arranged by</div>
            <div className="flex flex-col w-2/3">
              <Select
                className={classNames('w-full !border-0 text-primary-input-text mb-4')}
                options={userList}
                value={arrangedBy}
                onChange={(value) => setArrangedBy(value !== null ? value.toString() : '')}
                placeholder={'Select User'}
                isClearable
                isSearchable
              />
            </div>
          </div>

          <div className="flex flex-row">
            <div className="text-base text-primary-input-text flex flex-col text-left w-1/3">
              Venue
              <br />
              Confirmation
              <br />
              Notes
            </div>
            <div className="flex flex-col">
              <TextArea
                className="w-[300px] h-[80px]"
                value={venueConfNotes}
                placeholder="Notes Field"
                onChange={(e) => setVenueConfNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="place-content-center flex flex-row mt-5 pb-5">
            <Button className="w-32" variant="secondary" text="Cancel" onClick={() => handleConfirm('cancel')} />
            <Button className="ml-4 w-32" onClick={() => handleConfirm('delete')} variant="tertiary" text="Delete" />
            <Button className="ml-4 w-32" variant="primary" text="Save and Close" onClick={null} />
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
