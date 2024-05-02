import { useEffect, useState } from 'react';
import Table from 'components/core-ui-lib/Table';
import { SelectOption } from '../MarketingHome';
import { ActivityDTO, ActivityTypeDTO } from 'interfaces';
import ActivityModal, { ActivityModalVariant } from '../modal/ActivityModal';
import useAxios from 'hooks/useAxios';
import { startOfDay } from 'date-fns';
import { activityColDefs, styleProps } from '../table/tableConfig';
import { hasActivityChanged, reverseDate } from '../utils';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import TextInput from 'components/core-ui-lib/TextInput';
import Button from 'components/core-ui-lib/Button';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import DateInput from 'components/core-ui-lib/DateInput';
import { ConfDialogVariant } from 'components/core-ui-lib/ConfirmationDialog/ConfirmationDialog';
import Checkbox from 'components/core-ui-lib/Checkbox';
import Select from 'components/core-ui-lib/Select';
import classNames from 'classnames';
import { useRecoilState, useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import { bookingJumpState } from 'state/marketing/bookingJumpState';

type ActivityList = {
  activities: Array<ActivityDTO>;
  activityTypes: Array<ActivityTypeDTO>;
};

interface ActivitiesTabProps {
  bookingId: string;
}

const approvalStatusList = [
  { text: 'Pending Approval', value: 'P' },
  { text: 'Approved', value: 'A' },
  { text: 'Not Approved', value: 'N' },
];

export default function ActivitiesTab({ bookingId }: ActivitiesTabProps) {
  const [actTypeList, setActTypeList] = useState<Array<SelectOption>>(null);
  const [actColDefs, setActColDefs] = useState([]);
  const [actRowData, setActRowData] = useState([]);
  const [actRow, setActRow] = useState<ActivityDTO>();
  const [actModalVariant, setActModalVariant] = useState<ActivityModalVariant>();
  const [approvalStatus, setApprovalStatus] = useState<string>();
  const [changeDate, setChangeDate] = useState<Date>();
  const [changeNotes, setChangeNotes] = useState<string>();
  const [onSaleCheck, setOnSaleCheck] = useState<boolean>(false);
  const [onSaleFromDt, setOnSaleFromDt] = useState<Date>(null);
  const [marketingPlansCheck, setMarketingPlansCheck] = useState<boolean>(false);
  const [printReqCheck, setPrintReqCheck] = useState<boolean>(false);
  const [contactInfoCheck, setContactInfoCheck] = useState<boolean>(false);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [totalVenueCost, setTotalVenueCost] = useState<number>(0);
  const [totalCompanyCost, setTotalCompanyCost] = useState<number>(0);
  const [currency, setCurrency] = useState('£');
  const [showActivityModal, setShowActivityModal] = useState<boolean>(false);
  const [bookingIdVal, setBookingIdVal] = useState(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [confVariant, setConfVariant] = useState<ConfDialogVariant>('delete');

  const { selected: productionId } = useRecoilValue(productionJumpState);
  const bookings = useRecoilState(bookingJumpState);

  const { fetchData } = useAxios();

  const getActivities = async (bookingId: string) => {
    alert(bookingId);
    const data = await fetchData({
      url: '/api/marketing/activities/' + bookingId,
      method: 'POST',
    });

    if (typeof data === 'object') {
      const activityList = data as ActivityList;

      const actTypes = activityList.activityTypes.map((type) => ({
        text: type.Name,
        value: type.Id,
      }));

      setActTypeList(actTypes);

      setActColDefs(activityColDefs(activityUpdate, currency));

      const sortedActivities = activityList.activities.sort(
        (a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime(),
      );

      const tempRows = sortedActivities.map((act) => ({
        actName: act.Name,
        actType: actTypes.find((type) => type.value === act.ActivityTypeId)?.text,
        actDate: startOfDay(new Date(act.Date)),
        followUpCheck: act.FollowUpRequired,
        followUpDt: act.DueByDate,
        companyCost: act.CompanyCost,
        venueCost: act.VenueCost,
        notes: act.Notes,
        bookingId: act.BookingId,
        id: act.Id,
      }));

      calculateActivityTotals(tempRows);
      setActRowData(tempRows);
    }
  };

  const calculateActivityTotals = (tableRows) => {
    const { venueTotal, companyTotal } = tableRows.reduce(
      (acc, row) => {
        acc.venueTotal += row.venueCost;
        acc.companyTotal += row.companyCost;
        return acc;
      },
      { venueTotal: 0, companyTotal: 0 },
    );

    const totalCost = venueTotal + companyTotal;

    setTotalCompanyCost(companyTotal);
    setTotalVenueCost(venueTotal);
    setTotalCost(totalCost);
  };

  const addActivity = () => {
    setActModalVariant('add');
    setShowActivityModal(true);
  };

  const activityUpdate = async (variant: ActivityModalVariant, data) => {
    setActModalVariant(variant);

    // we need to do an api call to get a list of activity types
    // the useState variable with activity type is set after activityUpdate is passed in the col defs
    const activityData = await fetchData({
      url: '/api/marketing/activities/' + bookingIdVal,
      method: 'POST',
    });

    if (typeof activityData === 'object') {
      const activityList = activityData as ActivityList;
      const actTypes = activityList.activityTypes;

      const tempAct: ActivityDTO = {
        ActivityTypeId: actTypes.find((type) => type.Name === data.actType).Id,
        BookingId: data.bookingId,
        CompanyCost: data.companyCost,
        VenueCost: data.venueCost,
        Date: data.actDate,
        FollowUpRequired: data.followUpCheck,
        Name: data.actName,
        Notes: data.notes,
        DueByDate:
          data.followUpDt && reverseDate(data.followUpDt) !== '' ? new Date(reverseDate(data.followUpDt)) : null,
        Id: data.id,
      };

      setActRow(tempAct);

      if (variant === 'edit') {
        setShowActivityModal(true);
      } else if (variant === 'delete') {
        setConfVariant('delete');
        setShowConfirm(true);
      }
    }
  };

  const saveActivity = async (variant: ActivityModalVariant, data: ActivityDTO) => {
    if (variant === 'add') {
      await fetchData({
        url: '/api/marketing/activities/create',
        method: 'POST',
        data,
      });

      const newRow = {
        actName: data.Name,
        actType: actTypeList.find((type) => type.value === data.ActivityTypeId).text,
        actDate: data.Date,
        followUpCheck: data.FollowUpRequired,
        followUpDt: data.DueByDate,
        companyCost: data.CompanyCost,
        venueCost: data.VenueCost,
        notes: data.Notes,
        bookingId: data.BookingId,
      };

      const activityData = [...actRowData, newRow];

      // re sort the rows to ensure the new field is put in the correct place chronologically
      const sortedActivities = activityData.sort(
        (a, b) => new Date(a.actDate).getTime() - new Date(b.actDate).getTime(),
      );

      setActRowData(sortedActivities);
      calculateActivityTotals(sortedActivities);
      setShowActivityModal(false);
    } else if (variant === 'edit') {
      if (hasActivityChanged(actRow, data)) {
        await fetchData({
          url: '/api/marketing/activities/update',
          method: 'POST',
          data,
        });

        const updatedRow = {
          actName: data.Name,
          actType: actTypeList.find((type) => type.value === data.ActivityTypeId).text,
          actDate: data.Date,
          followUpCheck: data.FollowUpRequired,
          followUpDt: data.DueByDate,
          companyCost: data.CompanyCost,
          venueCost: data.VenueCost,
          notes: data.Notes,
          bookingId: data.BookingId,
        };

        const rowIndex = actRowData.findIndex((act) => act.id === data.Id);
        const newRows = [...actRowData];
        newRows[rowIndex] = updatedRow;

        // re sort the rows to ensure the new field is put in the correct place chronologically
        const sortedActivities = newRows.sort((a, b) => new Date(a.actDate).getTime() - new Date(b.actDate).getTime());

        calculateActivityTotals(sortedActivities);
        setActRowData(sortedActivities);

        setShowActivityModal(false);
      } else {
        setShowActivityModal(false);
      }
    } else if (variant === 'delete') {
      await fetchData({
        url: '/api/marketing/activities/delete',
        method: 'POST',
        data,
      });

      const rowIndex = actRowData.findIndex((act) => act.id === data.Id);
      const newRows = [...actRowData];
      if (rowIndex !== -1) {
        newRows.splice(rowIndex, 1);
      }

      calculateActivityTotals(newRows);
      setActRowData(newRows);
      setShowConfirm(false);
    }
  };

  useEffect(() => {
    if (bookingId !== null && bookingId !== undefined) {
      setCurrency('£');
      setBookingIdVal(bookingId);
      getActivities(bookingId.toString());
      // set checkbox row on activities tab
      const booking = bookings[0].bookings.find((booking) => booking.Id === bookingId);
      setOnSaleCheck(booking.TicketsOnSale);
      setMarketingPlansCheck(booking.MarketingPlanReceived);
      setPrintReqCheck(booking.PrintReqsReceived);
      setContactInfoCheck(booking.ContactInfoReceived);
      setOnSaleFromDt(booking.TicketsOnSaleFromDate);
    }
  }, [bookingId]);

  return (
    <>
      <div className="flex flex-row mb-5 gap-[45px]">
        <div className="flex flex-row mt-1">
          <Checkbox
            id={'On Sale'}
            name={'On Sale'}
            checked={onSaleCheck}
            onChange={null}
            className="w-[19px] h-[19px] mt-[2px]"
            disabled={true}
          />
          <div className="text-base text-primary-input-text font-bold ml-2">On Sale</div>
        </div>

        <div className="flex flex-row">
          <div className="text-base text-primary-input-text font-bold mt-1 mr-2">Due to go On Sale</div>
          <DateInput onChange={null} value={onSaleFromDt} disabled={true} />
        </div>

        <div className="flex flex-row mt-1">
          <Checkbox
            id={'Marketing Plans Received'}
            name={'Marketing Plans Received'}
            checked={marketingPlansCheck}
            onChange={null}
            disabled={true}
            className="w-[19px] h-[19px] mt-[2px]"
          />
          <div className="text-base text-primary-input-text font-bold ml-2">Marketing Plans Received</div>
        </div>

        <div className="flex flex-row mt-1">
          <Checkbox
            id={'Print Requirements Received'}
            name={'Print Requirements Received'}
            checked={printReqCheck}
            onChange={null}
            disabled={true}
            className="w-[19px] h-[19px] mt-[2px]"
          />
          <div className="text-base text-primary-input-text font-bold ml-2">Print Requirements Received</div>
        </div>

        <div className="flex flex-row mt-1">
          <Checkbox
            id={'Contact Info Received'}
            name={'Contact Info Received'}
            checked={contactInfoCheck}
            onChange={null}
            disabled={true}
            className="w-[19px] h-[19px] mt-[2px]"
          />
          <div className="text-base text-primary-input-text font-bold ml-2">Contact Info Received</div>
        </div>
      </div>
      <div className="flex flex-row">
        <div className="flex flex-col w-[906px] h-[75px] bg-primary-green/[0.30] rounded-xl mb-5 mr-5 px-2">
          <div className="flex flex-row">
            <div className="flex flex-col">
              <div className="leading-6 text-xl text-primary-input-text font-bold mt-1 flex-row">Marketing Costs</div>

              <Select
                className={classNames('w-72 !border-0 text-primary-navy mt-1')}
                options={approvalStatusList}
                value={approvalStatus}
                onChange={(value) => setApprovalStatus(value.toString())}
                placeholder={'Select Approval Status'}
                isClearable={false}
              />
            </div>
            <div className="flex flex-col mt-8 ml-8">
              <DateInput onChange={(value) => setChangeDate(value)} value={changeDate} />
            </div>
            <div className="flex flex-col ml-8 mt-1">
              <TextArea
                className={'mt-2 h-[52px] w-[425px]'}
                value={changeNotes}
                placeholder="Notes Field"
                onChange={(e) => setChangeNotes(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <Button
            text="Activity Report"
            className="w-[160px] mb-[12px]"
            disabled={!productionId}
            iconProps={{ className: 'h-4 w-3' }}
            sufixIconName={'excel'}
          />
          <Button text="Add New Activity" className="w-[160px]" onClick={addActivity} />
        </div>
      </div>
      <div className="w-[1086px] h-[500px]">
        <Table columnDefs={actColDefs} rowData={actRowData} styleProps={styleProps} />

        <div className="flex flex-col w-[487px] h-[69px] bg-primary-green/[0.30] rounded-xl mt-5 px-2 float-right">
          <div className="flex flex-row gap-4">
            <div className="flex flex-col text-center">
              <div className="text-base font-bold text-primary-input-text">Total Cost</div>
              <TextInput
                className="w-[146px]"
                placeholder="0.00"
                id="input"
                value={currency + totalCost.toFixed(2)}
                disabled={true}
                onChange={null}
              />
            </div>
            <div className="flex flex-col text-center">
              <div className="text-base font-bold text-primary-input-text">Company</div>
              <TextInput
                className="w-[146px]"
                placeholder="0.00"
                id="input"
                value={currency + totalCompanyCost.toFixed(2)}
                disabled={true}
                onChange={null}
              />
            </div>
            <div className="flex flex-col text-center">
              <div className="text-base font-bold text-primary-input-text">Venue</div>
              <TextInput
                className="w-[146px]"
                placeholder="0.00"
                id="input"
                value={currency + totalVenueCost.toFixed(2)}
                disabled={true}
                onChange={null}
              />
            </div>
          </div>
        </div>
      </div>

      <ActivityModal
        show={showActivityModal}
        onCancel={() => setShowActivityModal(false)}
        variant={actModalVariant}
        activityTypes={actTypeList}
        onSave={(variant, data) => saveActivity(variant, data)}
        bookingId={bookingIdVal}
        data={actRow}
      />

      <ConfirmationDialog
        variant={confVariant}
        show={showConfirm}
        onYesClick={() => saveActivity('delete', actRow)}
        onNoClick={() => setShowConfirm(false)}
        hasOverlay={false}
      />
    </>
  );
}
