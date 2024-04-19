import { useEffect, useState } from 'react';
import PopupModal from 'components/core-ui-lib/PopupModal';
import TextInput from 'components/core-ui-lib/TextInput';
import Select, { SelectOption } from 'components/core-ui-lib/Select/Select';
import classNames from 'classnames';
import DateInput from 'components/core-ui-lib/DateInput';
import Checkbox from 'components/core-ui-lib/Checkbox';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import Button from 'components/core-ui-lib/Button';

type ActivityModalVariant = 'add' | 'edit';

const titleOptions = {
  add: 'Add New Actvity',
  edit: 'Edit Activity'
}

interface ActivityModalProps {
  show: boolean;
  onCancel: () => void;
  onSave: () => void;
  variant: ActivityModalVariant;
  activityTypes: Array<SelectOption>;
  venueCurrency?: string;
}

export default function ActivityModal({
  show = false,
  onCancel,
  variant,
  onSave,
  activityTypes,
  venueCurrency = '£'
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

  useEffect(() => {
    setVisible(show);
  }, [show]);

  return (
    <PopupModal show={visible} onClose={onCancel} showCloseIcon={true} hasOverlay={false}>
      <div className="h-[526px] w-[404px]">
        <div className="text-xl text-primary-navy font-bold mb-4">{titleOptions[variant]}</div>
        <div className="text-base font-bold text-primary-input-text">Activity Name</div>
        <TextInput
          className="w-full mb-4"
          placeholder='Enter Activity Name'
          id="input"
          value={actName}
          onChange={(event) => setActName(event.target.value)}
        />

        <Select
          className={classNames('w-full !border-0 text-primary-input-text mb-4')}
          options={activityTypes}
          value={actType}
          onChange={(value) => setActType(parseInt(value.toString()))}
          placeholder={'Please select from Venue or Town'}
          isClearable
          isSearchable
          label='Type'
        />

        <div className='flex flex-row mb-4'>
          <div className='flex flex-col'>
            <DateInput
              onChange={(value) => setActDate(value)}
              value={actDate}
              label='Date'
              labelClassName='text-primary-input-text'
            />
          </div>

          <div className='flex flex-col ml-[50px]'>
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
          <div className='flex flex-row mb-3'>
            <div className="text-base font-bold text-primary-input-text flex flex-col">Follow Up Date</div>

            <div className='flex flex-col ml-5 -mt-1'>
              <DateInput
                onChange={(value) => setFollowUpDt(value)}
                value={followUpDt}
                label='Date'
                labelClassName='text-primary-input-text'
              />
            </div>
          </div>
        )}


        <div className='flex flex-row'>
          <div className='flex flex-col mr-[50px]'>
            <div className="text-base font-bold text-primary-input-text">Company Cost</div>
            <div className='flex flex-row'>
              <div className='flex flex-col mr-2'>
                <div className="text-base font-bold text-primary-input-text">{venueCurrency}</div>
              </div>
              <div className='flex flex-col'>
                <TextInput
                  className="w-full mb-4"
                  placeholder='00.00'
                  id="input"
                  value={companyCost}
                  onChange={(event) => setCompanyCost(event.target.value)}
                />
              </div>
            </div>
          </div>

          <div className='flex flex-col'>
            <div className="text-base font-bold text-primary-input-text">Venue Cost</div>
            <div className='flex flex-row'>
              <div className='flex flex-col mr-2'>
                <div className="text-base font-bold text-primary-input-text">{venueCurrency}</div>
              </div>
              <div className='flex flex-col'>
                <TextInput
                  className="w-full mb-4"
                  placeholder='00.00'
                  id="input"
                  value={venueCost}
                  onChange={(event) => setVenueCost(event.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="text-base font-bold text-primary-input-text">Notes</div>
        <TextArea
          className={'mt-2 h-[162px] w-full'}
          value={actNotes}
          placeholder='Notes Field'
          onChange={(e) => setActNotes(e.target.value)}
        />

        <div className="float-right flex flex-row mt-5 py-2">
          <Button className="ml-4 w-[132px]" onClick={onCancel} variant="secondary" text="Cancel" />
          <Button className="ml-4 w-[132px] mr-1" variant="primary" text="Save and Close                " onClick={onSave} />
        </div>

      </div>
    </PopupModal>
  );
}
