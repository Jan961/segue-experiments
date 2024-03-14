<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { useEffect, useMemo, useRef, useState } from 'react';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Select from 'components/core-ui-lib/Select';
=======
import { useEffect, useMemo, useState } from 'react';
=======
import { useEffect, useMemo, useRef, useState } from 'react';
>>>>>>> cb179e0 (restructed SalesTable component so its only used for processing the UI and does not complete any API request)
import PopupModal from 'components/core-ui-lib/PopupModal';
import Typeahead from 'components/core-ui-lib/Typeahead';
>>>>>>> 057e36d (a start at SK-49-VenueHistory with the venue select modal)
=======
import { useEffect, useMemo, useState } from 'react';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Typeahead from 'components/core-ui-lib/Typeahead';
>>>>>>> 8aa7bee (a start at SK-49-VenueHistory with the venue select modal)
=======
import { useEffect, useMemo, useState } from 'react';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Typeahead from 'components/core-ui-lib/Typeahead';
>>>>>>> 9af7f99 (a start at SK-49-VenueHistory with the venue select modal)
=======
import { useEffect, useMemo, useState } from 'react';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Typeahead from 'components/core-ui-lib/Typeahead';
>>>>>>> a4bc5b2 (a start at SK-49-VenueHistory with the venue select modal)
import { bookingState } from 'state/booking/bookingState';
import { useRecoilValue } from 'recoil';
import { venueState } from 'state/booking/venueState';
import classNames from 'classnames';
import Button from 'components/core-ui-lib/Button';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 442b778 (flow complete - ready for partial PR)
import { useRouter } from 'next/router';
import SalesTable from 'components/marketing/sales/table';
import { SalesSubmit, SalesTableVariant } from 'components/marketing/sales/table/SalesTable';
import { ProdComp } from 'components/marketing/sales/table/SalesTable';
import useAxios from 'hooks/useAxios';
<<<<<<< HEAD
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
=======
>>>>>>> 9af7f99 (a start at SK-49-VenueHistory with the venue select modal)
=======
import { Spinner } from 'components/global/Spinner';
import { useRouter } from 'next/router';
<<<<<<< HEAD
import Table from 'components/core-ui-lib/Table';
import { venueHistCompColumnDefs, styleProps } from '../table/tableConfig';
import formatInputDate from 'utils/dateInputFormat';
<<<<<<< HEAD
>>>>>>> e349e74 (SK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)
=======
>>>>>>> a4bc5b2 (a start at SK-49-VenueHistory with the venue select modal)
=======
import { productionJumpState } from 'state/booking/productionJumpState';
import SalesTable from 'components/marketing/sales/SalesTable';
>>>>>>> bdad6b3 (SalesTable component added, Venue History integrates new component, table UI perfected)
=======
import SalesTable from 'components/marketing/sales/table';
import { ProdComp } from 'components/marketing/sales/table/SalesTable';
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
>>>>>>> cb179e0 (restructed SalesTable component so its only used for processing the UI and does not complete any API request)

interface VenueHistoryProps {
  visible: boolean;
  onCancel: () => void;
}

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
<<<<<<< HEAD
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
=======
  const [bookings, setBookings] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [venueSelectView, setVenueSelectView] = useState<string>('select');
<<<<<<< HEAD
>>>>>>> bdad6b3 (SalesTable component added, Venue History integrates new component, table UI perfected)
=======
  const [compData, setCompData] = useState<ProdComp>();
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)

  const bookingDict = useRecoilValue(bookingState);
  const venueDict = useRecoilValue(venueState);


  const handleModalCancel = () => onCancel?.();
>>>>>>> 057e36d (a start at SK-49-VenueHistory with the venue select modal)

  const [venueDesc, setVenueDesc] = useState<string>('');

=======
=======

>>>>>>> cb179e0 (restructed SalesTable component so its only used for processing the UI and does not complete any API request)
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
<<<<<<< HEAD
>>>>>>> 8aa7bee (a start at SK-49-VenueHistory with the venue select modal)

  const [venueDesc, setVenueDesc] = useState<string>('');

