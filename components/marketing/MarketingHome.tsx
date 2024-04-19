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
import ActivityModal from './modal/ActivityModal';
import { ActivityDTO, ActivityTypeDTO } from 'interfaces';

export type SelectOption = {
  text: string;
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
  activityTypes: Array<ActivityTypeDTO>
}

const MarketingHome = () => {
  const { selected: productionId } = useRecoilValue(productionJumpState);
  const bookings = useRecoilState(bookingJumpState);
  const [bookingId, setBookingId] = useState(null);
  const [showArchSalesModal, setShowArchSalesModal] = useState<boolean>(false);
  const [showActivityModal, setShowActivityModal] = useState<boolean>(false);
  const [archSaleVariant, setArchSaleVariant] = useState<ArchSalesDialogVariant>('venue');
  const [archivedDataAvail, setArchivedDataAvail] = useState<boolean>(false);
  const [activityTypes, setActivityTypes] = useState<Array<SelectOption>>(null);
  const [archivedData, setArchivedData] = useState<VenueDetail | DataList>();
  const [archivedSalesTable, setArchivedSalesTable] = useState<ReactNode>();
  const [salesTable, setSalesTable] = useState<ReactNode>();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const townList = useRecoilValue(townState);
  const venueDict = useRecoilValue(venueState);
  const [tabSet, setTabSet] = useState<boolean>(false);
  const [tabIndex, setTabIndex] = useRecoilState(tabState);

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

      const actTypes = activityList.activityTypes.map((type) => {
        return { text: type.Name, value: type.Id };
      });

      setActivityTypes(actTypes)
    }
  }

  useEffect(() => {
    if (bookings[0].selected !== bookingId) {
      setBookingId(bookings[0].selected);
    }
  }, [bookings[0].selected]);

  useEffect(() => {
    if (bookingId) {
      getSales(bookingId.toString());
      getActivities(bookingId.toString());
    }
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

          <Tab.Panel className="w-42 h-24 flex justify-center items-center">
            <div className="flex flex-row gap-4 mb-5">
              <Button
                text="Show Activity Modal - Temporary Button"
                className="w-[400px]"
                onClick={() => setShowActivityModal(true)}
              />
              <ActivityModal 
                show={showActivityModal} 
                onCancel={() => setShowActivityModal(false)} 
                variant='add' 
                activityTypes={activityTypes}
              />
            </div>
          </Tab.Panel>
          <Tab.Panel className="w-42 h-24 flex justify-center items-center">contact notes</Tab.Panel>
          <Tab.Panel className="w-42 h-24 flex justify-center items-center">venue contacts</Tab.Panel>
          <Tab.Panel className="w-42 h-24 flex justify-center items-center">promoter holds</Tab.Panel>
          <Tab.Panel className="w-42 h-24 flex justify-center items-center">attachments</Tab.Panel>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketingHome;
