import { useEffect, useState, useRef } from 'react';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Select from 'components/core-ui-lib/Select';
import { useRecoilValue } from 'recoil';
import { venueState } from 'state/booking/venueState';
import classNames from 'classnames';
import Button from 'components/core-ui-lib/Button';
import SalesTable from 'components/global/salesTable';
import { SalesTableVariant } from 'components/global/salesTable/SalesTable';
import useAxios from 'hooks/useAxios';
import styled from 'styled-components';
import { Spinner } from 'components/global/Spinner';
import { BookingSelection, SalesComparison, SalesSnapshot } from 'types/MarketingTypes';
import { SalesComp, SelectedBooking } from 'components/global/salesTable/utils/salesComparision';
import { productionJumpState } from 'state/booking/productionJumpState';
import ExportModal from 'components/core-ui-lib/ExportModal';
import { exportToExcel, exportToPDF } from 'utils/export';
import axios from 'axios';
import { venueHistoryOptionsSelector } from 'state/booking/selectors/venueHistoryOptionsSelector';

interface VenueHistoryProps {
  visible: boolean;
  onCancel: () => void;
}

type TableWrapperProps = {
  multiplier: number;
};

const TableWrapper = styled.div<TableWrapperProps>`
  width: ${(props) => (props.multiplier > 4 ? '1345px' : `${props.multiplier * 300 + 100}px`)};
  max-width: 100%; /* Ensure it doesn't exceed the viewport width */
  overflow-x: auto; /* Show horizontal scrollbar when content overflows */
`;