=======
export const VenueHistory = ({ visible = false, onCancel }: VenueHistoryProps) => {
  const { fetchData } = useAxios();
  const router = useRouter();

  const [showVenueSelectModal, setShowVenueSelect] = useState<boolean>(visible);
  const [showCompSelectModal, setShowCompSelect] = useState<boolean>(false);
  // const [showResultsModal, setShowResults] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  // const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [bookings, setBookings] = useState([]);
  
=======
export const VenueHistory = ({ visible = false, onCancel }: VenueHistoryProps) => {
  const [open, setOpen] = useState<boolean>(visible);
>>>>>>> a4bc5b2 (a start at SK-49-VenueHistory with the venue select modal)
  const bookingDict = useRecoilValue(bookingState);
  const venueDict = useRecoilValue(venueState);

  const handleModalCancel = () => onCancel?.();
<<<<<<< HEAD
>>>>>>> 9af7f99 (a start at SK-49-VenueHistory with the venue select modal)

  const [venueDesc, setVenueDesc] = useState<string>('');
=======
>>>>>>> a4bc5b2 (a start at SK-49-VenueHistory with the venue select modal)

=======
  const [venueDesc, setVenueDesc] = useState<string>('');

>>>>>>> cb179e0 (restructed SalesTable component so its only used for processing the UI and does not complete any API request)
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

  useEffect(() => {
    setShowVenueSelect(visible);
  }, [visible]);

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
  const gridOptions = {
    autoSizeStrategy: {
      type: 'fitGridWidth',
      defaultMinWidth: 50,
      wrapHeaderText: true,
    },
  };
=======
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)

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

<<<<<<< HEAD

    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
>>>>>>> bdad6b3 (SalesTable component added, Venue History integrates new component, table UI perfected)
    }
  }

<<<<<<< HEAD
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

=======
  const selectForComparison = (selectedValue) => {
    let tempIds = bookings;
    if (selectedValue.order === null) {
      const bookingToDel = tempIds.findIndex(booking => booking.BookingId === selectedValue.BookingId);
      if (bookingToDel > -1) {
        tempIds.splice(bookingToDel, 1);
        setBookings(tempIds);
      }
    } else {
      tempIds.push({
        BookingId: selectedValue.BookingId,
        order: selectedValue.order,
        prodCode: selectedValue.prodCode,
        prodName: selectedValue.prodName,
        numPerfs: selectedValue.numPerfs
      });
      setBookings(tempIds);
    }
  };



  const showResults = () => {
    setShowCompSelect(false);
    setShowResults(true);
=======
      case 'bookingList':
        setBookings(data);
        setShowCompSelect(false);
        setShowResults(true);
        break;
    }
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
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

>>>>>>> bdad6b3 (SalesTable component added, Venue History integrates new component, table UI perfected)
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
=======
  const [venueId, setVenueId] = useState<number>(0);
  // const [stage, setStage] = useState<number>(0);
