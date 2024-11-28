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
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import { hasActivityChanged } from '../utils';
import { ConfDialogVariant } from 'components/core-ui-lib/ConfirmationDialog/ConfirmationDialog';
import { checkDecimalStringFormat, isNull } from 'utils';
import { useRecoilValue } from 'recoil';
import { accessMarketingHome } from 'state/account/selectors/permissionSelector';
import { UTCDate } from '@date-fns/utc';
import { safeDate } from 'services/dateService';

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
  venueCurrency = '',
  bookingId,
  data,
}: Partial<ActivityModalProps>) {
  const permissions = useRecoilValue(accessMarketingHome);
  const [visible, setVisible] = useState<boolean>(show);
  const [actName, setActName] = useState<string>(null);
  const [actType, setActType] = useState<number>(null);
  const [actDate, setActDate] = useState<UTCDate>(null);
  const [actFollowUp, setActFollowUp] = useState<boolean>(false);
  const [followUpDt, setFollowUpDt] = useState<UTCDate>(null);
  const [companyCost, setCompanyCost] = useState<string>();
  const [venueCost, setVenueCost] = useState<string>();
  const [actNotes, setActNotes] = useState<string>();
  const [actId, setActId] = useState(null);
  const [error, setError] = useState<boolean>(false);
  const [confVariant, setConfVariant] = useState<ConfDialogVariant>('close');
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showNameLengthError, setShowNameLengthError] = useState<boolean>(false);
  const canEditActivity = permissions.includes('EDIT_ACTIVITY');

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
      setActDate(!data.Date ? null : safeDate(data.Date));
      setActFollowUp(data.FollowUpRequired);
      setFollowUpDt(!data.DueByDate ? null : safeDate(data.DueByDate));
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
      Date: actDate === null ? null : actDate,
      FollowUpRequired: actFollowUp,
      Name: actName,
      Notes: actNotes,
      DueByDate: actFollowUp ? null : !followUpDt ? null : followUpDt,
    };

    // only add iD if not adding
    if (variant !== 'add') {
      data = { ...data, Id: actId };
    }

    onSave(variant, data);
  };

  const validateCost = (type: string, value: string, precision: number, scale: number) => {
    const regex = /^$|^\d+(\.\d*)?$/;
    if (checkDecimalStringFormat(value, precision, scale, regex)) {
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
        Date: !isNull(actDate) ? actDate : null,
        FollowUpRequired: actFollowUp,
        Name: actName,
        Notes: actNotes,
        DueByDate: actFollowUp ? (isNull(followUpDt) ? null : followUpDt) : null,
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
    setShowNameLengthError(false);
  }, [show]);

  return (
    <div>
      <PopupModal
        show={visible}
        onClose={() => handleConfirm('close')}
        showCloseIcon={true}
        hasOverlay={showConfirm}
        title={titleOptions[variant]}
      >
        <div className="flex gap-x-2 align-middle">
          <div className="text-base font-bold text-primary-input-text">Activity Name</div>
          {showNameLengthError && (
            <div className="text-xs text-primary-red flex items-center">
              Please enter a Name less than 30 characters
            </div>
          )}
        </div>
        <TextInput
          className="w-full mb-4"
          placeholder="Enter Activity Name"
          testId="enter-activity-name"
          id="activityName"
          disabled={!canEditActivity}
          value={actName}
          onChange={(event) => {
            if (event.target.value.length <= 30) {
              setActName(event.target.value);
            } else {
              setShowNameLengthError(true);
            }
          }}
        />

        <Select
          className={classNames('w-full !border-0 text-primary-input-text', error ? 'mb-2' : 'mb-4')}
          testId="select-activity-type"
          options={activityTypes}
          value={actType}
          disabled={!canEditActivity}
          onChange={(value) => changeActivityType(value)}
          placeholder="Please select Activity Type"
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
              testId="new-activity-date"
              inputClass="!border-0 !shadow-none"
              labelClassName="text-primary-input-text"
              disabled={!canEditActivity}
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
              disabled={!canEditActivity}
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
                disabled={!canEditActivity}
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
                  testId="company-cost"
                  placeholder="00.00"
                  id="companyCost"
                  value={companyCost}
                  onChange={(event) => validateCost('companyCost', event.target.value, 8, 2)}
                  disabled={!canEditActivity}
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
                  testId="venue-cost"
                  placeholder="00.00"
                  id="venueCost"
                  value={venueCost}
                  onChange={(event) => validateCost('venueCost', event.target.value, 8, 2)}
                  disabled={!canEditActivity}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="text-base font-bold text-primary-input-text">Notes</div>
        <TextArea
          className="mt-2 h-[162px] w-full"
          testId="activity-notes"
          value={actNotes}
          placeholder="Notes Field"
          onChange={(e) => setActNotes(e.target.value)}
          disabled={!canEditActivity}
        />

        <div className="float-right flex flex-row mt-5 py-2">
          <Button
            className="ml-4 w-[132px]"
            onClick={() => handleConfirm('cancel')}
            variant="secondary"
            text="Cancel"
          />
          <Button
            disabled={!canEditActivity}
            className="ml-4 w-[132px] mr-1"
            variant="primary"
            text="Save and Close"
            onClick={handleSave}
          />
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
