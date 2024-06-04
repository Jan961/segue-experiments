import Button from 'components/core-ui-lib/Button';
import { ReactNode, forwardRef, useImperativeHandle, useState } from 'react';
import ArchSalesDialog, { ArchSalesDialogVariant } from '../modal/ArchivedSalesDialog';
import { DataList, VenueDetail } from '../MarketingHome';
import SalesTable from 'components/global/salesTable';
import { SalesComparison } from 'types/MarketingTypes';
import { useRecoilState, useRecoilValue } from 'recoil';
import useAxios from 'hooks/useAxios';
import { townState } from 'state/marketing/townState';
import { venueState } from 'state/booking/venueState';
import { bookingJumpState } from 'state/marketing/bookingJumpState';

export interface ArchSalesTabRef {
  resetData: () => void;
}

const ArchivedSalesTab = forwardRef<ArchSalesTabRef>((props, ref) => {
  const [showArchSalesModal, setShowArchSalesModal] = useState<boolean>(false);
  const [archSaleVariant, setArchSaleVariant] = useState<ArchSalesDialogVariant>('venue');
  const [archivedDataAvail, setArchivedDataAvail] = useState<boolean>(false);
  const [archivedData, setArchivedData] = useState<VenueDetail | DataList>();
  const [archivedSalesTable, setArchivedSalesTable] = useState<ReactNode>();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const townList = useRecoilValue(townState);
  const venueDict = useRecoilValue(venueState);
  const bookings = useRecoilState(bookingJumpState);

  useImperativeHandle(ref, () => ({
    resetData: () => {
      setArchivedSalesTable(<div />);
    },
  }));

  const { fetchData } = useAxios();

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

    const currencySymbol: string = await fetchData({
      url: '/api/marketing/sales/currency/currency',
      method: 'POST',
      data: { BookingId: selectedBookings[0] },
    }).then((outputData: any) => {
      if (outputData.currencyCode) {
        return String.fromCharCode(Number('0x' + outputData.currencyCode));
      } else {
        return '£';
      }
    });

    if (Array.isArray(data) && data.length !== 0) {
      const salesComp = data as Array<SalesComparison>;
      const result = { tableData: salesComp, bookingIds: selection };

      setArchivedSalesTable(
        <div className="w-[1200px] overflow-x-auto pb-5">
          <SalesTable
            containerHeight="h-[1000px]"
            containerWidth="w-auto"
            module="marketing"
            variant="salesComparison"
            data={result}
            tableHeight={580}
            currencySymbol={currencySymbol}
          />
        </div>,
      );
      setArchivedDataAvail(true);
      setShowArchSalesModal(false);
    } else {
      setErrorMessage('There are no sales data available for this particular selection.');
    }
  };

  return (
    <>
      {bookings[0].selected !== undefined && bookings[0].selected !== null && (
        <div>
          <div>
            <div className="flex flex-row gap-4 mb-5">
              <Button text="For this Venue" className="w-[132px]" onClick={() => showArchSalesComp('venue')} />
              <Button text="For this Town" className="w-[132px]" onClick={() => showArchSalesComp('town')} />
              <Button text="Any Venue / Town" className="w-[132px]" onClick={() => showArchSalesComp('both')} />
              <Button
                text="Export Displayed Sales Data"
                className="w-[232px]"
                iconProps={{ className: 'h-4 w-3 ml-5' }}
                sufixIconName="excel"
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

            <div className="flex flex-row">{archivedSalesTable}</div>

            <div className="flex flex-row w-full h-32" />
          </div>
        </div>
      )}
    </>
  );
});

ArchivedSalesTab.displayName = 'ArchivedSalesTab';
export default ArchivedSalesTab;
