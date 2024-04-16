import { ReactNode, useEffect, useState } from 'react';
import { SalesTabs, SalesSnapshot, SalesComparison } from 'types/MarketingTypes';
import { useRecoilState, useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import { Summary } from './Summary';
import Icon from 'components/core-ui-lib/Icon';
import TabButton from 'components/core-ui-lib/TabButton';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import useAxios from 'hooks/useAxios';
import SalesTable from 'components/global/salesTable';
import Button from 'components/core-ui-lib/Button';
import ArchSalesDialog, { ArchSalesDialogVariant } from './modal/ArchivedSalesDialog';
import { VenueDTO } from 'interfaces';

const MarketingHome = () => {
  const [currView, setCurrView] = useState<SalesTabs>('');
  const selectedBtnClass = '!bg-primary-green/[0.30] !text-primary-navy';
  const { selected: productionId } = useRecoilValue(productionJumpState);
  const bookings = useRecoilState(bookingJumpState);
  const [bookingId, setBookingId] = useState(null);
  const [sales, setSales] = useState<Array<SalesSnapshot>>([]);
  const [showArchSalesModal, setShowArchSalesModal] = useState<boolean>(false);
  const [archSaleVariant, setArchSaleVariant] = useState<ArchSalesDialogVariant>('venue');
  const [archivedDataAvail, setArchivedDataAvail] = useState<boolean>(false);
  const [archivedData, setArchivedData] = useState<VenueDTO>();
  const [archivedSalesTable, setArchivedSalesTable] = useState<ReactNode>();
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

  const showArchSalesComp = (variant: ArchSalesDialogVariant) => {
    setArchSaleVariant(variant);
    const selectedBooking = bookings[0].bookings.find((booking) => booking.Id === bookings[0].selected);
    setArchivedData(selectedBooking.Venue);
    setShowArchSalesModal(true);
  };

  const showArchivedSales = async (selection) => {
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
    }
  };

  useEffect(() => {
    if (bookings[0].selected !== bookingId) {
      setCurrView('');
      setBookingId(bookings[0].selected);
    }
  }, [bookings[0].selected]);

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
            disabled={!productionId || bookingId === null}
            variant="secondary"
            onClick={() => setCurrView('sales')}
          />
          <TabButton
            text="Archived Sales"
            className={`w-[155px] ${currView === 'archived sales' && selectedBtnClass}`}
            disabled={!productionId || bookingId === null}
            variant="secondary"
            onClick={() => setCurrView('archived sales')}
          />
          <TabButton
            text="Activities"
            className={`w-[155px] ${currView === 'activities' && selectedBtnClass}`}
            disabled={!productionId || bookingId === null}
            variant="secondary"
            onClick={() => setCurrView('activities')}
          />
          <TabButton
            text="Contact Notes"
            className={`w-[155px] ${currView === 'contact notes' && selectedBtnClass}`}
            disabled={!productionId || bookingId === null}
            variant="secondary"
            onClick={() => setCurrView('contact notes')}
          />
          <TabButton
            text="Venue Contacts"
            className={`w-[155px] ${currView === 'venue contacts' && selectedBtnClass}`}
            disabled={!productionId || bookingId === null}
            variant="secondary"
            onClick={() => setCurrView('venue contacts')}
          />
          <TabButton
            text="Promoter Holds"
            className={`w-[155px] ${currView === 'promoter holds' && selectedBtnClass}`}
            disabled={!productionId || bookingId === null}
            variant="secondary"
            onClick={() => setCurrView('promoter holds')}
          />
          <TabButton
            text="Attachments"
            className={`w-[155px] ${currView === 'attachments' && selectedBtnClass}`}
            disabled={!productionId || bookingId === null}
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
                  containerWidth="w-[1465px]"
                  module="marketing"
                  variant="salesSnapshot"
                  data={sales}
                  booking={bookings[0].selected}
                />
              )}
            </div>
          )}

          {currView === 'archived sales' && (
            <div>
              <div className="flex flex-row gap-4">
                <Button
                  text="For this Venue"
                  className="w-[132px] mb-3 pl-6"
                  onClick={() => showArchSalesComp('venue')}
                />

                <Button
                  text="For this Town"
                  className="w-[132px] mb-3 pl-6"
                  onClick={() => showArchSalesComp('town')}
                />

                <Button
                  text="For this Venue / Town"
                  className="w-[230px] mb-3 pl-6"
                  onClick={() => showArchSalesComp('both')}
                />

                <Button
                  text="Export Displayed Sales Data"
                  className="w-[230px] mb-3 pl-6"
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
                />
              </div>

              {archivedSalesTable}
            </div>
          )}

          {currView === 'activities' && <div>activities</div>}

          {currView === 'contact notes' && <div>contact notes</div>}

          {currView === 'venue contacts' && <div>venue contacts</div>}

          {currView === 'promoter holds' && <div>promoter holds</div>}

          {currView === 'attachments' && <div>attachments</div>}
        </div>
      </div>
    </div>
  );
};

export default MarketingHome;
