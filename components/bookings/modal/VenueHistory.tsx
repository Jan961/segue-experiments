import { useEffect, useMemo, useState } from 'react';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Select from 'components/core-ui-lib/Select';
import { bookingState } from 'state/booking/bookingState';
import { useRecoilValue } from 'recoil';
import { venueState } from 'state/booking/venueState';
import classNames from 'classnames';
import Button from 'components/core-ui-lib/Button';
import { useRouter } from 'next/router';
import SalesTable from 'components/global/salesTable';
import { SalesTableVariant } from 'components/global/salesTable/SalesTable';
import useAxios from 'hooks/useAxios';
import styled from 'styled-components';
import { Spinner } from 'components/global/Spinner';
import { BookingSelection , SalesComparison, SalesSnapshot } from 'types/MarketingTypes';
import { SalesComp, SelectedBooking } from 'components/global/salesTable/utils/salesComparision';
import { productionJumpState } from 'state/booking/productionJumpState';

interface VenueHistoryProps {
  visible: boolean;
  onCancel: () => void;
}

type TableWrapperProps = {
  multiplier: number;
};

const TableWrapper = styled.div<TableWrapperProps>`
  width: ${(props) => (props.multiplier > 4 ? '1300px' : `${props.multiplier * 300 + 100}px`)};
  max-width: 100%; /* Ensure it doesn't exceed the viewport width */
  overflow-x: auto; /* Show horizontal scrollbar when content overflows */
`;

