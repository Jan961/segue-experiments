import { useEffect, useMemo, useState } from 'react';
import PopupModal from 'components/core-ui-lib/PopupModal';
import TextInput from 'components/core-ui-lib/TextInput';
import Select, { SelectOption } from 'components/core-ui-lib/Select/Select';
import classNames from 'classnames';
import DateInput from 'components/core-ui-lib/DateInput';
import Checkbox from 'components/core-ui-lib/Checkbox';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import Button from 'components/core-ui-lib/Button';
import { GlobalActivityDTO, VenueDTO } from 'interfaces';
import { startOfDay } from 'date-fns';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import { hasGlobalActivityChanged } from '../utils';
import { ConfDialogVariant } from 'components/core-ui-lib/ConfirmationDialog/ConfirmationDialog';
import { globalModalVenueColDefs, styleProps } from '../table/tableConfig';
import { Table } from 'components/core-ui-lib';
import { isValidDate } from 'services/dateService';
import axios from 'axios';
import LoadingOverlay from 'components/core-ui-lib/LoadingOverlay';
import { useRecoilValue } from 'recoil';
import { accessMarketingHome } from 'state/account/selectors/permissionSelector';

export type ActivityModalVariant = 'add' | 'edit' | 'delete' | 'view';

interface Venue extends VenueDTO {
  date: Date;
}

export interface GlobalActivity extends GlobalActivityDTO {
  VenueIds?: Array<number>;
}

const titleOptions = {
  add: 'Add New Global Actvity',
  edit: 'Edit Global Activity',
  view: 'View Global Activity',
};

interface ActivityModalProps {
  show: boolean;
  onCancel: () => void;
  onSave: (variant: ActivityModalVariant, data: GlobalActivity) => void;
  variant: ActivityModalVariant;
  activityTypes: Array<SelectOption>;
  productionCurrency?: string;
  productionId: number;
  data?: GlobalActivity;
  venues?: Array<Venue>;
  tourWeeks?: Array<SelectOption>;
}

