import { forwardRef, useEffect, useImperativeHandle, useState, useMemo } from 'react';
import { SelectOption } from '../MarketingHome';
import { ActivityDTO, ActivityTypeDTO, GlobalActivityDTO } from 'interfaces';
import ActivityModal, { ActivityModalVariant } from '../modal/ActivityModal';
import useAxios from 'hooks/useAxios';
import { startOfDay } from 'date-fns';
import { activityColDefs, globalActivityTabColDefs, styleProps } from '../table/tableConfig';
import { hasActivityChanged } from '../utils';
import ConfirmationDialog, { ConfDialogVariant } from 'components/core-ui-lib/ConfirmationDialog/ConfirmationDialog';
import { useRecoilState, useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import Checkbox from 'components/core-ui-lib/Checkbox';
import DateInput from 'components/core-ui-lib/DateInput';
import Select from 'components/core-ui-lib/Select';
import classNames from 'classnames';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import Button from 'components/core-ui-lib/Button';
import Table from 'components/core-ui-lib/Table';
import { isNullOrEmpty } from 'utils';
import { Spinner } from 'components/global/Spinner';
import { currencyState } from 'state/marketing/currencyState';
import { exportExcelReport } from 'components/bookings/modal/request';
import { notify } from 'components/core-ui-lib';
import GlobalActivityModal, { GlobalActivity } from '../modal/GlobalActivityModal';

interface ActivitiesTabProps {
  bookingId: string;
}

export interface ActivityTabRef {
  resetData: () => void;
}

type ActivityList = {
  activities: Array<ActivityDTO>;
  activityTypes: Array<ActivityTypeDTO>;
};

type GlobalActivityList = {
  activities: Array<GlobalActivity>;
};

const approvalStatusList = [
  { text: 'Pending Approval', value: 'P' },
  { text: 'Approved', value: 'A' },
  { text: 'Not Approved', value: 'N' },
];

const ActivitiesTab = forwardRef<ActivityTabRef, ActivitiesTabProps>((props, ref) => {
  const [actTypeList, setActTypeList] = useState<Array<SelectOption>>(null);
  const [actColDefs, setActColDefs] = useState([]);
  const [actRowData, setActRowData] = useState([]);
  const [globalRowData, setGlobalRowData] = useState([]);
  const [globalColDefs, setGlobalColDefs] = useState([]);
  const [globalTotalCost, setGlobalTotalCost] = useState<number>(0);
  const [globalVenueShareCost, setGlobalVenueShareCost] = useState<number>(0);
  const [actRow, setActRow] = useState<ActivityDTO>();
  const [globalActRow, setGlobalActRow] = useState<GlobalActivityDTO>();
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
  const [showActivityModal, setShowActivityModal] = useState<boolean>(false);
  const [showGlobalActivityModal, setShowGlobalActivityModal] = useState<boolean>(false);
  const [dataAvailable, setDataAvailable] = useState<boolean>(false);
  const [bookingIdVal, setBookingIdVal] = useState(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [confVariant, setConfVariant] = useState<ConfDialogVariant>('delete');
  const [bookings, setBookings] = useRecoilState(bookingJumpState);
  const currency = useRecoilValue(currencyState);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { selected: productionId, productions } = useRecoilValue(productionJumpState);

  useImperativeHandle(ref, () => ({
    resetData: () => {
      setDataAvailable(false);
    },
  }));

  const { fetchData } = useAxios();

  const venueList = useMemo(() => {
    try {
      const venues = bookings.bookings.map((option) => {
        return {
          ...option.Venue,
          date: new Date(option.Date),
        };
      });

      return venues;
    } catch (error) {
      console.log(error);
    }
  }, [bookings.bookings]);

  const getActivities = async (bookingId: string) => {
    try {
      setActColDefs(activityColDefs(activityUpdate, currency.symbol));
      setGlobalColDefs(globalActivityTabColDefs(viewGlobalActivity, currency.symbol));

      const data = await fetchData({
        url: '/api/marketing/activities/' + bookingId,
        method: 'POST',
      });

      if (typeof data !== 'object') {
        return;
      }

      const activityData = data as ActivityList;
      const actTypes = activityData.activityTypes.map((type) => ({
        text: type.Name,
        value: type.Id,
      }));

      setActTypeList(actTypes);

      const sortedActivities = activityData.activities.sort(
        (a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime(),
      );

      const tempRows = sortedActivities.map((act) => ({
        actName: act.Name,
        actType: actTypes.find((type) => type.value === act.ActivityTypeId)?.text,
        actDate: act.Date === '' ? null : startOfDay(new Date(act.Date)),
        followUpCheck: act.FollowUpRequired,
        followUpDt: act.DueByDate === '' ? null : startOfDay(new Date(act.DueByDate)),
        companyCost: act.CompanyCost,
        venueCost: act.VenueCost,
        notes: act.Notes,
        bookingId: act.BookingId,
        id: act.Id,
      }));

      calculateActivityTotals(tempRows);
      setActRowData(tempRows);

      const venueId = bookings.bookings.find((booking) => booking.Id === bookings.selected)?.Venue?.Id;

      const globResponse = await fetchData({
        url: '/api/marketing/globalActivities/venue/' + venueId,
        method: 'POST',
      });

      if (typeof globResponse !== 'object') {
        return;
      }

      const globalActivities = globResponse as GlobalActivityList;

      const tempGlobList = globalActivities.activities.map((act) => ({
        actName: act.Name,
        actType: actTypes.find((type) => type.value === act.ActivityTypeId)?.text,
        actDate: startOfDay(new Date(act.Date)),
        followUpCheck: act.FollowUpRequired,
        followUpDt: act.DueByDate === '' ? null : startOfDay(new Date(act.DueByDate)),
        cost: act.Cost,
        id: act.Id,
        notes: act.Notes,
        venueIds: act.VenueIds,
      }));

      setGlobalTotalCost(globalActivities.activities.reduce((sum, item) => sum + item.Cost, 0));

      setGlobalRowData(tempGlobList);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const viewGlobalActivity = async (data) => {
    const accTypeResponse = await fetchData({
      url: '/api/marketing/activities/' + bookings.selected.toString(),
      method: 'POST',
    });

    if (typeof accTypeResponse !== 'object') {
      return;
    }

    const activityData = accTypeResponse as ActivityList;
    const actTypes = activityData.activityTypes.map((type) => ({
      text: type.Name,
      value: type.Id,
    }));

    const tempGlobAct: GlobalActivity = {
      ActivityTypeId: actTypes.find((type) => type.text === data.actType).value,
      Cost: data.cost,
      Date: data.actDate,
      FollowUpRequired: data.followUpCheck,
      Name: data.actName,
      Notes: data.notes,
      DueByDate: data.followUpCheck ? new Date(data.followUpDt) : null,
      Id: data.id,
      ProductionId: productionId,
      VenueIds: data.venueIds,
    };

    setGlobalActRow(tempGlobAct);
    setShowGlobalActivityModal(true);
  };

  const calculateActivityTotals = (tableRows) => {
    if (tableRows.length === 0) {
      setTotalCompanyCost(0);
      setTotalVenueCost(0);
      setTotalCost(0);
    } else {
      const { venueTotal, companyTotal } = tableRows.reduce(
        (acc, row) => {
          acc.venueTotal += parseFloat(row.venueCost);
          acc.companyTotal += parseFloat(row.companyCost);
          return acc;
        },
        { venueTotal: 0, companyTotal: 0 },
      );

      setTotalCompanyCost(companyTotal);
      setTotalVenueCost(venueTotal);
      setTotalCost(venueTotal + companyTotal);
    }
  };

  const addActivity = () => {
    setActModalVariant('add');
    setShowActivityModal(true);
  };

  const activityUpdate = async (variant: ActivityModalVariant, data) => {
    setActModalVariant(variant);

    try {
      const actData = await fetchData({
        url: '/api/marketing/activities/' + props.bookingId.toString(),
        method: 'POST',
      });

      if (typeof actData !== 'object') {
        return;
      }

      const activityData = actData as ActivityList;
      const actTypes = activityData.activityTypes;

      const tempAct: ActivityDTO = {
        ActivityTypeId: actTypes.find((type) => type.Name === data.actType).Id,
        BookingId: data.bookingId,
        CompanyCost: data.companyCost,
        VenueCost: data.venueCost,
        Date: data.actDate,
        FollowUpRequired: data.followUpCheck,
        Name: data.actName,
        Notes: data.notes,
        DueByDate: data.followUpCheck ? (data.followUpDt === null ? null : new Date(data.followUpDt)) : null,
        Id: data.id,
      };

      setActRow(tempAct);

      if (variant === 'edit') {
        setShowActivityModal(true);
      } else if (variant === 'delete') {
        setConfVariant('delete');
        setShowConfirm(true);
      }
    } catch (error) {
      console.log(error);
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
          id: data.Id,
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

  const editBooking = async (field: string, value: any) => {
    // Mapping of local state fields to booking object fields
    const fieldMapping = {
      ticketsOnSale: 'TicketsOnSale',
      marketingPlanReceived: 'MarketingPlanReceived',
      printReqsReceived: 'PrintReqsReceived',
      contactInfoReceived: 'ContactInfoReceived',
      ticketsOnSaleFromDate: 'TicketsOnSaleFromDate',
      marketingCostsNotes: 'MarketingCostsNotes',
      marketingCostsApprovalDate: 'MarketingCostsApprovalDate',
      marketingCostsStatus: 'MarketingCostsStatus',
    };

    // Find the booking index
    const bookingIndex = bookings.bookings.findIndex((booking) => booking.Id === props.bookingId);

    // Create a new bookings array with the updated booking
    const newBookings = bookings.bookings.map((booking, index) => {
      if (index === bookingIndex) {
        return {
          ...booking,
          [fieldMapping[field]]: value,
        };
      }
      return booking;
    });

    // Update the local state based on the field being edited
    switch (field) {
      case 'ticketsOnSale':
        setOnSaleCheck(value);
        break;
      case 'marketingPlanReceived':
        setMarketingPlansCheck(value);
        break;
      case 'printReqsReceived':
        setPrintReqCheck(value);
        break;
      case 'contactInfoReceived':
        setContactInfoCheck(value);
        break;
      case 'ticketsOnSaleFromDate':
        setOnSaleFromDt(value);
        break;
      case 'marketingCostsNotes':
        setChangeNotes(value);
        break;
      case 'marketingCostsApprovalDate':
        setChangeDate(value);
        break;
      case 'marketingCostsStatus':
        setApprovalStatus(value);
        break;
    }

    // Update the bookings state with the new bookings array
    setBookings({ bookings: newBookings, selected: bookings.selected });

    // Update in the database
    await fetchData({
      url: '/api/bookings/update/' + props.bookingId.toString(),
      method: 'POST',
      data: { [field]: value },
    });
  };

  useEffect(() => {
    if (!isNullOrEmpty(props.bookingId)) {
      setBookingIdVal(props.bookingId);
      getActivities(props.bookingId.toString());

      // just a temp measure until RCK advises
      setGlobalVenueShareCost(0);

      // set checkbox row on activities tab
      const booking = bookings.bookings.find((booking) => booking.Id === props.bookingId);

      setOnSaleCheck(booking.TicketsOnSale);
      setMarketingPlansCheck(booking.MarketingPlanReceived);
      setPrintReqCheck(booking.PrintReqsReceived);
      setContactInfoCheck(booking.ContactInfoReceived);
      setOnSaleFromDt(booking.TicketsOnSaleFromDate);
      setChangeDate(booking.MarketingCostsApprovalDate);
      setApprovalStatus(booking.MarketingCostsStatus);
      setChangeNotes(booking.MarketingCostsNotes);

      setDataAvailable(true);
    }
  }, [props.bookingId]);

  const onExport = async () => {
    const urlPath = `/api/reports/marketing/activities/${props.bookingId}`;
    const selectedVenue = bookings.bookings?.filter((booking) => booking.Id === bookings.selected);
    const venueAndDate = selectedVenue?.[0]?.Venue?.Code + ' ' + selectedVenue?.[0]?.Venue?.Name;
    const selectedProduction = productions?.filter((production) => production.Id === productionId);
    const { ShowName, ShowCode, Code } = selectedProduction[0];
    const productionName = `${ShowCode + Code} ${ShowName}`;
    const payload = {
      productionName,
      venueAndDate,
    };
    const downloadContactNotesReport = async () =>
      await exportExcelReport(
        urlPath,
        payload,
        `${productionName} ${selectedVenue?.[0]?.Venue?.Name} Marketing Activities`,
      );
    notify.promise(downloadContactNotesReport(), {
      loading: 'Generating activities report',
      success: 'Activities report downloaded successfully',
      error: 'Error generating activities report',
    });
  };

  return (
    <>
      {dataAvailable && (
        <div>
          {isLoading ? (
            <div className="mt-[150px] text-center">
              <Spinner size="lg" className="mr-3" />
            </div>
          ) : (
            <div>
              <div className="flex flex-row mb-5 gap-[45px]">
                <div className="flex flex-row mt-1">
                  <Checkbox
                    id="On Sale"
                    name="On Sale"
                    checked={onSaleCheck}
                    onChange={(e) => editBooking('ticketsOnSale', e.target.checked)}
                    className="w-[19px] h-[19px] mt-[2px]"
                  />
                  <div className="text-base text-primary-input-text font-bold ml-2">On Sale</div>
                </div>

                <div className="flex flex-row">
                  <div className="text-base text-primary-input-text font-bold mt-1 mr-2">Due to go On Sale</div>
                  <DateInput onChange={(value) => editBooking('ticketsOnSaleFromDate', value)} value={onSaleFromDt} />
                </div>

                <div className="flex flex-row mt-1">
                  <Checkbox
                    id="Marketing Plans Received"
                    name="Marketing Plans Received"
                    checked={marketingPlansCheck}
                    onChange={(e) => editBooking('marketingPlanReceived', e.target.checked)}
                    className="w-[19px] h-[19px] mt-[2px]"
                  />
                  <div className="text-base text-primary-input-text font-bold ml-2">Marketing Plans Received</div>
                </div>

                <div className="flex flex-row mt-1">
                  <Checkbox
                    id="Print Requirements Received"
                    name="Print Requirements Received"
                    checked={printReqCheck}
                    onChange={(e) => editBooking('printReqsReceived', e.target.checked)}
                    className="w-[19px] h-[19px] mt-[2px]"
                  />
                  <div className="text-base text-primary-input-text font-bold ml-2">Print Requirements Received</div>
                </div>

                <div className="flex flex-row mt-1">
                  <Checkbox
                    id="Contact Info Received"
                    name="Contact Info Received"
                    checked={contactInfoCheck}
                    onChange={(e) => editBooking('contactInfoReceived', e.target.checked)}
                    className="w-[19px] h-[19px] mt-[2px]"
                  />
                  <div className="text-base text-primary-input-text font-bold ml-2">Contact Info Received</div>
                </div>
              </div>
              <div className="flex flex-row">
                <div className="flex flex-col w-[906px] h-[75px] bg-primary-green/[0.30] rounded-xl mb-5 mr-5 px-2">
                  <div className="flex flex-row">
                    <div className="flex flex-col">
                      <div className="leading-6 text-xl text-primary-input-text font-bold mt-1 flex-row">
                        Marketing Costs
                      </div>

                      <Select
                        className={classNames('w-72 !border-0 text-primary-navy mt-1')}
                        options={approvalStatusList}
                        value={approvalStatus}
                        onChange={(value) => editBooking('marketingCostsStatus', value.toString())}
                        placeholder="Select Approval Status"
                        isClearable={false}
                      />
                    </div>
                    <div className="flex flex-col mt-8 ml-8">
                      <DateInput
                        onChange={(value) => editBooking('marketingCostsApprovalDate', value)}
                        value={changeDate}
                      />
                    </div>
                    <div className="flex flex-col ml-8 mt-1">
                      <TextArea
                        className="mt-2 h-[52px] w-[425px]"
                        value={changeNotes}
                        placeholder="Notes Field"
                        onBlur={(e) => editBooking('marketingCostsNotes', e.target.value)}
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
                    sufixIconName="excel"
                    onClick={onExport}
                  />
                  <Button text="Add New Activity" className="w-[160px]" onClick={addActivity} />
                </div>
              </div>
              <div className="w-[1086px] h-[375px]">
                <Table columnDefs={actColDefs} rowData={actRowData} styleProps={styleProps} tableHeight={250} />

                <div
                  className={classNames(
                    'flex flex-col w-[487px] h-[69px] bg-primary-green/[0.30] rounded-xl mt-5 px-2 float-right',
                    actRowData.length === 0 ? '-mt-[250px]' : '',
                  )}
                >
                  <div className="flex flex-row gap-4">
                    <div className="flex flex-col text-center">
                      <div className="text-base font-bold text-primary-input-text">Total Cost</div>
                      <div className="bg-primary-white h-7 w-[140px] rounded mt-[2px] ml-2">
                        <div className="text text-base text-left pl-2 text-primary-input-text">
                          {currency.symbol + totalCost.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col text-center">
                      <div className="text-base font-bold text-primary-input-text">Company</div>
                      <div className="bg-primary-white h-7 w-[140px] rounded mt-[2px]">
                        <div className="text text-base text-left pl-2 text-primary-input-text">
                          {currency.symbol + totalCompanyCost.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col text-center">
                      <div className="text-base font-bold text-primary-input-text">Venue</div>
                      <div className="bg-primary-white h-7 w-[140px] rounded mt-[2px]">
                        <div className="text text-base text-left pl-2 text-primary-input-text">
                          {currency.symbol + totalVenueCost.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="leading-6 text-xl text-primary-input-text font-bold mt-1 flex-row">Global Activities</div>

              <div className="w-[1086px] h-[500px]">
                <Table columnDefs={globalColDefs} rowData={globalRowData} styleProps={styleProps} tableHeight={250} />

                <div
                  className={classNames(
                    'flex flex-col w-[331px] h-[69px] bg-primary-green/[0.30] rounded-xl mt-5 px-2 float-right',
                    globalRowData.length === 0 ? '-mt-[350px]' : '',
                  )}
                >
                  <div className="flex flex-row gap-4">
                    <div className="flex flex-col text-center">
                      <div className="text-base font-bold text-primary-input-text">Total Cost</div>
                      <div className="bg-primary-white h-7 w-[140px] rounded mt-[2px] ml-2">
                        <div className="text text-base text-left pl-2 text-primary-input-text">
                          {currency.symbol + globalTotalCost.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col text-center">
                      <div className="text-base font-bold text-primary-input-text">Venue Share</div>
                      <div className="bg-primary-white h-7 w-[140px] rounded mt-[2px]">
                        <div className="text text-base text-left pl-2 text-primary-input-text">
                          {currency.symbol + globalVenueShareCost.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <GlobalActivityModal
                show={showGlobalActivityModal}
                onCancel={() => setShowGlobalActivityModal(false)}
                variant="view"
                activityTypes={actTypeList}
                data={globalActRow}
                productionId={productionId}
                productionCurrency={currency.symbol}
                venues={venueList}
              />

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
            </div>
          )}
        </div>
      )}
    </>
  );
});

ActivitiesTab.displayName = 'ActivitiesTab';
export default ActivitiesTab;
