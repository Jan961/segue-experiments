import { useEffect, useMemo, useRef, useState } from 'react';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Typeahead from 'components/core-ui-lib/Typeahead';
import { bookingState } from 'state/booking/bookingState';
import { useRecoilValue } from 'recoil';
import { venueState } from 'state/booking/venueState';
import classNames from 'classnames';
import Button from 'components/core-ui-lib/Button';
import { useRouter } from 'next/router';
import SalesTable from 'components/marketing/sales/table';
import { SalesSubmit, SalesTableVariant } from 'components/marketing/sales/table/SalesTable';
import { ProdComp } from 'components/marketing/sales/table/SalesTable';
import useAxios from 'hooks/useAxios';

interface VenueHistoryProps {
  visible: boolean;
  onCancel: () => void;
}


export const VenueHistory = ({ visible = false, onCancel }: VenueHistoryProps) => {
  const router = useRouter();

  const [showVenueSelectModal, setShowVenueSelect] = useState<boolean>(visible);
  const [showCompSelectModal, setShowCompSelect] = useState<boolean>(false);
  const [showResultsModal, setShowResults] = useState<boolean>(false);
  const [selectedBookings, setSelBookings] = useState([]); // patch fix just to make available on main
  const [venueSelectView, setVenueSelectView] = useState<string>('select');
  const [showSalesSnapshot, setShowSalesSnapshot] = useState<boolean>(false);
  const [bookingId, setBookingId] = useState(0);
  const [venueID, setVenueID] = useState(null);
  const bookingDict = useRecoilValue(bookingState);
  const venueDict = useRecoilValue(venueState);
  const [loading, setLoading] = useState<boolean>(false);
  const [prodCompData, setProdCompData] = useState<any>();
  const [salesCompData, setSalesCompData] = useState<any>();
  const [salesSnapData, setSalesSnapData] = useState<any>();
  const [currView, setCurrView] = useState<SalesTableVariant>('venue');

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

  const showError = (error: string) => {
    alert(error);
  }

  const toggleModal = (type: SalesTableVariant) => {
    switch (type) {
      case 'prodComparision':
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
  }

  const getData = (dataInput: any) => {
    switch (currView) {
      case 'venue':
        if(isNaN(dataInput)) break;
        const venue = venueDict[dataInput];
        if(venue.Code === undefined) break;
        setVenueDesc(venue.Code + ' ' + venue.Name + ' | ' + venue.Town);
        setVenueID(dataInput)
        setLoading(true);

        try {
          fetchData({
            url: '/api/marketing/archivedSales/bookingSelection',
            method: 'POST',
            data: {
              salesByType: 'venue',
              venueCode: venue.Code,
              showCode: router.query.ShowCode.toString()
            },
          }).then((data: any) => {
            if (data !== undefined) {
              setProdCompData(data);
              setCurrView('prodComparision')
              toggleModal('prodComparision')
            } else {
              showError('No comparision data for this venue');
            }
          });
        } catch (error) {
          alert(error)
        }

        break;

      case 'prodComparision':
        fetchData({
          url: '/api/marketing/sales/read/archived',
          method: 'POST',
          data: { bookingIds: selectedBookings.map(obj => obj.BookingId) },
        }).then((data: any) => {
          if (data !== undefined) {
            setSalesCompData({tableData: data.response, bookingIds: selectedBookings});
            setCurrView('salesComparison')
            toggleModal('salesComparison')
          } else {
            showError('No sales to show');
          }
        });

        break;

      case 'salesSnapshot':
        fetchData({
          url: '/api/marketing/sales/read/' + dataInput.toString(),
          method: 'POST',
        }).then((data: any) => {
          if (data !== undefined) {
            console.log(data)
            setSalesSnapData(data);
            setCurrView('salesSnapshot')
            toggleModal('salesSnapshot')
          } else {
            showError('No sales to show');
          }
        });
    }
  }

  const handleBtnBack = (type: string) => {
    if (type === 'salesComparison') {
      setShowResults(false);
      setShowCompSelect(true);
    } else if (type === 'prodComparision') {
      setShowCompSelect(false);
      setShowVenueSelect(true);
    }
  }

  const handleTableCellClick = (e) => {
    if (typeof e.column === 'object' && e.column.colId === 'salesBtn') {
     getData(e.data.BookingId);
    }
  }

  const selectForComparison = (selectedValue) => {
    if ('type' in selectedValue === false) {
      let tempBookings = selectedBookings;
      if (selectedValue.order === null) {
        const bookingToDel = tempBookings.findIndex((booking) => booking.BookingId === selectedValue.BookingId);
        if (bookingToDel > -1) {
          tempBookings.splice(bookingToDel, 1);
          setSelBookings(tempBookings);
        }
      } else {
        tempBookings.push({
          BookingId: selectedValue.BookingId,
          order: selectedValue.order,
          prodCode: selectedValue.prodCode,
          prodName: selectedValue.prodName,
          numPerfs: selectedValue.numPerfs
        });

        // if length of tempBookings is >= 2, errorMessage can be removed
        // if (tempBookings.length >= 2) {
        //   setErrorMessage('');
        // }

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
        <div className="w-[417px] h-[130px]">

          {venueSelectView === 'select' ? (
            <div>
              <div className="text text-primary-navy">Please select a venue for comparision</div>

              <Typeahead
                className={classNames('my-2 w-full !border-0 text-primary-navy')}
                options={VenueOptions}
                isClearable
                isSearchable
                value={venueID}
                onChange={(value) => getData(value)}
                placeholder={'Please select a venue'}
                label="Venue"
              />

              <Button
                className="px-8 mt-4 float-right"
                onClick={handleModalCancel}
                variant="secondary"
                text={'Cancel'}
              ></Button>
            </div>

          ) : (
            <div>
              <div className="text text-primary-navy">
                There are no productions listed at this venue. <br />
                Please go back and select another venue to continue.
              </div>

              <div className='float-right flex flex-row mt-5'>
                <Button className="w-32" onClick={() => setVenueSelectView('select')} variant="secondary" text={'Back'} />
                <Button
                  className="ml-4 w-32"
                  variant='secondary'
                  text='Cancel'
                  onClick={handleModalCancel}
                />
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
            containerHeight='h-auto'
            containerWidth='w-[920px]'
            module='bookings'
            variant='prodComparision'
            primaryBtnTxt='Compare'
            showPrimaryBtn={true}
            secondaryBtnText='Cancel'
            showSecondaryBtn={true}
            handleSecondaryBtnClick={handleModalCancel}
            handlePrimaryBtnClick={(r) => getData(r.data)}
            handleBackBtnClick={() => handleBtnBack('prodComparision')}
            backBtnTxt='Back'
            handleCellClick={handleTableCellClick}
            showBackBtn={true}
            handleCellValChange={selectForComparison}
            data={prodCompData}
          />

        </div>
      </PopupModal>

      <PopupModal
        show={showResultsModal}
        title="Venue History"
        titleClass="text-xl text-primary-navy font-bold -mt-2"
        onClose={handleModalCancel}
      >
        <div className="min-w-[1000px] h-auto">
          <div className="text-xl text-primary-navy font-bold mb-4">{venueDesc}</div>

          <SalesTable
            containerHeight='h-auto'
            containerWidth='w-auto'
            module='bookings'
            variant='salesComparison'
            showExportBtn={true}
            showSecondaryBtn={true}
            secondaryBtnText='Export'
            primaryBtnTxt='Close'
            handleSecondaryBtnClick={() => alert('Export to Excel - SK-129')}
            handlePrimaryBtnClick={() => setShowResults(false)}
            showPrimaryBtn={true}
            handleBackBtnClick={() => handleBtnBack('salesComparison')}
            showBackBtn={true}
            backBtnTxt='Back'
            data={salesCompData}
          />
        </div>
      </PopupModal>

      <PopupModal
        show={showSalesSnapshot}
        title="Venue History"
        titleClass="text-xl text-primary-navy font-bold -mt-2"
        onClose={handleModalCancel}
        hasOverlay={false}
      >
        <div className="w-[920px] h-auto">
          <div className="text-xl text-primary-navy font-bold mb-4">{venueDesc}</div>

          <SalesTable
            containerHeight='h-auto'
            containerWidth='w-[920px]'
            module='bookings'
            variant='salesSnapshot'
            primaryBtnTxt='Back'
            showPrimaryBtn={true}
            handlePrimaryBtnClick={() => setShowSalesSnapshot(false)}
            data={salesSnapData}
          />

        </div>
      </PopupModal>
    </div>
  );
};