export default function GlobalActivityModal({
  show = false,
  onCancel,
  variant,
  onSave,
  activityTypes,
  productionCurrency = '',
  productionId,
  data,
  venues = [],
  tourWeeks,
}: Partial<ActivityModalProps>) {
  const permissions = useRecoilValue(accessMarketingHome);
  const [visible, setVisible] = useState<boolean>(show);
  const [actName, setActName] = useState<string>(null);
  const [actType, setActType] = useState<number>(null);
  const [actDate, setActDate] = useState<Date>(null);
  const [actFollowUp, setActFollowUp] = useState<boolean>(false);
  const [followUpDt, setFollowUpDt] = useState<Date>();
  const [cost, setCost] = useState<string>('');
  const [actNotes, setActNotes] = useState<string>();
  const [actId, setActId] = useState(null);
  const [error, setError] = useState<boolean>(false);
  const [confVariant, setConfVariant] = useState<ConfDialogVariant>('close');
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [venueColDefs, setVenueColDefs] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [loadingVisible, setLoadingVisible] = useState<boolean>(false);
  const canEditGlobActivity = permissions.includes('EDIT_GLOBAL_ACTIVITY');

  const venueList = useMemo(() => {
    if (venues.length === 0) {
      return [];
    }

    let tempVenueList;
    if (venues === undefined || selectedList === undefined) {
      tempVenueList = venues.map((venue) => {
        return {
          ...venue,
          selected: false,
        };
      });
    } else {
      tempVenueList = venues.map((venue) => {
        return {
          ...venue,
          selected: selectedList?.findIndex((item) => parseInt(item) === venue.Id) !== -1,
        };
      });
    }

    const sortedVenues = tempVenueList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return sortedVenues;
  }, [venues, selectedList]);

  const initForm = async () => {
    let dropList = null;

    if (venues.length === 0 || variant === 'view') {
      dropList = [];
    } else {
      dropList = tourWeeks
        .filter((week) => week.weekNo > 0)
        .map((week) => {
          return {
            text: week.weekNo,
            value: week.value,
            selected: false,
          };
        });
    }

    setVenueColDefs(globalModalVenueColDefs(dropList, selectVenue, multiVenueSelect, variant));
    setLoadingVisible(true);
    if (variant === 'edit' || variant === 'view') {
      clearInputs();
      const response = await axios.get(`/api/marketing/global-activities/venueIds/${data.Id}`);
      const venueIds = response.data.map((rec) => rec.VenueId);

      setActName(data.Name);
      setActType(data.ActivityTypeId);
      setActDate(isValidDate(data.Date) ? startOfDay(new Date(data.Date)) : null);
      setActFollowUp(data.FollowUpRequired);
      setFollowUpDt(isValidDate(data.DueByDate) ? startOfDay(new Date(data.DueByDate)) : null);
      setCost(isNaN(data.Cost) ? '' : data.Cost.toFixed(2).toString());
      setActNotes(data.Notes);
      setActId(data.Id);
      setSelectedList(venueIds);
    }
    setLoadingVisible(false);
  };

  const selectVenue = (data, value) => {
    // if top checkbox is clicked
    if (data.Id === 0) {
      // if checked select all
      if (value) {
        const allIds = venueList.map((venue) => venue.Id);
        allIds.push(0);
        setSelectedList(allIds);
      } else {
        // else unchecked unselect all
        setSelectedList([]);
      }
    } else {
      setSelectedList((prevSelectedList) => {
        if (prevSelectedList.includes(data.Id) && !value) {
          return prevSelectedList.filter((i) => i !== data.Id);
        } else {
          return [...prevSelectedList, data.Id];
        }
      });
    }
  };

  const multiVenueSelect = (value) => {
    setSelectedList([]);
    const compareToEpoch = new Date(value).getTime();
    const tempSelectedIndexList = [];
    venueList.forEach((venue) => {
      if (new Date(venue.date).getTime() >= compareToEpoch) {
        tempSelectedIndexList.push(venue.Id);
      }
    });

    setSelectedList((prevSelectedList) => [...prevSelectedList, ...tempSelectedIndexList]);
  };

  const clearInputs = () => {
    setActName('');
    setActType(null);
    setActDate(null);
    setActFollowUp(false);
    setFollowUpDt(null);
    setActNotes('');
    setCost('');
  };

  const handleSave = () => {
    // display error if the activity type is not selected
    setLoadingVisible(true);
    if (actType === null) {
      setError(true);
      return;
    }

    let data: GlobalActivity = {
      ActivityTypeId: actType,
      Cost: parseFloat(cost),
      Date: actDate === null ? null : startOfDay(new Date(actDate)),
      FollowUpRequired: actFollowUp,
      Name: actName,
      Notes: actNotes,
      DueByDate: actFollowUp ? startOfDay(new Date(followUpDt)) : null,
      ProductionId: productionId,
      VenueIds: selectedList,
    };

    // only add iD if not adding
    if (variant !== 'add') {
      data = { ...data, Id: actId };
    }
    setLoadingVisible(false);
    onSave(variant, data);
  };

  const setCostValue = (value: string) => {
    const regexPattern = /^-?\d*(\.\d*)?$/;
    // validate value with regex

    if (regexPattern.test(value)) {
      setCost(value);
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
      const changedRow: GlobalActivity = {
        ActivityTypeId: actType,
        ProductionId: productionId,
        Cost: parseFloat(cost),
        Date: startOfDay(new Date(actDate)),
        FollowUpRequired: actFollowUp,
        Name: actName,
        Notes: actNotes,
        DueByDate: actFollowUp ? startOfDay(new Date(followUpDt)) : null,
        VenueIds: selectedList,
      };

      if (hasGlobalActivityChanged(data, changedRow)) {
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
    setSelectedList([]);

    if (typeof data === 'object') {
      initForm();
    }
  }, [show]);

  return (
    <div>
      <PopupModal show={visible} onClose={() => handleConfirm('close')} showCloseIcon={true} hasOverlay={showConfirm}>
        {loadingVisible && <LoadingOverlay />}
        <div className={`h-[${variant === 'view' ? 400 : 780}px] w-[450px]`}>
          <div className="text-xl text-primary-navy font-bold mb-4">{titleOptions[variant]}</div>
          <div className="text-base font-bold text-primary-input-text">Activity Name</div>
          <TextInput
            className="w-full mb-4"
            placeholder="Enter Activity Name"
            id="activityName"
            value={actName}
            onChange={(event) => setActName(event.target.value)}
            disabled={variant === 'view' || !canEditGlobActivity}
          />

          <Select
            className={classNames('w-full !border-0 text-primary-input-text', error ? 'mb-2' : 'mb-4')}
            options={activityTypes}
            value={actType}
            onChange={(value) => changeActivityType(value)}
            placeholder="Please select Activity Type"
            isClearable
            isSearchable
            label="Type"
            disabled={variant === 'view' || !canEditGlobActivity}
            variant={variant === 'view' ? 'transparent' : 'colored'}
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
                disabled={variant === 'view' || !canEditGlobActivity}
              />
            </div>

            <div className="flex flex-col ml-[110px]">
              <Checkbox
                className="ml-5 mt-2"
                labelClassName="!text-base text-primary-input-text"
                label="Follow Up Required"
                id="followUpRequired"
                name="followUpRequired"
                checked={actFollowUp}
                onChange={(e) => setActFollowUp(e.target.checked)}
                disabled={variant === 'view' || !canEditGlobActivity}
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
                  disabled={variant === 'view' || !canEditGlobActivity}
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex flex-row">
              <div className="text-base font-bold text-primary-input-text flex">Cost</div>
            </div>
            <div className="flex flex-row">
              <div className="flex flex-col mr-3">
                <div className="text-base font-bold text-primary-input-text">{productionCurrency}</div>
              </div>
              <div className="flex flex-col">
                <TextInput
                  className="w-full mb-4"
                  placeholder="00.00"
                  id="cost"
                  value={cost}
                  onChange={(event) => setCostValue(event.target.value)}
                  disabled={variant === 'view' || !canEditGlobActivity}
                />
              </div>
            </div>
          </div>

          <div className="text-base font-bold text-primary-input-text">Notes</div>
          <TextArea
            className="mt-2 mb-2 w-full h-auto"
            value={actNotes}
            placeholder="Notes Field"
            onChange={(e) => setActNotes(e.target.value)}
            disabled={variant === 'view' || !canEditGlobActivity}
            defaultDisabled={false}
          />

          {variant !== 'view' && (
            <div className="flex flex-row text-base text-primary-input-text -mb-2">
              Select all venues you wish to apply global activity to:
            </div>
          )}

          <div className="flex flex-row mt-5">
            <div className="w-[450px]">
              <Table columnDefs={venueColDefs} rowData={venueList} styleProps={styleProps} tableHeight={300} />
            </div>
          </div>

          {variant === 'view' ? (
            <div className="float-right flex flex-row mt-5 py-2">
              <Button
                className="ml-4 w-[132px]"
                onClick={() => handleConfirm('close')}
                variant="primary"
                text="Close"
              />
            </div>
          ) : (
            <div className="float-right flex flex-row mt-5 py-2">
              <Button
                className="ml-4 w-[132px]"
                onClick={() => handleConfirm('cancel')}
                variant="secondary"
                text="Cancel"
              />
              <Button
                className="ml-4 w-[132px] mr-1"
                variant="primary"
                text="Save and Close"
                onClick={handleSave}
                disabled={!canEditGlobActivity}
              />
            </div>
          )}
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
