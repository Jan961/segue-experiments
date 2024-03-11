<<<<<<< HEAD
<<<<<<< HEAD
import { useEffect, useMemo, useRef, useState } from 'react';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Select from 'components/core-ui-lib/Select';
=======
import { useEffect, useMemo, useState } from 'react';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Typeahead from 'components/core-ui-lib/Typeahead';
>>>>>>> 057e36d (a start at SK-49-VenueHistory with the venue select modal)
=======
import { useEffect, useMemo, useState } from 'react';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Typeahead from 'components/core-ui-lib/Typeahead';
>>>>>>> 8aa7bee (a start at SK-49-VenueHistory with the venue select modal)
import { bookingState } from 'state/booking/bookingState';
import { useRecoilValue } from 'recoil';
import { venueState } from 'state/booking/venueState';
import classNames from 'classnames';
import Button from 'components/core-ui-lib/Button';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { useRouter } from 'next/router';
import SalesTable from 'components/marketing/sales/table';
import { SalesSubmit, SalesTableVariant } from 'components/marketing/sales/table/SalesTable';
import { ProdComp } from 'components/marketing/sales/table/SalesTable';
import useAxios from 'hooks/useAxios';
import styled from 'styled-components';
import { Spinner } from 'components/global/Spinner';
=======
>>>>>>> 057e36d (a start at SK-49-VenueHistory with the venue select modal)
=======
import { Spinner } from 'components/global/Spinner';
import { useRouter } from 'next/router';
<<<<<<< HEAD
import Table from 'components/core-ui-lib/Table';
import { venueHistCompColumnDefs, styleProps } from '../table/tableConfig';
import formatInputDate from 'utils/dateInputFormat';
import { productionJumpState } from 'state/booking/productionJumpState';
<<<<<<< HEAD
import { dateToSimple } from 'services/dateService';
import { GridApi, ValueService } from 'ag-grid-community';
>>>>>>> f2dd4a2 (merged main into VenueHistory and added final modal with column grouping - UI still needs tweaked and code needs tidied)
=======
import SalesTable from 'components/marketing/sales/SalesTable';
>>>>>>> b951a0f (SalesTable component added, Venue History integrates new component, table UI perfected)
=======
import SalesTable from 'components/marketing/sales/table';
import { ProdComp } from 'components/marketing/sales/table/SalesTable';
>>>>>>> 9e52513 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> 8aa7bee (a start at SK-49-VenueHistory with the venue select modal)
=======
import { Spinner } from 'components/global/Spinner';
import { useRouter } from 'next/router';
<<<<<<< HEAD
import Table from 'components/core-ui-lib/Table';
import { venueHistCompColumnDefs, styleProps } from '../table/tableConfig';
import formatInputDate from 'utils/dateInputFormat';
import { productionJumpState } from 'state/booking/productionJumpState';
<<<<<<< HEAD
import { dateToSimple } from 'services/dateService';
import { GridApi, ValueService } from 'ag-grid-community';
>>>>>>> 6849499 (merged main into VenueHistory and added final modal with column grouping - UI still needs tweaked and code needs tidied)
=======
import SalesTable from 'components/marketing/sales/SalesTable';
>>>>>>> b5184e9 (SalesTable component added, Venue History integrates new component, table UI perfected)
=======
import SalesTable from 'components/marketing/sales/table';
import { ProdComp } from 'components/marketing/sales/table/SalesTable';
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)

interface VenueHistoryProps {
  visible: boolean;
  onCancel: () => void;
}

<<<<<<< HEAD
<<<<<<< HEAD
type TableWrapperProps = {
  multiplier: number;
}

const TableWrapper = styled.div<TableWrapperProps>`width:${props => (props.multiplier * 300) + 100}px`

export const VenueHistory = ({ visible = false, onCancel }: VenueHistoryProps) => {
  const router = useRouter();

  const [showVenueSelectModal, setShowVenueSelect] = useState<boolean>(visible);
  const [showCompSelectModal, setShowCompSelect] = useState<boolean>(false);
  const [showResultsModal, setShowResults] = useState<boolean>(false);
  const [selectedBookings, setSelBookings] = useState([]); // patch fix just to make available on main
  const [venueSelectView, setVenueSelectView] = useState<string>('select');
  const [showSalesSnapshot, setShowSalesSnapshot] = useState<boolean>(false);
  const [venueID, setVenueID] = useState(null);
  const bookingDict = useRecoilValue(bookingState);
  const venueDict = useRecoilValue(venueState);
  const [loading, setLoading] = useState<boolean>(false);
  const [prodCompData, setProdCompData] = useState<any>();
  const [salesCompData, setSalesCompData] = useState<any>();
  const [salesSnapData, setSalesSnapData] = useState<any>();
  const [currView, setCurrView] = useState<SalesTableVariant>('venue');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorShown, setShowError] = useState(false);

  const { fetchData } = useAxios();

  const calculateWidthClass = () => {
    const width = ((selectedBookings.length * 300) + 50);
    return 'w-[' + width + 'px]';
  };

  const tableWidth = useMemo(() => calculateWidthClass(), [selectedBookings.length]);

  const handleModalCancel = () => onCancel?.();
  const [venueDesc, setVenueDesc] = useState<string>('');
