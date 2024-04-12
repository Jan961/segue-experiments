import { useEffect, useState } from 'react';
import { SalesTabs, SalesSnapshot } from 'types/MarketingTypes';
import { useRecoilState, useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import { Summary } from './Summary';
import Icon from 'components/core-ui-lib/Icon';
import TabButton from 'components/core-ui-lib/TabButton';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import useAxios from 'hooks/useAxios';
import SalesTable from 'components/global/salesTable';

const MarketingHome = () => {
  const [currView, setCurrView] = useState<SalesTabs>('');
  const selectedBtnClass = '!bg-primary-green/[0.30] !text-primary-navy';
  const { selected: productionId } = useRecoilValue(productionJumpState);
  const bookings = useRecoilState(bookingJumpState);
  const [bookingId, setBookingId] = useState(null);
  const [sales, setSales] = useState<Array<SalesSnapshot>>([]);
  // const [archivedSales, setArchivedSales] = useState>();

  const { fetchData } = useAxios();

  const getSales = async (bookingId: string) => {
    const data = await fetchData({
      url: '/api/marketing/sales/read/' + bookingId,
      method: 'POST',
    });

    setSales([]);

    if (Array.isArray(data) && data.length > 0) {
      const salesData = data as Array<SalesSnapshot>;
      setSales(salesData);
      setCurrView('sales');
    } else {
      setSales([]);
    }
  };

  useEffect(() => {
    if (bookings[0].selected !== bookingId) {
      setCurrView('');
      setBookingId(bookings[0].selected);
    }
  }, [bookings]);

  useEffect(() => {
    if (bookingId) {
      getSales(bookingId.toString());
    }
  }, [bookingId]);

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
        <div className="flex flex-wrap items-center mb-4 -mt-5">
          {' '}
          <TabButton
            text="Sales"
            className={`w-[155px] ${currView === 'sales' && selectedBtnClass}`}
            disabled={!productionId}
            variant="secondary"
            onClick={() => setCurrView('sales')}
          />
          <TabButton
            text="Archived Sales"
            className={`w-[155px] ${currView === 'archived sales' && selectedBtnClass}`}
            disabled={!productionId}
            variant="secondary"
            onClick={() => setCurrView('archived sales')}
          />
          <TabButton
            text="Activities"
            className={`w-[155px] ${currView === 'activities' && selectedBtnClass}`}
            disabled={!productionId}
            variant="secondary"
            onClick={() => setCurrView('activities')}
          />
          <TabButton
            text="Contact Notes"
            className={`w-[155px] ${currView === 'contact notes' && selectedBtnClass}`}
            disabled={!productionId}
            variant="secondary"
            onClick={() => setCurrView('contact notes')}
          />
          <TabButton
            text="Venue Contacts"
            className={`w-[155px] ${currView === 'venue contacts' && selectedBtnClass}`}
            disabled={!productionId}
            variant="secondary"
            onClick={() => setCurrView('venue contacts')}
          />
          <TabButton
            text="Promoter Holds"
            className={`w-[155px] ${currView === 'promoter holds' && selectedBtnClass}`}
            disabled={!productionId}
            variant="secondary"
            onClick={() => setCurrView('promoter holds')}
          />
          <TabButton
            text="Attachments"
            className={`w-[155px] ${currView === 'attachments' && selectedBtnClass}`}
            disabled={!productionId}
            variant="secondary"
            onClick={() => setCurrView('attachments')}
          />
        </div>

        <div className="h-[650px] overflow-y-hidden">
          {currView === 'sales' && (
            <div>
              {sales.length !== 0 && (
                <SalesTable
                  containerHeight="h-auto"
                  containerWidth="w-[1317px]"
                  module="marketing"
                  variant="salesSnapshot"
                  data={sales}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketingHome;
