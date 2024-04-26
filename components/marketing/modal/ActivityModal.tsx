import { useEffect, useState } from 'react';
import PopupModal from 'components/core-ui-lib/PopupModal';
import TextInput from 'components/core-ui-lib/TextInput';
import Select, { SelectOption } from 'components/core-ui-lib/Select/Select';
import classNames from 'classnames';
import DateInput from 'components/core-ui-lib/DateInput';
import Checkbox from 'components/core-ui-lib/Checkbox';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import Button from 'components/core-ui-lib/Button';
import { ActivityDTO } from 'interfaces';
import { removeTime } from 'utils';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import { ConfDialogVariant } from 'components/core-ui-lib/ConfirmationDialog/ConfirmationDialog';
import { hasActivityChanged } from '../utils';

export type ActivityModalVariant = 'add' | 'edit' | 'delete';

const titleOptions = {
  add: 'Add New Actvity',
  edit: 'Edit Activity',
};

interface ActivityModalProps {
  show: boolean;
  onCancel: () => void;
  onSave: (variant: ActivityModalVariant, data: ActivityDTO) => void;
  variant: ActivityModalVariant;
  activityTypes: Array<SelectOption>;
  venueCurrency?: string;
  bookingId;
  data?: ActivityDTO;
}

export default function ActivityModal({
  show = false,
  onCancel,
  variant,
  onSave,
  activityTypes,
  venueCurrency = '£',
  bookingId,
  data,
}: Partial<ActivityModalProps>) {
  const [visible, setVisible] = useState<boolean>(show);
  const [actName, setActName] = useState<string>(null);
  const [actType, setActType] = useState<number>(null);
  const [actDate, setActDate] = useState<Date>();
  const [actFollowUp, setActFollowUp] = useState<boolean>(false);
  const [followUpDt, setFollowUpDt] = useState<Date>();
  const [companyCost, setCompanyCost] = useState<string>();
  const [venueCost, setVenueCost] = useState<string>();
  const [actNotes, setActNotes] = useState<string>();
  const [actId, setActId] = useState(null);
  const [error, setError] = useState<boolean>(false);
  const [confVariant, setConfVariant] = useState<ConfDialogVariant>('close');
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const initForm = () => {
    if (variant === 'add') {
      setActName('');
      setActType(null);
      setActDate(null);
      setActFollowUp(false);
      setFollowUpDt(null);
      setCompanyCost('');
      setVenueCost('');
      setActNotes('');
    } else if (variant === 'edit') {
      setActName(data.Name);
      setActType(data.ActivityTypeId);
      setActDate(startOfDay(new Date(data.Date)));
      setActFollowUp(data.FollowUpRequired);
      setFollowUpDt(data.DueByDate === null ? null : startOfDay(new Date(data.DueByDate)));
      setCompanyCost(data.CompanyCost.toString());
      setVenueCost(data.VenueCost.toString());
      setActNotes(data.Notes);
      setActId(data.Id);
    }
  };

  const handleSave = () => {
    // display error if the activity type is not selected
    if (actType === null) {
      setError(true);
      return;
    }

    let data: ActivityDTO = {
      ActivityTypeId: actType,
      BookingId: bookingId,
      CompanyCost: parseFloat(companyCost),
      VenueCost: parseFloat(venueCost),
      Date: startOfDay(new Date(actDate)),
      FollowUpRequired: actFollowUp,
      Name: actName,
      Notes: actNotes,
      DueByDate: actFollowUp ? startOfDay(new Date(followUpDt)) : null,
    };

    // only add iD if not adding
    if (variant !== 'add') {
      data = { ...data, Id: actId };
    }

    onSave(variant, data);
  };

  const setNumbericVal = (type: string, value: string) => {
    const regexPattern = /^-?\d*(\.\d*)?$/;
    // validate value with regex

    if (regexPattern.test(value)) {
      if (type === 'venueCost') {
        setVenueCost(value);
      } else if (type === 'companyCost') {
        setCompanyCost(value);
      }
    }
  };

  const changeActivityType = (value) => {
    setActType(value);
    setError(false);
  };

  const handleConfCancel = () => {
    setShowConfirm(false);
    onCancel();
  };

  const handleConfirm = (type: ConfDialogVariant) => {
    // only check if variant is edit
    if (variant === 'edit') {
      const changedRow: ActivityDTO = {
        ActivityTypeId: actType,
        BookingId: bookingId,
        CompanyCost: parseFloat(companyCost),
        VenueCost: parseFloat(venueCost),
        Date: removeTime(actDate),
        FollowUpRequired: actFollowUp,
        Name: actName,
        Notes: actNotes,
        DueByDate: actFollowUp ? removeTime(followUpDt) : null,
      };

      if (hasActivityChanged(data, changedRow)) {
        setConfVariant(type);
        setShowConfirm(true);
      } else {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  useEffect(() => {
    setVisible(show);
    initForm();
  }, [show, initForm]);

  return (
    <div>
      <PopupModal show={visible} onClose={() => handleConfirm('close')} showCloseIcon={true} hasOverlay={showConfirm}>
        <div className="h-[526px] w-[404px]">
          <div className="text-xl text-primary-navy font-bold mb-4">{titleOptions[variant]}</div>
          <div className="text-base font-bold text-primary-input-text">Activity Name</div>
          <TextInput
            className="w-full mb-4"
            placeholder="Enter Activity Name"
            id="input"
            value={actName}
            onChange={(event) => setActName(event.target.value)}
          />

          <Select
            className={classNames('w-full !border-0 text-primary-input-text', error ? 'mb-2' : 'mb-4')}
            options={activityTypes}
            value={actType}
            onChange={(value) => changeActivityType(value)}
            placeholder={'Please select Activity Type'}
            isClearable
            isSearchable
            label="Type"
          />

          {error && <div className="text text-base text-primary-red mb-4">Please select an Activity Type</div>}

          <div className="flex flex-row mb-4">
            <div className="flex flex-col">
              <DateInput
                onChange={(value) => setActDate(value)}
                value={actDate}
                label="Date"
                inputClass="!border-0 !shadow-none"
                labelClassName="text-primary-input-text"
              />
            </div>

            <div className="flex flex-col ml-[50px]">
              <Checkbox
                className="ml-5 mt-2"
                labelClassName="!text-base text-primary-input-text"
                label="Follow Up Required"
                id="followUpRequired"
                name="followUpRequired"
                checked={actFollowUp}
                onChange={(e) => setActFollowUp(e.target.checked)}
              />
            </div>
          </div>

          {actFollowUp && (
            <div className="flex flex-row mb-3">
              <div className="text-base font-bold text-primary-input-text flex flex-col">Follow Up Date</div>

              <div className="flex flex-col ml-5 -mt-1">
                <DateInput
                  onChange={(value) => setFollowUpDt(value)}
                  value={followUpDt}
                  label="Date"
                  inputClass="!border-0 !shadow-none"
                  labelClassName="text-primary-input-text"
                />
              </div>
            </div>
          )}

          <div className="flex flex-row">
            <div className="flex flex-col mr-[50px]">
              <div className="text-base font-bold text-primary-input-text">Company Cost</div>
              <div className="flex flex-row">
                <div className="flex flex-col mr-2">
                  <div className="text-base font-bold text-primary-input-text">{venueCurrency}</div>
                </div>
                <div className="flex flex-col">
                  <TextInput
                    className="w-full mb-4"
                    placeholder="00.00"
                    id="input"
                    value={companyCost}
                    onChange={(event) => setNumbericVal('companyCost', event.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-base font-bold text-primary-input-text">Venue Cost</div>
              <div className="flex flex-row">
                <div className="flex flex-col mr-2">
                  <div className="text-base font-bold text-primary-input-text">{venueCurrency}</div>
                </div>
                <div className="flex flex-col">
                  <TextInput
                    className="w-full mb-4"
                    placeholder="00.00"
                    id="input"
                    value={venueCost}
                    onChange={(event) => setNumbericVal('venueCost', event.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="text-base font-bold text-primary-input-text">Notes</div>
          <TextArea
            className={'mt-2 h-[162px] w-full'}
            value={actNotes}
            placeholder="Notes Field"
            onChange={(e) => setActNotes(e.target.value)}
          />

          <div className="float-right flex flex-row mt-5 py-2">
            <Button
              className="ml-4 w-[132px]"
              onClick={() => handleConfirm('cancel')}
              variant="secondary"
              text="Cancel"
            />
            <Button className="ml-4 w-[132px] mr-1" variant="primary" text="Save and Close" onClick={handleSave} />
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
