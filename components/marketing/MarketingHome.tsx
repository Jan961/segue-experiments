import { ReactNode, useEffect, useState } from 'react';
import { SalesSnapshot, SalesComparison } from 'types/MarketingTypes';
import { useRecoilState, useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import { Summary } from './Summary';
import Icon from 'components/core-ui-lib/Icon';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import useAxios from 'hooks/useAxios';
import SalesTable from 'components/global/salesTable';
import Button from 'components/core-ui-lib/Button';
import ArchSalesDialog, { ArchSalesDialogVariant } from './modal/ArchivedSalesDialog';
import { townState } from 'state/marketing/townState';
import { venueState } from 'state/booking/venueState';
import Tabs from 'components/core-ui-lib/Tabs';
import { Tab } from '@headlessui/react';
import { useRouter } from 'next/router';
import { tabState } from 'state/marketing/tabState';
import ActivityModal, { ActivityModalVariant } from './modal/ActivityModal';
import { ActivityDTO, ActivityTypeDTO, BookingContactNoteDTO } from 'interfaces';
import { activityColDefs, contactNoteColDefs, styleProps } from 'components/marketing/table/tableConfig';
import Table from 'components/core-ui-lib/Table';
import { reverseDate, hasActivityChanged } from './utils';
import DateInput from 'components/core-ui-lib/DateInput';
import Checkbox from 'components/core-ui-lib/Checkbox';
import Select from 'components/core-ui-lib/Select';
import classNames from 'classnames';
import TextArea from 'components/core-ui-lib/TextArea/TextArea';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import { ConfDialogVariant } from 'components/core-ui-lib/ConfirmationDialog/ConfirmationDialog';
import TextInput from 'components/core-ui-lib/TextInput';
import { startOfDay } from 'date-fns';
import ContactNoteModal, { ContactNoteModalVariant } from './modal/ContactNoteModal';

export type SelectOption = {
  text: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
};

export type DataList = {
  townList: Array<SelectOption>;
  venueList: Array<SelectOption>;
};

export type VenueDetail = {
  name: string;
  code: string;
  town: string;
};

type ActivityList = {
  activities: Array<ActivityDTO>;
  activityTypes: Array<ActivityTypeDTO>;
};

const approvalStatusList = [
  { text: 'Pending Approval', value: 'P' },
  { text: 'Approved', value: 'A' },
  { text: 'Not Approved', value: 'N' },
];

const MarketingHome = () => {
  // global module variables
  const { selected: productionId } = useRecoilValue(productionJumpState);
  // global module variables
  const bookings = useRecoilState(bookingJumpState);
  const [bookingId, setBookingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const townList = useRecoilValue(townState);
  const venueDict = useRecoilValue(venueState);
  const [tabSet, setTabSet] = useState<boolean>(false);
  const [tabIndex, setTabIndex] = useRecoilState(tabState);
  const [confVariant, setConfVariant] = useState<ConfDialogVariant>('delete');
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [currency, setCurrency] = useState('£');

  // sales
  const [salesTable, setSalesTable] = useState<ReactNode>();

  // archived sales
  const [showArchSalesModal, setShowArchSalesModal] = useState<boolean>(false);
  const [showActivityModal, setShowActivityModal] = useState<boolean>(false);
  const [archSaleVariant, setArchSaleVariant] = useState<ArchSalesDialogVariant>('venue');
  const [archivedDataAvail, setArchivedDataAvail] = useState<boolean>(false);
  const [archivedData, setArchivedData] = useState<VenueDetail | DataList>();
  const [archivedSalesTable, setArchivedSalesTable] = useState<ReactNode>();

  // activities
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

  // contact note modal
  const [showContactNoteModal, setShowContactNoteModal] = useState<boolean>(false);
  const [contactModalVariant, setContactModalVariant] = useState<ContactNoteModalVariant>();
  const [contactNoteRows, setContactNoteRows] = useState<Array<BookingContactNoteDTO>>();
  const [contNoteColDefs, setContNoteColDefs] = useState([]);

  const router = useRouter();

  const tabs = [
    'Sales',
    'Archived Sales',
    'Activities',
    'Contact Notes',
    'Venue Contacts',
    'Promoter Holds',
    'Attachments',
  ];

  const { fetchData } = useAxios();

  const getSales = async (bookingId: string) => {
    setSalesTable(<div />);

    const data = await fetchData({
      url: '/api/marketing/sales/read/' + bookingId,
      method: 'POST',
    });

    if (Array.isArray(data) && data.length > 0) {
      const salesData = data as Array<SalesSnapshot>;
      setSalesTable(
        <SalesTable
          containerHeight="h-auto"
          containerWidth="w-[1465px]"
          module="marketing"
          variant="salesSnapshot"
          data={salesData}
          booking={bookingId}
        />,
      );
    } else {
      setSalesTable(<div />);
    }
  };

  const showArchSalesComp = (variant: ArchSalesDialogVariant) => {
    setArchSaleVariant(variant);
    if (variant === 'both') {
      // get venue list
      const venueTownData = {
        townList: Object.values(townList).map((town) => {
          return { text: town.Town, value: town.Town };
        }),
        venueList: Object.values(venueDict).map((venue) => {
          return { text: venue.Code + ' ' + venue.Name, value: venue };
        }),
      };
      setArchivedData(venueTownData);
    } else {
      const selectedBooking = bookings[0].bookings.find((booking) => booking.Id === bookings[0].selected);
      // extract the venue name, code and town
      const venue = {
        name: selectedBooking.Venue.Name,
        code: selectedBooking.Venue.Code,
        town: Object.values(venueDict).find((x) => x.Code === selectedBooking.Venue.Code).Town,
      };

      setArchivedData(venue);
    }

    setShowArchSalesModal(true);
  };

  const showArchivedSales = async (selection) => {
    setArchivedSalesTable(<div />);
    const selectedBookings = selection.map((obj) => obj.bookingId);
    const data = await fetchData({
      url: '/api/marketing/sales/read/archived',
      method: 'POST',
      data: { bookingIds: selectedBookings },
    });

    if (Array.isArray(data) && data.length !== 0) {
      const salesComp = data as Array<SalesComparison>;
      const result = { tableData: salesComp, bookingIds: selection };

      setArchivedSalesTable(
        <SalesTable
          containerHeight="h-[1000px]"
          containerWidth="w-auto"
          module="marketing"
          variant="salesComparison"
          data={result}
        />,
      );
      setArchivedDataAvail(true);
      setShowArchSalesModal(false);
    } else {
      setErrorMessage('There are no sales data available for this particular selection.');
    }
  };

  const getActivities = async (bookingId: string) => {
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

  const getContactNotes = async (bookingId: string) => {
    const data = await fetchData({
      url: '/api/marketing/contactNotes/' + bookingId,
      method: 'POST',
    });

    if (typeof data === 'object') {
      const contactNoteList = data as Array<BookingContactNoteDTO>;

      const sortedContactNotes = contactNoteList.sort(
        (a, b) => new Date(b.ContactDate).getTime() - new Date(a.ContactDate).getTime(),
      );

      setContNoteColDefs(contactNoteColDefs(updateContactNote));
      setContactNoteRows(sortedContactNotes);
    }
  };

  const activityUpdate = async (variant: ActivityModalVariant, data) => {
    setActModalVariant(variant);

    // we need to do an api call to get a list of activity types
    // the useState variable with activity type is set after activityUpdate is passed in the col defs
    const activityData = await fetchData({
      url: '/api/marketing/activities/' + bookingId,
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

  const updateContactNote = (variant: ContactNoteModalVariant, data) => {
    console.log(variant, data);
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

  const saveContactNote = (variant: ContactNoteModalVariant, data) => {
    console.log(variant, data);
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

  const addContactNote = () => {
    setContactModalVariant('add');
    setShowContactNoteModal(true);
  };

  useEffect(() => {
    if (bookings[0].selected !== bookingId) {
      setBookingId(bookings[0].selected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings[0].selected]);

  useEffect(() => {
    if (bookingId) {
      getSales(bookingId.toString());
      getActivities(bookingId.toString());
      getContactNotes(bookingId.toString());

      // set checkbox row on activities tab
      const booking = bookings[0].bookings.find((booking) => booking.Id === bookingId);
      setOnSaleCheck(booking.TicketsOnSale);
      setMarketingPlansCheck(booking.MarketingPlanReceived);
      setPrintReqCheck(booking.PrintReqsReceived);
      setContactInfoCheck(booking.ContactInfoReceived);
      setOnSaleFromDt(booking.TicketsOnSaleFromDate);

      setCurrency('£');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  // using tabSet to ensure this is only run once
  // when a production is selected this code was re-run as a result the tabIndex was set to 0
  if (!tabSet) {
    const currentTab = router.query.tabIndex;
    if (currentTab !== undefined) {
      const tabIStr = currentTab.toString();
      setTabIndex(parseInt(tabIStr));
      setTabSet(true);
    }
  }

  return (
    <div className="flex w-full h-full">
      {/* Green Box */}
      <div className="bg-primary-green/[0.15] w-[291px] h-[690PX] rounded-xl p-4 mr-5 flex flex-col justify-between mb-5 -mt-5">
        <div className="flex-grow overflow-y-auto">
          <Summary />
        </div>
        <div className="flex flex-col border-y-2 border-t-primary-input-text border-b-0 py-4 -mb-3.5">
          <div className="flex items-center text-primary-navy">
            <Icon iconName={'user-solid'} variant="sm" />
            <div className="ml-4 bg-secondary-green text-primary-white px-1">Down to single seats</div>
          </div>
          <div className="flex items-center text-primary-navy mt-2">
            <Icon iconName={'book-solid'} variant="sm" />
            <div className="ml-4 bg-secondary-yellow text-primary-navy px-1">Brochure released</div>
          </div>
          <div className="flex items-center text-primary-navy mt-2">
            <Icon iconName={'square-cross'} variant="sm" />
            <div className="ml-4 bg-secondary-red text-primary-white px-1">Not on sale</div>
          </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        <Tabs
          selectedTabClass="!bg-primary-green/[0.30] !text-primary-navy"
          tabs={tabs}
          disabled={!productionId || !bookingId}
          defaultIndex={tabIndex}
        >
          <Tab.Panel className="h-[650px] overflow-y-hidden">{salesTable}</Tab.Panel>

          <Tab.Panel>
            <div>
              <div className="flex flex-row gap-4 mb-5">
                <Button text="For this Venue" className="w-[132px]" onClick={() => showArchSalesComp('venue')} />

                <Button text="For this Town" className="w-[132px]" onClick={() => showArchSalesComp('town')} />

                <Button text="Any Venue / Town" className="w-[132px]" onClick={() => showArchSalesComp('both')} />

                <Button
                  text="Export Displayed Sales Data"
                  className="w-[232px]"
                  iconProps={{ className: 'h-4 w-3 ml-5' }}
                  sufixIconName={'excel'}
                  disabled={!archivedDataAvail}
                />

                <ArchSalesDialog
                  show={showArchSalesModal}
                  variant={archSaleVariant}
                  data={archivedData}
                  onCancel={() => setShowArchSalesModal(false)}
                  onSubmit={(bookings) => showArchivedSales(bookings)}
                  error={errorMessage}
                />
              </div>

              {archivedSalesTable}
            </div>
          </Tab.Panel>

          <Tab.Panel className="h-[650px]">
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
                    <div className="leading-6 text-xl text-primary-input-text font-bold mt-1 flex-row">
                      Marketing Costs
                    </div>

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
              bookingId={bookingId}
              data={actRow}
            />
          </Tab.Panel>

          <Tab.Panel>
            <div className="flex justify-end">
              <div className="flex flex-row gap-4 w-[850px] mb-5">
                <Button
                  text="Contact Notes Report"
                  className="w-[203px]"
                  disabled={!productionId}
                  iconProps={{ className: 'h-4 w-3' }}
                  sufixIconName={'excel'}
                />
                <Button text="Add New" className="w-[160px]" onClick={addContactNote} />
              </div>
            </div>

            <div className="flex flex-row">
              <div className="w-[1086px] h-[500px]">
                <Table columnDefs={contNoteColDefs} rowData={contactNoteRows} styleProps={styleProps} />
              </div>
            </div>

            <ContactNoteModal
              show={showContactNoteModal}
              onCancel={() => setShowContactNoteModal(false)}
              variant={contactModalVariant}
              activityTypes={actTypeList}
              onSave={(variant, data) => saveContactNote(variant, data)}
              bookingId={bookingId}
            />
          </Tab.Panel>
          <Tab.Panel className="w-42 h-24 flex justify-center items-center">venue contacts</Tab.Panel>
          <Tab.Panel className="w-42 h-24 flex justify-center items-center">promoter holds</Tab.Panel>
          <Tab.Panel className="w-42 h-24 flex justify-center items-center">attachments</Tab.Panel>
        </Tabs>
      </div>
      <ConfirmationDialog
        variant={confVariant}
        show={showConfirm}
        onYesClick={() => saveActivity('delete', actRow)}
        onNoClick={() => setShowConfirm(false)}
        hasOverlay={false}
      />
    </div>
  );
};

export default MarketingHome;