=======
export const VenueHistory = ({ visible = false, onCancel }: VenueHistoryProps) => {
  const router = useRouter();

  const [showVenueSelectModal, setShowVenueSelect] = useState<boolean>(visible);
  const [showCompSelectModal, setShowCompSelect] = useState<boolean>(false);
  const [showResultsModal, setShowResults] = useState<boolean>(false);
  const [bookings, setBookings] = useState([]);
  const [venueSelectView, setVenueSelectView] = useState<string>('select');
  const [compData, setCompData] = useState<ProdComp>();

  const bookingDict = useRecoilValue(bookingState);
  const venueDict = useRecoilValue(venueState);


  const handleModalCancel = () => onCancel?.();
>>>>>>> 057e36d (a start at SK-49-VenueHistory with the venue select modal)

  const [venueDesc, setVenueDesc] = useState<string>('');

=======
export const VenueHistory = ({ visible = false, onCancel }: VenueHistoryProps) => {
  const router = useRouter();

  const [showVenueSelectModal, setShowVenueSelect] = useState<boolean>(visible);
  const [showCompSelectModal, setShowCompSelect] = useState<boolean>(false);
  const [showResultsModal, setShowResults] = useState<boolean>(false);
  const [bookings, setBookings] = useState([]);
  const [venueSelectView, setVenueSelectView] = useState<string>('select');
  const [compData, setCompData] = useState<ProdComp>();

  const bookingDict = useRecoilValue(bookingState);
  const venueDict = useRecoilValue(venueState);


  const handleModalCancel = () => onCancel?.();
>>>>>>> 8aa7bee (a start at SK-49-VenueHistory with the venue select modal)

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

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

  useEffect(() => {
    setShowVenueSelect(visible);
  }, [visible]);

  const showError = (error: string) => {
    alert(error)
    setErrorMessage(error);
    setShowError(true);
  }

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
  }

  const getData = (dataInput: any, view: string) => {
    switch (view) {
      case 'venue':
        if (isNaN(dataInput)) break;
        const venue = venueDict[dataInput];
        if (venue === undefined) break;
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
            if (data !== undefined && data.length > 0) {
              setProdCompData(data);
              setCurrView('prodComparision')
              toggleModal('prodComparision')
            } else {
              setVenueSelectView('error');
            }
          });
        } catch (error) {
          alert(error)
        }

        break;

      case 'prodComparision':
        setLoading(true);
        fetchData({
          url: '/api/marketing/sales/read/archived',
          method: 'POST',
          data: { bookingIds: selectedBookings.map(obj => obj.BookingId) },
        }).then((data: any) => {
          if (data !== undefined) {
            setSalesCompData({ tableData: data.response, bookingIds: selectedBookings });
            toggleModal('salesComparison')
          } else {
            showError('No sales to show');
          }
        });

        break;

      case 'salesSnapshot':
        setLoading(true);
        fetchData({
          url: '/api/marketing/sales/read/' + dataInput.toString(),
          method: 'POST',
        }).then((data: any) => {
          if (data !== undefined) {
            setSalesSnapData(data);
            toggleModal('salesSnapshot')
          } else {
            showError('No sales to show');
          }
        });
    }
  }

  const handleBtnBack = (type: string) => {
    setLoading(false);
    if (type === 'salesComparison') {
      setShowResults(false);
      setShowCompSelect(true);
      setCurrView('prodComparision')
    } else if (type === 'prodComparision') {
      setShowCompSelect(false);
      setShowVenueSelect(true);
      setCurrView('venue');
    } else if(type === 'venue'){
      setVenueSelectView('select')
    }
  }

  const handleTableCellClick = (e) => {
    if (typeof e.column === 'object' && e.column.colId === 'salesBtn') {
      getData(e.data.BookingId, 'salesSnapshot');
    }
  }

  const selectForComparison = (selectedValue) => {
    if ('type' in selectedValue === false) {
      let tempBookings = selectedBookings;
      if (selectedValue.order === null || isNaN(selectedValue.order)) {
        const bookingToDel = tempBookings.findIndex((booking) => booking.BookingId === selectedValue.BookingId);
        if (bookingToDel > -1) {
          tempBookings.splice(bookingToDel, 1);
          setSelBookings(tempBookings);
        }
      } else {
        // check to see if the booking has previously been added
        const bookingIndex = tempBookings.findIndex((booking) => booking.BookingId === selectedValue.BookingId);
        if (bookingIndex === -1) {
          tempBookings.push({
            BookingId: selectedValue.BookingId,
            order: selectedValue.order,
            prodCode: selectedValue.prodCode,
            prodName: selectedValue.prodName,
            numPerfs: selectedValue.numPerfs
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

              <div className='float-right flex flex-row'>
                {loading && (<Spinner size='sm' className='mt-4 mr-3'/>)}

                <Button
                  className="px-8 mt-4 "
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

              <div className='float-right flex flex-row mt-5'>
                <Button className="w-32" onClick={() => handleBtnBack('venue')} variant="secondary" text={'Back'} />
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
            handlePrimaryBtnClick={(r) => getData(r.data, currView)}
            handleBackBtnClick={() => handleBtnBack('prodComparision')}
            backBtnTxt='Back'
            handleCellClick={handleTableCellClick}
            showBackBtn={true}
            handleCellValChange={selectForComparison}
            data={prodCompData}
            cellRenderParams={{selected: selectedBookings}}
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
            containerHeight='h-auto'
            containerWidth='w-[1220px]'
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
=======
  const [venueId, setVenueId] = useState<number>(0);
  // const [stage, setStage] = useState<number>(0);
=======
>>>>>>> f2dd4a2 (merged main into VenueHistory and added final modal with column grouping - UI still needs tweaked and code needs tidied)

  useEffect(() => {
    setShowVenueSelect(visible);
  }, [visible]);


  const toggleModal = (type: string, data) => {
    switch (type) {
      case 'venue':
        const venue = venueDict[data];
        setVenueDesc(venue.Code + ' ' + venue.Name + ' | ' + venue.Town);

        const compData: ProdComp = {
          venueId: data,
          showCode: router.query.ShowCode.toString()
        }

        setCompData(compData);
        setShowVenueSelect(false);
        setShowCompSelect(true);
        break;

      case 'bookingList':
        setBookings(data);
        setShowCompSelect(false);
        setShowResults(true);
        break;
    }
  }

  const handleBtnBack = (type: string) => {
    if(type === 'salesComparison'){
      setShowResults(false);
      setShowCompSelect(true);
    } else if(type === 'prodComparision'){
      setShowCompSelect(false);
      setShowVenueSelect(true);
    }
  }

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

<<<<<<< HEAD
<<<<<<< HEAD
=======
  const [venueId, setVenueId] = useState<number>(0);
  // const [stage, setStage] = useState<number>(0);
=======
>>>>>>> 6849499 (merged main into VenueHistory and added final modal with column grouping - UI still needs tweaked and code needs tidied)

  useEffect(() => {
    setShowVenueSelect(visible);
  }, [visible]);


  const toggleModal = (type: string, data) => {
    switch (type) {
      case 'venue':
        const venue = venueDict[data];
        setVenueDesc(venue.Code + ' ' + venue.Name + ' | ' + venue.Town);

        const compData: ProdComp = {
          venueId: data,
          showCode: router.query.ShowCode.toString()
        }

        setCompData(compData);
        setShowVenueSelect(false);
        setShowCompSelect(true);
        break;

      case 'bookingList':
        setBookings(data);
        setShowCompSelect(false);
        setShowResults(true);
        break;
    }
  }

  const handleBtnBack = (type: string) => {
    if(type === 'salesComparison'){
      setShowResults(false);
      setShowCompSelect(true);
    } else if(type === 'prodComparision'){
      setShowCompSelect(false);
      setShowVenueSelect(true);
    }
  }

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

<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 8aa7bee (a start at SK-49-VenueHistory with the venue select modal)
        <Button
          className="px-8 mt-4 float-right"
          onClick={handleModalCancel}
          variant="secondary"
          text={'Cancel'}
        ></Button>
      </div>
    </PopupModal>
<<<<<<< HEAD
>>>>>>> 057e36d (a start at SK-49-VenueHistory with the venue select modal)
=======
=======
>>>>>>> 6849499 (merged main into VenueHistory and added final modal with column grouping - UI still needs tweaked and code needs tidied)
          <Button
            className="px-8 mt-4 float-right"
            onClick={handleModalCancel}
            variant="secondary"
            text={'Cancel'}
          ></Button>
<<<<<<< HEAD
=======
=======
>>>>>>> b5184e9 (SalesTable component added, Venue History integrates new component, table UI perfected)
              <Typeahead
                className={classNames('my-2 w-full !border-0 text-primary-navy')}
                options={VenueOptions}
                // disabled={stage !== 0}
<<<<<<< HEAD
<<<<<<< HEAD
                onChange={(value) => toggleModal('venue', parseInt(value as string, 10))}
=======
                onChange={(value) => goToVenueSelection(parseInt(value as string, 10))}
                value={venueId}
>>>>>>> b5184e9 (SalesTable component added, Venue History integrates new component, table UI perfected)
=======
                onChange={(value) => toggleModal('venue', parseInt(value as string, 10))}
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
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
<<<<<<< HEAD
>>>>>>> b951a0f (SalesTable component added, Venue History integrates new component, table UI perfected)
=======
>>>>>>> 6849499 (merged main into VenueHistory and added final modal with column grouping - UI still needs tweaked and code needs tidied)
=======
>>>>>>> b5184e9 (SalesTable component added, Venue History integrates new component, table UI perfected)
        </div>
      </PopupModal>

      <PopupModal
        show={showCompSelectModal}
        title="Venue History"
        titleClass="text-xl text-primary-navy font-bold -mt-2"
        onClose={handleModalCancel}
      >
<<<<<<< HEAD
<<<<<<< HEAD
        <div className="w-[920px] h-auto">
          <div className="text-xl text-primary-navy font-bold mb-4">{venueDesc}</div>

          <SalesTable
            containerHeight='h-auto'
            containerWidth='w-[920px]'
            module='bookings'
            data={compData}
            variant='prodComparision'
            primaryBtnTxt='Compare'
            showPrimaryBtn={true}
            secondaryBtnText='Cancel'
            showSecondaryBtn={true}
            handleSecondaryBtnClick={handleModalCancel}
            handlePrimaryBtnClick={(bookings) => toggleModal('bookingList', bookings)}
            handleBackBtnClick={() => handleBtnBack('prodComparision')}
            showBackBtn={true}
            //handleError={() => setVenueSelectView('error')}
          />

=======
        <div className="w-[1000px] h-[532px]">
          <div className="text-xl text-primary-navy font-bold -mt-2">{venueDesc}</div>
=======
        <div className="w-[920px] h-auto">
          <div className="text-xl text-primary-navy font-bold mb-4">{venueDesc}</div>
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)

          <SalesTable
            containerHeight='h-auto'
            containerWidth='w-[920px]'
            module='bookings'
            data={compData}
            variant='prodComparision'
            primaryBtnTxt='Compare'
            showPrimaryBtn={true}
            secondaryBtnText='Cancel'
            showSecondaryBtn={true}
            handleSecondaryBtnClick={handleModalCancel}
            handlePrimaryBtnClick={(bookings) => toggleModal('bookingList', bookings)}
            handleBackBtnClick={() => handleBtnBack('prodComparision')}
            showBackBtn={true}
            //handleError={() => setVenueSelectView('error')}
          />

<<<<<<< HEAD
          <div className='float-right flex flex-row mt-5'>
            <Button className="w-32" onClick={handleModalCancel} variant="secondary" text={'Cancel'} />
            <Button
              className="ml-4 w-32"
              variant='primary'
              text='Compare'
              onClick={showResults}
            />
<<<<<<< HEAD

            <div className='float-right flex flex-row mt-5'>
              <Button className="w-32" onClick={handleModalCancel} variant="secondary" text={'Cancel'} />
              <Button
                className="ml-4 w-32"
                variant={'primary'}
                text={'Compare'}
                onClick={showResults}
              />
            </div>


          </form>
>>>>>>> 6849499 (merged main into VenueHistory and added final modal with column grouping - UI still needs tweaked and code needs tidied)
=======
          </div>
>>>>>>> b5184e9 (SalesTable component added, Venue History integrates new component, table UI perfected)
=======
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
        </div>
      </PopupModal>

      <PopupModal
        show={showResultsModal}
        title="Venue History"
        titleClass="text-xl text-primary-navy font-bold -mt-2"
        onClose={handleModalCancel}
      >
<<<<<<< HEAD
<<<<<<< HEAD
        <div className="min-w-[1000px] h-auto">
          <div className="text-xl text-primary-navy font-bold mb-4">{venueDesc}</div>

          <SalesTable
            containerHeight='h-auto'
            containerWidth='w-auto'
            module='bookings'
            data={bookings}
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
          />
        </div>
      </PopupModal>
    </div>
>>>>>>> f2dd4a2 (merged main into VenueHistory and added final modal with column grouping - UI still needs tweaked and code needs tidied)
=======
>>>>>>> 8aa7bee (a start at SK-49-VenueHistory with the venue select modal)
=======
=======
        <div className="min-w-[1000px] h-auto">
          <div className="text-xl text-primary-navy font-bold mb-4">{venueDesc}</div>
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)

          <SalesTable
            containerHeight='h-auto'
            containerWidth='w-auto'
            module='bookings'
            data={bookings}
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
          />
        </div>
      </PopupModal>
    </div>
>>>>>>> 6849499 (merged main into VenueHistory and added final modal with column grouping - UI still needs tweaked and code needs tidied)
  );
};