=======
>>>>>>> e349e74 (SK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)

  useEffect(() => {
    setShowVenueSelect(visible);
  }, [visible]);

  const goToVenueSelection = (venueID:number) => {
    const venue = venueDict[venueID];
    // setSelectedVenue(venue);
    setVenueDesc(venue.Code + ' ' + venue.Name + ' ' + venue.Town);
    setShowVenueSelect(false);
    setShowCompSelect(true);

    prepareBookingSection(venue).then((data) => {
      console.log(data);
    })
  }
  
  const prepareBookingSection = async (venue) => {
    setLoading(true);
    try {
      console.log({selectedVenue: venue, showCode: router.query.ShowCode})
      fetchData({
        url: '/api/marketing/archivedSales/bookingSelection',
        method: 'POST',
        data: { 
          salesByType: 'venue',
          venueCode: venue.Code,
          showCode: router.query.ShowCode // probably a better way of getting this now, if required
         },
      }).then((data:any) => {
        const processedBookings = [];
        data.forEach(booking => {
          processedBookings.push({
            prodNum: 'Production ' + booking.ProductionId,
            firstPerfDt: formatInputDate(booking.BookingFirstDate, '/'),
            numPerfs: 0, //need to find out where to get this
            prodWks: booking.ProductionLengthWeeks
          })
        });
        alert(JSON.stringify(processedBookings))
        setBookings(processedBookings);
        return data;
      })
    
      
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnSubmit = (e) => {
    // e.preventDefault();
    // const bookingIds = Object.keys(inputs)
    //   .sort((a, b) => inputs[a] - inputs[b])
    //   .filter((id) => inputs[id])
    //   .map((id) => parseInt(id, 10))
    //   .filter((id) => id);
    // const productions: any[] = bookingIds.map((bookingId: any) =>
    //   bookings.find((booking) => booking.BookingId === bookingId),
    // );
    // onSubmit(bookingIds, productions);

  };

  const handleCellClick = (e) => {
    console.log(e);
    // setBookingRow(e.data);
    // if (e.column.colId === 'notes') {
    //   setShowNotesModal(true);
    // }
  };

  return (
    <div>
    <PopupModal
      show={showVenueSelectModal}
=======
  const [venueId, setVenueId] = useState<number>(0);
  // const [stage, setStage] = useState<number>(0);

  useEffect(() => {
    setOpen(visible);
  }, [visible]);

  return (
    <PopupModal
      show={open}
>>>>>>> a4bc5b2 (a start at SK-49-VenueHistory with the venue select modal)
      title="Venue History"
      titleClass="text-xl text-primary-navy font-bold -mt-2"
      onClose={handleModalCancel}
    >
      <div className="w-[417px] h-[130px]">
<<<<<<< HEAD
        <div className="text text-primary-navy">Please select a venue for comparision</div>
=======
        <div className="text  text-primary-navy">Please select a venue for comparision</div>
>>>>>>> a4bc5b2 (a start at SK-49-VenueHistory with the venue select modal)

        <Typeahead
          className={classNames('my-2 w-full !border-0 text-primary-navy')}
          options={VenueOptions}
          // disabled={stage !== 0}
<<<<<<< HEAD
          onChange={(value) => goToVenueSelection(parseInt(value as string, 10))}
=======
          onChange={(value) => setVenueId(parseInt(value as string, 10))}
>>>>>>> a4bc5b2 (a start at SK-49-VenueHistory with the venue select modal)
          value={venueId}
          placeholder={'Please select a venue'}
          label="Venue"
        />

<<<<<<< HEAD
>>>>>>> 9af7f99 (a start at SK-49-VenueHistory with the venue select modal)
=======
>>>>>>> a4bc5b2 (a start at SK-49-VenueHistory with the venue select modal)
        <Button
          className="px-8 mt-4 float-right"
          onClick={handleModalCancel}
          variant="secondary"
          text={'Cancel'}
        ></Button>
      </div>
    </PopupModal>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
=======

>>>>>>> bdad6b3 (SalesTable component added, Venue History integrates new component, table UI perfected)
              <Typeahead
                className={classNames('my-2 w-full !border-0 text-primary-navy')}
                options={VenueOptions}
<<<<<<< HEAD
                // disabled={stage !== 0}
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
                isClearable
                isSearchable
                value={venueID}
<<<<<<< HEAD
>>>>>>> 442b778 (flow complete - ready for partial PR)
                onChange={(value) => toggleModal('venue', parseInt(value as string, 10))}
=======
                onChange={(value) => goToVenueSelection(parseInt(value as string, 10))}
                value={venueId}
>>>>>>> b5184e9 (SalesTable component added, Venue History integrates new component, table UI perfected)
=======
                onChange={(value) => toggleModal('venue', parseInt(value as string, 10))}
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
                onChange={(value) => goToVenueSelection(parseInt(value as string, 10))}
                value={venueId}
>>>>>>> bdad6b3 (SalesTable component added, Venue History integrates new component, table UI perfected)
=======
                onChange={(value) => toggleModal('venue', parseInt(value as string, 10))}
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
                onChange={(value) => getData(value)}
>>>>>>> cb179e0 (restructed SalesTable component so its only used for processing the UI and does not complete any API request)
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
<<<<<<< HEAD
>>>>>>> b951a0f (SalesTable component added, Venue History integrates new component, table UI perfected)
=======
>>>>>>> 6849499 (merged main into VenueHistory and added final modal with column grouping - UI still needs tweaked and code needs tidied)
=======
>>>>>>> b5184e9 (SalesTable component added, Venue History integrates new component, table UI perfected)
=======
>>>>>>> bdad6b3 (SalesTable component added, Venue History integrates new component, table UI perfected)
        </div>
      </PopupModal>

      <PopupModal
        show={showCompSelectModal}
        title="Venue History"
        titleClass="text-xl text-primary-navy font-bold -mt-2"
        onClose={handleModalCancel}
        hasOverlay={showSalesSnapshot}
      >
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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

=======
        <div className="w-[1000px] h-[532px]">
          <div className="text-xl text-primary-navy font-bold -mt-2">{venueDesc}</div>
=======
        <div className="w-[920px] h-auto">
          <div className="text-xl text-primary-navy font-bold mb-4">{venueDesc}</div>
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)

<<<<<<< HEAD
=======
        <div className="w-[920px] h-auto">
          <div className="text-xl text-primary-navy font-bold mb-4">{venueDesc}</div>

>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
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
<<<<<<< HEAD
          />

<<<<<<< HEAD
=======
          {loading && (
            <div className="w-full h-full absolute left-0 top-0 bg-white flex items-center opacity-95">
              <Spinner className="w-full" size="lg" />
            </div>
          )}

          <Table
            columnDefs={venueHistCompColumnDefs(rowData.length, selectForComparison)}
            rowData={rowData}
            styleProps={styleProps}
            gridOptions={gridOptions}
          />

>>>>>>> bdad6b3 (SalesTable component added, Venue History integrates new component, table UI perfected)
          <div className='float-right flex flex-row mt-5'>
            <Button className="w-32" onClick={handleModalCancel} variant="secondary" text={'Cancel'} />
            <Button
              className="ml-4 w-32"
              variant='primary'
              text='Compare'
              onClick={showResults}
            />
<<<<<<< HEAD
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
=======
          </div>
>>>>>>> bdad6b3 (SalesTable component added, Venue History integrates new component, table UI perfected)
=======
          />

>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
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
<<<<<<< HEAD
        <div className="min-w-[1000px] h-auto">
          <div className="text-xl text-primary-navy font-bold mb-4">{venueDesc}</div>

<<<<<<< HEAD
=======
        <div className="min-w-[1000px] h-auto">
          <div className="text-xl text-primary-navy font-bold mb-4">{venueDesc}</div>

>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
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
<<<<<<< HEAD
=======
        <SalesTable
          containerHeight='h-[734px]'
          containerWidth='w-[1200px]'
          module='bookings'
          bookings={bookings}
        />
>>>>>>> bdad6b3 (SalesTable component added, Venue History integrates new component, table UI perfected)
=======
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
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
>>>>>>> 6849499 (merged main into VenueHistory and added final modal with column grouping - UI still needs tweaked and code needs tidied)
=======
>>>>>>> 9af7f99 (a start at SK-49-VenueHistory with the venue select modal)
=======

    <PopupModal
      show={showCompSelectModal}
      title="Venue History"
      titleClass="text-xl text-primary-navy font-bold -mt-2"
      onClose={handleModalCancel}
    >
      <div className="w-[774px] h-[532px]">
        <div className="text-xl text-primary-navy font-bold -mt-2">{venueDesc}</div>

        {loading && (
            <div className="w-full h-full absolute left-0 top-0 bg-white flex items-center opacity-95">
              <Spinner className="w-full" size="lg" />
            </div>
          )}
          <form onSubmit={handleOnSubmit}>
            <div className="h-[50vh] overflow-auto">
                     <Table
                        columnDefs={venueHistCompColumnDefs(bookings.length)}
                        rowData={bookings}
                        styleProps={styleProps}
                       onCellClicked={handleCellClick}
                        //gridOptions={gridOptions}
                      />
              {/* {bookings.map((booking, i) => (
                <div className="flex items-center mt-6" key={i}>
                  <label htmlFor="date" className="text-lg font-medium mr-4">
                    {booking.FullProductionCode}(WEEKS: {booking.ProductionLengthWeeks})
                  </label>
                  <select
                    className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={inputs?.[booking?.BookingId]}
                    id={booking.BookingId}
                    name={booking.BookingId}
                   // onChange={handleOnChange}
                  >
                    <option value={null}>None</option>
                    {new Array(bookings.length).fill(0).map?.((_, j) => (
                      <option key={j} value={j + 1}>
                        {j + 1}
                      </option>
                    ))}
                  </select>
                  {JSON.stringify(booking)}
                </div>
              ))} */}
            </div>
            {/* <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => onClose()}
              >
                Close and Discard
              </button>
              <button
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="submit"
              >
                Apply
              </button>
            </div> */}
          </form>
      </div>
    </PopupModal>
    </div>
>>>>>>> e349e74 (SK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)
=======
>>>>>>> a4bc5b2 (a start at SK-49-VenueHistory with the venue select modal)
  );
};