export const VenueHistory = ({ visible = false, onCancel }: VenueHistoryProps) => {
  const [showVenueSelectModal, setShowVenueSelect] = useState<boolean>(visible);
  const [showCompSelectModal, setShowCompSelect] = useState<boolean>(false);
  const [showResultsModal, setShowResults] = useState<boolean>(false);
  const [selectedBookings, setSelBookings] = useState<Array<SelectedBooking>>([]); // patch fix just to make available on main
  const [venueSelectView, setVenueSelectView] = useState<string>('select');
  const [showSalesSnapshot, setShowSalesSnapshot] = useState<boolean>(false);
  const [venueID, setVenueID] = useState(null);
  const venueDict = useRecoilValue(venueState);
  const [loading, setLoading] = useState<boolean>(false);
  const [prodCompData, setProdCompData] = useState<Array<BookingSelection>>();
  const [salesCompData, setSalesCompData] = useState<SalesComp>();
  const [salesSnapData, setSalesSnapData] = useState<Array<SalesSnapshot>>();
  const [errorMessage, setErrorMessage] = useState('');
  const { productions } = useRecoilValue(productionJumpState);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const salesTableRef = useRef(null);

  const { fetchData } = useAxios();

  const handleModalCancel = () => onCancel?.();
  const [venueDesc, setVenueDesc] = useState<string>('');
  const [excelFilename, setExcelFilename] = useState<string>('');

  const venueOptions = useRecoilValue(venueHistoryOptionsSelector([]));

  useEffect(() => {
    setShowVenueSelect(visible);
  }, [visible]);

  const exportTable = (key: string) => {
    const extraContent = { fileName: `Venue History ${excelFilename}` };
    if (key === 'Excel') {
      exportToExcel(salesTableRef, extraContent);
    } else if (key === 'PDF') {
      exportToPDF(salesTableRef);
    }
  };

  const toggleModal = (type: SalesTableVariant) => {
    setLoading(false);
    switch (type) {
      case 'prodComparision':
        setSelBookings([]);
        setShowCompSelect(true);
        setShowVenueSelect(false);
        break;

      case 'salesComparison':
        setShowResults(true);
        setShowCompSelect(false);
        break;

      case 'salesSnapshot':
        setShowSalesSnapshot(true);
    }
  };

  const getBookingSelection = async (venueID: string | number) => {
    const venue = venueDict[venueID];
    if (venue === undefined) {
      return;
    }
    setVenueDesc(venue.Code + ' ' + venue.Name + ' | ' + venue.Town);
    // Split venue name by spacing
    // Check is town name is at the end of the spacing
    const strs: string[] = venue.Name.split('');
    setExcelFilename(
      venue.Code +
        ' ' +
        venue.Name +
        (strs[strs.length - 1].toLowerCase() === venue.Town.toLowerCase() ? ' ' + venue.Town : ''),
    );
    setVenueID(venueID);

    setLoading(true);
    try {
      const data = await fetchData({
        url: '/api/marketing/archived-sales/booking-selection/read',
        method: 'POST',
        data: {
          salesByType: 'venue',
          venueCode: venue.Code,
        },
      });

      if (Array.isArray(data) && data.length > 0) {
        const bookingData = data as Array<BookingSelection>;

        // Sort data by BookingFirstDate in descending order (newest production to oldest)
        const sortedData = bookingData.sort(
          (a, b) => new Date(b.BookingFirstDate).getTime() - new Date(a.BookingFirstDate).getTime(),
        );

        setProdCompData(sortedData);
        toggleModal('prodComparision');
      } else {
        setVenueSelectView('error');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getProdComparision = async () => {
    setErrorMessage('');
    if (selectedBookings.length < 1) {
      setErrorMessage('Please select at least 1 venue.');
      return;
    }
    setLoading(true);

    const data = (
      await axios.post('/api/marketing/sales/read/archived', {
        bookingIds: selectedBookings.map((obj) => obj.bookingId),
      })
    )?.data;

    if (Array.isArray(data) && data.length !== 0) {
      const salesComp = data as Array<SalesComparison>;
      setSalesCompData({ tableData: salesComp, bookingIds: selectedBookings });
      toggleModal('salesComparison');
    } else {
      setLoading(false);
      setErrorMessage('No sales to compare for the selected productions');
    }
  };

  const getSalesSnapshot = async (bookingId: string) => {
    setErrorMessage('');
    setLoading(true);

    try {
      const { data } = await axios.post('/api/marketing/sales/read/' + bookingId);

      if (Array.isArray(data) && data.length > 0) {
        const salesData = data as Array<SalesSnapshot>;
        setSalesSnapData(salesData);
        toggleModal('salesSnapshot');
      } else {
        setLoading(false);
        setErrorMessage('No sales to show for this production');
      }
    } catch (exception) {
      console.log(exception);
    }
  };

  const handleBtnBack = (type: string) => {
    setLoading(false);
    setSelBookings([]);
    if (type === 'salesComparison') {
      setShowResults(false);
      setShowCompSelect(true);
    } else if (type === 'prodComparision') {
      setShowCompSelect(false);
      setShowVenueSelect(true);
    } else if (type === 'venue') {
      setVenueSelectView('select');
    }
  };

  const handleTableCellClick = (e) => {
    if (typeof e.column === 'object' && e.column.colId === 'salesBtn') {
      if (e.data.hasSalesData) getSalesSnapshot(e.data.bookingId);
    }
  };

  const selectForComparison = (selectedValue) => {
    if ('type' in selectedValue === false) {
      const tempBookings = selectedBookings;
      if (selectedValue.order === null || isNaN(selectedValue.order)) {
        const bookingToDel = tempBookings.findIndex((booking) => booking.bookingId === selectedValue.bookingId);
        if (bookingToDel > -1) {
          tempBookings.splice(bookingToDel, 1);
          setSelBookings(tempBookings);
        }
      } else {
        // check to see if the booking has previously been added
        const bookingIndex = tempBookings.findIndex((booking) => booking.bookingId === selectedValue.bookingId);
        if (bookingIndex === -1) {
          tempBookings.push({
            bookingId: selectedValue.bookingId,
            order: selectedValue.order,
            prodCode: selectedValue.prodCode,
            prodName: selectedValue.prodName,
            numPerfs: selectedValue.numPerfs,
          });
        } else {
          tempBookings[bookingIndex].order = selectedValue.order;
        }

        // if length of tempBookings is >= 2, errorMessage can be removed
        if (tempBookings.length >= 1) {
          setErrorMessage('');
        }
        setSelBookings(tempBookings);
      }
    }
  };
  return (
    <div>
      <PopupModal
        show={showVenueSelectModal}
        title="Venue History"
        titleClass="text-xl text-primary-navy font-bold"
        onClose={handleModalCancel}
      >
        <div className="w-[417px] p-2">
          {venueSelectView === 'select' ? (
            <div className="flex flex-col">
              <div className="text text-primary-navy mb-4">Please select a venue for comparison</div>

              <Select
                className={classNames('w-full !border-0 text-primary-navy')}
                options={venueOptions}
                isClearable
                isSearchable
                value={venueID}
                onChange={(value) => getBookingSelection(value as number)}
                placeholder="Please select a venue"
                label="Venue"
                testId="venue-filter"
              />

              <div className="flex justify-end w-full mt-2">
                {loading && <Spinner size="sm" className="mt-2 mr-3" />}
                <Button className="px-8 mt-2" onClick={handleModalCancel} variant="secondary" text="Cancel" />
              </div>
            </div>
          ) : (
            <div>
              <div className="text text-primary-navy">
                There are no productions listed at this venue. <br />
                Please go back and select another venue to continue.
              </div>

              <div className="float-right flex flex-row mt-5">
                <Button className="w-32" onClick={() => handleBtnBack('venue')} variant="secondary" text="Back" />
                <Button className="ml-4 w-32" variant="secondary" text="Cancel" onClick={handleModalCancel} />
              </div>
            </div>
          )}
        </div>
      </PopupModal>

      <PopupModal
        show={showCompSelectModal}
        title="Venue History"
        titleClass="text-xl text-primary-navy font-bold -mt-2"
        onClose={handleModalCancel}
        hasOverlay={showSalesSnapshot}
      >
        <div className="w-[920px] h-auto">
          <div className="text-xl text-primary-navy font-bold mb-4">{venueDesc}</div>

          {showCompSelectModal && (
            <SalesTable
              salesTableRef={salesTableRef}
              key={JSON.stringify(selectedBookings)}
              containerHeight="h-auto"
              containerWidth="w-[920px]"
              module="bookings"
              variant="prodComparision"
              onCellClick={handleTableCellClick}
              onCellValChange={selectForComparison}
              data={prodCompData}
              cellRenderParams={{ selected: selectedBookings }}
              productions={productions}
            />
          )}

          <div className="float-right flex flex-row mt-5 py-2">
            <div className="text text-base text-primary-red mr-12">{errorMessage}</div>

            {loading && <Spinner size="sm" className="mr-3" />}
            <Button className="w-32" variant="secondary" text="Back" onClick={() => handleBtnBack('prodComparision')} />
            <Button className="ml-4 w-32" onClick={handleModalCancel} variant="secondary" text="Cancel" />
            <Button className="ml-4 w-32 mr-1" variant="primary" text="Compare" onClick={() => getProdComparision()} />
          </div>
        </div>
      </PopupModal>

      <PopupModal
        show={showResultsModal}
        title="Venue History"
        titleClass="text-xl text-primary-navy font-bold -mt-2"
        onClose={handleModalCancel}
      >
        <TableWrapper multiplier={selectedBookings.length}>
          <div className="text-xl text-primary-navy font-bold mb-4">{venueDesc}</div>

          {showResultsModal && (
            <SalesTable
              salesTableRef={salesTableRef}
              containerHeight="h-auto"
              containerWidth="w-auto"
              module="bookings"
              variant="salesComparison"
              data={salesCompData}
            />
          )}
        </TableWrapper>
        <div className="float-right flex flex-row mt-5 py-2">
          <div className={classNames('text', 'text-base', 'text-primary-red', { 'mr-12': errorMessage.length > 0 })}>
            {errorMessage}
          </div>

          {loading && <Spinner size="sm" className="mr-3" />}

          <Button className="w-32" variant="secondary" text="Back" onClick={() => handleBtnBack('salesComparison')} />
          <Button
            className="ml-4 w-32"
            onClick={() => setIsExportModalOpen(true)}
            variant="primary"
            text="Export"
            iconProps={{ className: 'h-4 w-3' }}
            sufixIconName="excel"
          />
          <Button className="ml-4 w-32 mr-1" variant="primary" text="Close" onClick={handleModalCancel} />
        </div>
      </PopupModal>
      <ExportModal
        visible={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onItemClick={exportTable}
        ExportList={[
          {
            key: 'Excel',
            iconName: 'excel',
            iconProps: { fill: '#1D6F42', variant: '7xl' },
          },
          {
            key: 'PDF',
            iconName: 'document-solid',
            iconProps: { fill: 'red', variant: '7xl' },
          },
        ]}
      />

      <PopupModal
        show={showSalesSnapshot}
        title="Venue History"
        titleClass="text-xl text-primary-navy font-bold -mt-2"
        onClose={handleModalCancel}
        hasOverlay={false}
      >
        <div className="w-auto h-auto">
          <div className="text-xl text-primary-navy font-bold mb-4">{venueDesc}</div>

          <SalesTable
            salesTableRef={salesTableRef}
            containerHeight="h-auto"
            module="bookings"
            variant="salesSnapshot"
            data={salesSnapData}
          />

          <div className="float-right flex flex-row mt-5 py-2">
            <Button
              className="ml-4 mr-10 w-32"
              onClick={() => setIsExportModalOpen(true)}
              variant="primary"
              text="Export"
              iconProps={{ className: 'h-4 w-3' }}
              sufixIconName="excel"
            />
            <Button className="w-32" variant="primary" text="Close" onClick={() => setShowSalesSnapshot(false)} />
          </div>
        </div>
      </PopupModal>
    </div>
  );
};
