import { useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import Summary, { SummaryRef } from './Summary';
import Icon from 'components/core-ui-lib/Icon';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import Tabs from 'components/core-ui-lib/Tabs';
import { Tab } from '@headlessui/react';
import { useRouter } from 'next/router';
import { tabState } from 'state/marketing/tabState';
import SalesTab, { SalesTabRef } from './tabs/SalesTab';
import ActivitiesTab, { ActivityTabRef } from './tabs/ActivitiesTab';
import ArchivedSalesTab, { ArchSalesTabRef } from './tabs/ArchivedSalesTab';
import ContactNotesTab, { ContactNoteTabRef } from './tabs/ContactNotesTab';
import VenueContactsTab, { VenueContactTabRef } from './tabs/VenueContactsTab';
import PromotorHoldsTab, { PromoterHoldTabRef } from './tabs/PromoterHoldsTab';
import AttachmentsTab, { AttachmentsTabRef } from './tabs/AttachmentsTab';
import { accessMarketingHome } from 'state/account/selectors/permissionSelector';

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

const MarketingHome = () => {
  const permissions = useRecoilValue(accessMarketingHome);
  const { selected: productionId } = useRecoilValue(productionJumpState);
  const bookings = useRecoilState(bookingJumpState);
  const [bookingId, setBookingId] = useState(null);
  const [tabSet, setTabSet] = useState<boolean>(false);
  const [tabIndex, setTabIndex] = useRecoilState(tabState);
  const salesTabRef = useRef<SalesTabRef>();
  const archSalesRef = useRef<ArchSalesTabRef>();
  const activityTabRef = useRef<ActivityTabRef>();
  const contactNoteTabRef = useRef<ContactNoteTabRef>();
  const venueContactTabRef = useRef<VenueContactTabRef>();
  const promoterHoldTabRef = useRef<PromoterHoldTabRef>();
  const attachmentsTabRef = useRef<AttachmentsTabRef>();
  const summaryRef = useRef<SummaryRef>();
  const [firstLoad, setFirstLoad] = useState<boolean>(true);

  const router = useRouter();

  const tabs = [
    { name: 'Sales', permission: 'ACCESS_MARKETING_HOME_-_SALES' },
    { name: 'Archived Sales', permission: 'ACCESS_MARKETING_HOME_-_ARCHIVED_SALES' },
    { name: 'Activities', permission: 'ACCESS_MARKETING_HOME_-_ACTIVITIES' },
    { name: 'Contact Notes', permission: 'ACCESS_MARKETING_HOME_-_CONTACT_NOTES' },
    { name: 'Venue Contacts', permission: 'ACCESS_MARKETING_HOME_-_VENUE_CONTACTS' },
    { name: 'Promoter Holds', permission: 'ACCESS_MARKETING_HOME_-_PROMOTER_HOLDS' },
    { name: 'Attachments', permission: 'ACCESS_MARKETING_HOME_-_ATTACHMENTS' },
  ];

  const permissionedTabs = useMemo(() => {
    return tabs.filter((tab) => permissions.includes(tab.permission));
  }, [permissions]);

  useEffect(() => {
    resetData();
    if (!firstLoad) {
      if (bookings[0].selected !== bookingId) {
        setBookingId(bookings[0].selected);
      }
    } else {
      setFirstLoad(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings[0].selected]);

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

  const resetData = () => {
    salesTabRef.current && salesTabRef.current.resetData();
    archSalesRef.current && archSalesRef.current.resetData();
    activityTabRef.current && activityTabRef.current.resetData();
    contactNoteTabRef.current && contactNoteTabRef.current.resetData();
    venueContactTabRef.current && venueContactTabRef.current.resetData();
    promoterHoldTabRef.current && promoterHoldTabRef.current.resetData();
    attachmentsTabRef.current && attachmentsTabRef.current.resetData();
    summaryRef.current && summaryRef.current.resetData();
  };

  return (
    <div className="flex w-full h-full">
      <div className="bg-primary-green/[0.15] w-[291px] h-[690PX] rounded-xl p-4 mr-5 flex flex-col justify-between mb-5 -mt-5">
        <div className="flex-grow overflow-y-auto">
          <Summary bookingId={bookingId} ref={summaryRef} />
        </div>
        <div className="flex flex-col border-y-2 border-t-primary-input-text border-b-0 py-4 -mb-3.5">
          <div className="flex items-center text-primary-navy">
            <Icon iconName="user-solid" variant="sm" />
            <div className="ml-4 bg-secondary-green text-primary-white px-1">Down to single seats</div>
          </div>
          <div className="flex items-center text-primary-navy mt-2">
            <Icon iconName="book-solid" variant="sm" />
            <div className="ml-4 bg-secondary-yellow text-primary-navy px-1">Brochure released</div>
          </div>
          <div className="flex items-center text-primary-navy mt-2">
            <Icon iconName="square-cross" variant="sm" />
            <div className="ml-4 bg-secondary-red text-primary-white px-1">Not on sale</div>
          </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        <Tabs
          selectedTabClass="!bg-primary-green/[0.30] !text-primary-navy"
          tabs={permissionedTabs.map(({ name }) => name)}
          disabled={!productionId || !bookingId}
          defaultIndex={tabIndex}
        >
          {permissions.includes(tabs[0].permission) && (
            <Tab.Panel className="h-[650px] overflow-y-hidden">
              <SalesTab bookingId={bookingId} ref={salesTabRef} />
            </Tab.Panel>
          )}

          {permissions.includes(tabs[1].permission) && (
            <Tab.Panel className="w-[1085px]">
              <ArchivedSalesTab ref={archSalesRef} selectedBooking={bookings[0].selected} />
            </Tab.Panel>
          )}

          {permissions.includes(tabs[2].permission) && (
            <Tab.Panel className="h-[650px] w-[1085px]">
              <ActivitiesTab bookingId={bookingId} ref={activityTabRef} />
            </Tab.Panel>
          )}

          {permissions.includes(tabs[3].permission) && (
            <Tab.Panel className="w-[1085px]">
              <ContactNotesTab bookingId={bookingId} ref={contactNoteTabRef} />
            </Tab.Panel>
          )}

          {permissions.includes(tabs[4].permission) && (
            <Tab.Panel className="w-[1085px]">
              <VenueContactsTab bookingId={bookingId} ref={venueContactTabRef} />
            </Tab.Panel>
          )}

          {permissions.includes(tabs[5].permission) && (
            <Tab.Panel className="w-[1085px]">
              <PromotorHoldsTab bookingId={bookingId} ref={promoterHoldTabRef} />
            </Tab.Panel>
          )}

          {permissions.includes(tabs[6].permission) && (
            <Tab.Panel className="w-[1085px]">
              <AttachmentsTab bookingId={bookingId} ref={attachmentsTabRef} />
            </Tab.Panel>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default MarketingHome;
