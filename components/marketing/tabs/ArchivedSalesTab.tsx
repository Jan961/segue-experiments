import Button from 'components/core-ui-lib/Button';
import { ReactNode, forwardRef, useImperativeHandle, useState } from 'react';
import ArchSalesDialog, { ArchSalesDialogVariant } from '../modal/ArchivedSalesDialog';
import { DataList, VenueDetail } from '../MarketingHome';
import SalesTable from 'components/global/salesTable';
import { SalesComparison } from 'types/MarketingTypes';
import { useRecoilState, useRecoilValue } from 'recoil';
import { townState } from 'state/marketing/townState';
import { venueState } from 'state/booking/venueState';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import axios from 'axios';
import { exportExcelReport } from 'components/bookings/modal/request';
import { notify } from 'components/core-ui-lib/Notifications';
import { productionJumpState } from 'state/booking/productionJumpState';

export interface ArchSalesTabRef {
  resetData: () => void;
}

export interface ArchSalesProps {
  selectedBooking: any;
}

const ArchivedSalesTab = forwardRef<ArchSalesTabRef, ArchSalesProps>((props, ref) => {
  const [showArchSalesModal, setShowArchSalesModal] = useState<boolean>(false);
  const [archSaleVariant, setArchSaleVariant] = useState<ArchSalesDialogVariant>('venue');
  const [archivedDataAvail, setArchivedDataAvail] = useState<boolean>(false);
  const [archivedData, setArchivedData] = useState<VenueDetail | DataList>();
  const [archivedSalesTable, setArchivedSalesTable] = useState<ReactNode>();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const townList = useRecoilValue(townState);
  const venueDict = useRecoilValue(venueState);
  const bookings = useRecoilState(bookingJumpState);
  const [bookingsSelection, setBookingsSelection] = useState([]);
  const { selected: productionId, productions } = useRecoilValue(productionJumpState);
  const { selectedBooking } = props;
  useImperativeHandle(ref, () => ({
    resetData: () => {
      setArchivedSalesTable(<div />);
    },
  }));

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

    try {
      const selectedBookings = selection.map((obj) => obj.bookingId);
      const { data } = await axios.post('/api/marketing/sales/read/archived', { bookingIds: selectedBookings });

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
            />
          </div>,
        );
        setArchivedDataAvail(true);
        setShowArchSalesModal(false);
      } else {
        setErrorMessage('There are no sales data available for this particular selection.');
      }
    } catch (exception) {
      console.log(exception);
    }
  };

  const onArchivedSalesReport = async () => {
    const selectedVenue = bookings[0].bookings?.filter((booking) => booking.Id === bookings[0].selected);
    const venueAndDate = selectedVenue?.[0]?.Venue?.Code + ' ' + selectedVenue?.[0]?.Venue?.Name;
    const selectedProduction = productions?.filter((production) => production.Id === productionId);
    const { ShowName, ShowCode, Code } = selectedProduction[0];
    const productionName = `${ShowCode + Code} ${ShowName}`;
    const payload = {
      bookingsSelection,
      venueAndDate,
      productionName,
    };
    await exportExcelReport(
      '/api/reports/marketing/archived-sales',
      payload,
      `${productionName} ${selectedVenue?.[0]?.Venue?.Name} Archived Sales`,
    );
  };

  const onExport = () => {
    notify.promise(onArchivedSalesReport(), {
      loading: 'Generating archived sales report',
      success: 'Archived sales report downloaded successfully',
      error: 'Error generating archived sales report',
    });
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
                onClick={() => onExport()}
              />

              <ArchSalesDialog
                show={showArchSalesModal}
                variant={archSaleVariant}
                data={archivedData}
                onCancel={() => setShowArchSalesModal(false)}
                onSubmit={(bookings) => {
                  showArchivedSales(bookings);
                  setBookingsSelection(bookings);
                }}
                error={errorMessage}
                selectedBookingId={selectedBooking}
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