export const VenueHistory = ({ visible = false, onCancel }: VenueHistoryProps) => {
  const router = useRouter();

  const [showVenueSelectModal, setShowVenueSelect] = useState<boolean>(visible);
  const [showCompSelectModal, setShowCompSelect] = useState<boolean>(false);
  const [showResultsModal, setShowResults] = useState<boolean>(false);
  const [selectedBookings, setSelBookings] = useState<Array<SelectedBooking>>([]); // patch fix just to make available on main
  const [venueSelectView, setVenueSelectView] = useState<string>('select');
  const [showSalesSnapshot, setShowSalesSnapshot] = useState<boolean>(false);
  const [venueID, setVenueID] = useState(null);
  const bookingDict = useRecoilValue(bookingState);
  const venueDict = useRecoilValue(venueState);
  const [loading, setLoading] = useState<boolean>(false);
  const [prodCompData, setProdCompData] = useState<Array<BookingSelection>>();
  const [salesCompData, setSalesCompData] = useState<SalesComp>();
  const [salesSnapData, setSalesSnapData] = useState<Array<SalesSnapshot>>();
  const [errorMessage, setErrorMessage] = useState('');
  const { productions } = useRecoilValue(productionJumpState);

  const { fetchData } = useAxios();

  const handleModalCancel = () => onCancel?.();
  const [venueDesc, setVenueDesc] = useState<string>('');

  const venueOptions = useMemo(() => {
    const options = [];
    for (const venueId in venueDict) {
      const venue = venueDict[venueId];
      const option = {
        text: `${venue.Code} ${venue?.Name} ${venue?.Town}`,
        value: venue?.Id,
      };
      options.push(option);
    }
    options.sort((a, b) => a.text.localeCompare(b.text));
    return options;
  }, [venueDict, bookingDict]);

  useEffect(() => {
    setShowVenueSelect(visible);
  }, [visible]);

  const toggleModal = (type: SalesTableVariant) => {
    setLoading(false);
    switch (type) {
      case 'prodComparision':
        setSelBookings([]);
        setShowVenueSelect(false);
        setShowCompSelect(true);
        break;

      case 'salesComparison':
        setShowCompSelect(false);
        setShowResults(true);
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
    setVenueID(venueID);

    setLoading(true);
    try {
      const data = await fetchData({
        url: '/api/marketing/archivedSales/bookingSelection',
        method: 'POST',
        data: {
          salesByType: 'venue',
          venueCode: venue.Code,
          showCode: router.query.ShowCode.toString(),
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
    if (selectedBookings.length < 2) {
      setErrorMessage('Please select at least 2 venues for comparison.');
      return;
    }

    setLoading(true);
    const data = await fetchData({
      url: '/api/marketing/sales/read/archived',
      method: 'POST',
      data: { bookingIds: selectedBookings.map((obj) => obj.bookingId) },
    });

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
    const data = await fetchData({
      url: '/api/marketing/sales/read/' + bookingId,
      method: 'POST',
    });

    if (Array.isArray(data) && data.length > 0) {
      const salesData = data as Array<SalesSnapshot>;
      setSalesSnapData(salesData);
      toggleModal('salesSnapshot');
    } else {
      setLoading(false);
      setErrorMessage('No sales to show for this production');
    }
  };

  const handleBtnBack = (type: string) => {
    setLoading(false);
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
      getSalesSnapshot(e.data.bookingId);
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
        if (tempBookings.length >= 2) {
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
        titleClass="text-xl text-primary-navy font-bold -mt-2"
        onClose={handleModalCancel}
      >
        <div className="w-[417px]">
          {venueSelectView === 'select' ? (
            <div>
              <div className="text text-primary-navy">Please select a venue for comparision</div>

              <Select
                className={classNames('my-2 w-full !border-0 text-primary-navy')}
                options={venueOptions}
                isClearable
                isSearchable
                value={venueID}
                onChange={(value) => getBookingSelection(value)}
                placeholder={'Please select a venue'}
                label="Venue"
              />

              <div className="float-right flex flex-row">
                {loading && <Spinner size="sm" className="mt-2 mr-3 -mb-1" />}
                <Button
                  className="px-8 mt-2 -mb-1"
                  onClick={handleModalCancel}
                  variant="secondary"
                  text={'Cancel'}
                ></Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="text text-primary-navy">
                There are no productions listed at this venue. <br />
                Please go back and select another venue to continue.
              </div>

              <div className="float-right flex flex-row mt-5">
                <Button className="w-32" onClick={() => handleBtnBack('venue')} variant="secondary" text={'Back'} />
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
              containerHeight="h-auto"
              containerWidth="w-auto"
              module="bookings"
              variant="salesComparison"
              data={salesCompData}
            />
          )}

          <div className="float-right flex flex-row mt-5 py-2">
            <div className="text text-base text-primary-red mr-12">{errorMessage}</div>

            {loading && <Spinner size="sm" className="mr-3" />}

            <Button className="w-32" variant="secondary" text="Back" onClick={() => handleBtnBack('salesComparison')} />
            <Button
              className="ml-4 w-32"
              onClick={() => alert('Export to Excel - SK-129')}
              variant="primary"
              text="Export"
              iconProps={{ className: 'h-4 w-3' }}
              sufixIconName="excel"
            />
            <Button className="ml-4 w-32 mr-1" variant="primary" text="Close" onClick={() => setShowResults(false)} />
          </div>
        </TableWrapper>
      </PopupModal>

      <PopupModal
        show={showSalesSnapshot}
        title="Venue History"
        titleClass="text-xl text-primary-navy font-bold -mt-2"
        onClose={handleModalCancel}
        hasOverlay={false}
      >
        <div className="w-[1220px] h-auto">
          <div className="text-xl text-primary-navy font-bold mb-4">{venueDesc}</div>

          <SalesTable
            containerHeight="h-auto"
            containerWidth="w-[1220px]"
            module="bookings"
            variant="salesSnapshot"
            primaryBtnTxt="Back"
            showPrimaryBtn={true}
            onPrimaryBtnClick={() => setShowSalesSnapshot(false)}
            data={salesSnapData}
            processing={loading}
            errorMessage={errorMessage}
          />

          <div className="float-right flex flex-row mt-5 py-2">
            <Button className="w-32" variant="primary" text="Close" onClick={() => setShowSalesSnapshot(false)} />
          </div>
        </div>
      </PopupModal>
    </div>
  );
};