import { useEffect, useMemo, useState } from 'react';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Select from 'components/core-ui-lib/Select';
import { bookingState } from 'state/booking/bookingState';
import { useRecoilValue } from 'recoil';
import { venueState } from 'state/booking/venueState';
import classNames from 'classnames';
import Button from 'components/core-ui-lib/Button';
import { useRouter } from 'next/router';
import SalesTable from 'components/marketing/sales/table';
import { SalesTableVariant } from 'components/marketing/sales/table/SalesTable';
import useAxios from 'hooks/useAxios';
import styled from 'styled-components';
import { Spinner } from 'components/global/Spinner';
import { BookingSelectionView } from 'pages/api/marketing/archivedSales/bookingSelection';
import { SalesComparison, SalesSnapshot } from 'types/MarketingTypes';

interface VenueHistoryProps {
  visible: boolean;
  onCancel: () => void;
}

type TableWrapperProps = {
  multiplier: number;
};

type SelectedBooking = {
  BookingId: string;
  order: number;
  prodCode: string;
  prodName: string;
  numPerfs: number;
};

export type SalesComp = {
  tableData: Array<SalesComparison>;
  bookingIds: Array<SelectedBooking>;
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
  const [prodCompData, setProdCompData] = useState<Array<BookingSelectionView>>();
  const [salesCompData, setSalesCompData] = useState<SalesComp>();
  const [salesSnapData, setSalesSnapData] = useState<Array<SalesSnapshot>>();
  const [currView, setCurrView] = useState<SalesTableVariant>('venue');
  const [errorMessage, setErrorMessage] = useState('');

  const { fetchData } = useAxios();

  const handleModalCancel = () => onCancel?.();
  const [venueDesc, setVenueDesc] = useState<string>('');

  const VenueOptions = useMemo(() => {
    const options = [];
    const currentProductionVenues = Object.values(bookingDict).map((booking) => booking.VenueId);
    for (const venueId in venueDict) {
      const venue = venueDict[venueId];
      const option = {
        text: `${venue.Code} ${venue?.Name} ${venue?.Town}`,
        value: venue?.Id,
      };
      if (currentProductionVenues.includes(parseInt(venueId, 10))) {
        continue;
      }
      options.push(option);
    }
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

  const getData = (dataInput: string | number, view: string) => {
    setErrorMessage('');
    switch (view) {
      case 'venue': {
        if (typeof dataInput === 'number' && isNaN(dataInput)) {
          break;
        }
        const venue = venueDict[dataInput];
        if (venue === undefined) {
          break;
        }
        setVenueDesc(venue.Code + ' ' + venue.Name + ' | ' + venue.Town);
        setVenueID(dataInput);

        setLoading(true);
        try {
          fetchData({
            url: '/api/marketing/archivedSales/bookingSelection',
            method: 'POST',
            data: {
              salesByType: 'venue',
              venueCode: venue.Code,
              showCode: router.query.ShowCode.toString(),
            },
          })
            .then((data) => {
              if (Array.isArray(data) && data.length > 0) {
                const bookingData = data as Array<BookingSelectionView>;

                // Sort data by BookingFirstDate in descending order (newest production to oldest)
                const sortedData = bookingData.sort(
                  (a, b) => new Date(b.BookingFirstDate).getTime() - new Date(a.BookingFirstDate).getTime(),
                );

                setProdCompData(sortedData);
                setCurrView('prodComparision');
                toggleModal('prodComparision');
              } else {
                setVenueSelectView('error');
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } catch (error) {
          console.log(error);
        }

        break;
      }

      case 'prodComparision': {
        if (selectedBookings.length < 2) {
          setErrorMessage('Please select at least 2 venues for comparison.');
          return;
        }

        setLoading(true);
        fetchData({
          url: '/api/marketing/sales/read/archived',
          method: 'POST',
          data: { bookingIds: selectedBookings.map((obj) => obj.BookingId) },
        }).then((data: any) => {
          if (Array.isArray(data.reponse) && data.response.length > 0) {
            const salesComp = data.response as Array<SalesComparison>;
            setSalesCompData({ tableData: salesComp, bookingIds: selectedBookings });
            toggleModal('salesComparison');
          } else {
            setLoading(false);
            setErrorMessage('No sales to compare for the selected productions');
          }
        });

        break;
      }

      case 'salesSnapshot': {
        setLoading(true);
        fetchData({
          url: '/api/marketing/sales/read/' + dataInput.toString(),
          method: 'POST',
        }).then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const salesData = data as Array<SalesSnapshot>;
            setSalesSnapData(salesData);
            toggleModal('salesSnapshot');
          } else {
            setLoading(false);
            setErrorMessage('No sales to show for this production');
          }
        });
      }
    }
  };

  const handleBtnBack = (type: string) => {
    setLoading(false);
    if (type === 'salesComparison') {
      setShowResults(false);
      setShowCompSelect(true);
      setCurrView('prodComparision');
    } else if (type === 'prodComparision') {
      setShowCompSelect(false);
      setShowVenueSelect(true);
      setCurrView('venue');
    } else if (type === 'venue') {
      setVenueSelectView('select');
    }
  };

  const handleTableCellClick = (e) => {
    if (typeof e.column === 'object' && e.column.colId === 'salesBtn') {
      getData(e.data.BookingId, 'salesSnapshot');
    }
  };

  const selectForComparison = (selectedValue) => {
    if (!('type' in selectedValue)) {
      setSelBookings((prevBookings) => {
        const tempBookings = [...prevBookings]; // Create a copy to avoid directly mutating state

        if (selectedValue.order === null || isNaN(selectedValue.order)) {
          const bookingToDel = tempBookings.findIndex((booking) => booking.BookingId === selectedValue.BookingId);
          if (bookingToDel > -1) {
            tempBookings.splice(bookingToDel, 1);
            // Directly returning the new state here, no need to call setSelBookings again
          }
        } else {
          const bookingIndex = tempBookings.findIndex((booking) => booking.BookingId === selectedValue.BookingId);
          if (bookingIndex === -1) {
            // Adding a new booking
            tempBookings.push({
              BookingId: selectedValue.BookingId,
              order: selectedValue.order,
              prodCode: selectedValue.prodCode,
              prodName: selectedValue.prodName,
              numPerfs: selectedValue.numPerfs,
            });
          } else {
            // Updating an existing booking
            tempBookings[bookingIndex] = { ...tempBookings[bookingIndex], order: selectedValue.order };
          }
        }

        // If length of tempBookings is >= 2, errorMessage can be removed
        if (tempBookings.length >= 2) {
          setErrorMessage('');
        }

        return tempBookings; // Return the new state
      });
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
        <div className="w-[417px] h-[130px]">
          {venueSelectView === 'select' ? (
            <div>
              <div className="text text-primary-navy">Please select a venue for comparision</div>

              <Select
                className={classNames('my-2 w-full !border-0 text-primary-navy')}
                options={VenueOptions}
                isClearable
                isSearchable
                value={venueID}
                onChange={(value) => getData(value, currView)}
                placeholder={'Please select a venue'}
                label="Venue"
              />

              <div className="float-right flex flex-row">
                {loading && <Spinner size="sm" className="mt-4 mr-3" />}

                <Button className="px-8 mt-4 " onClick={handleModalCancel} variant="secondary" text={'Cancel'}></Button>
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

          <SalesTable
            key={JSON.stringify(selectedBookings)} // forces remount everytime selectedBookings is
            containerHeight="h-auto"
            containerWidth="w-[920px]"
            module="bookings"
            variant="prodComparision"
            primaryBtnTxt="Compare"
            showPrimaryBtn={true}
            secondaryBtnText="Cancel"
            showSecondaryBtn={true}
            handleSecondaryBtnClick={handleModalCancel}
            handlePrimaryBtnClick={() => getData('', currView)}
            handleBackBtnClick={() => handleBtnBack('prodComparision')}
            backBtnTxt="Back"
            handleCellClick={handleTableCellClick}
            showBackBtn={true}
            handleCellValChange={selectForComparison}
            data={prodCompData}
            cellRenderParams={{ selected: selectedBookings }}
            processing={loading}
            errorMessage={errorMessage}
          />
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

          <SalesTable
            containerHeight="h-auto"
            containerWidth="w-auto"
            module="bookings"
            variant="salesComparison"
            showExportBtn={true}
            showSecondaryBtn={true}
            secondaryBtnText="Export"
            primaryBtnTxt="Close"
            handleSecondaryBtnClick={() => alert('Export to Excel - SK-129')}
            handlePrimaryBtnClick={() => setShowResults(false)}
            showPrimaryBtn={true}
            handleBackBtnClick={() => handleBtnBack('salesComparison')}
            showBackBtn={true}
            backBtnTxt="Back"
            data={salesCompData}
            processing={loading}
            errorMessage={errorMessage}
          />
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
            handlePrimaryBtnClick={() => setShowSalesSnapshot(false)}
            data={salesSnapData}
            processing={loading}
            errorMessage={errorMessage}
          />
        </div>
      </PopupModal>
    </div>
  );
};
