import { useEffect, useMemo, useState } from 'react';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Typeahead from 'components/core-ui-lib/Typeahead';
import { bookingState } from 'state/booking/bookingState';
import { useRecoilValue } from 'recoil';
import { venueState } from 'state/booking/venueState';
import classNames from 'classnames';
import Button from 'components/core-ui-lib/Button';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
import { Spinner } from 'components/global/Spinner';
import { useRouter } from 'next/router';
<<<<<<< HEAD
import Table from 'components/core-ui-lib/Table';
import { venueHistCompColumnDefs, styleProps } from '../table/tableConfig';
import formatInputDate from 'utils/dateInputFormat';
import { productionJumpState } from 'state/booking/productionJumpState';
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

interface VenueHistoryProps {
  visible: boolean;
  onCancel: () => void;
}

export const VenueHistory = ({ visible = false, onCancel }: VenueHistoryProps) => {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  const [open, setOpen] = useState<boolean>(visible);
=======
  const { fetchData } = useAxios();
=======
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
=======
  const { fetchData } = useAxios();
>>>>>>> e349e74 (SK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)
=======
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
  const router = useRouter();

  const [showVenueSelectModal, setShowVenueSelect] = useState<boolean>(visible);
  const [showCompSelectModal, setShowCompSelect] = useState<boolean>(false);
<<<<<<< HEAD
  const [showResultsModal, setShowResults] = useState<boolean>(false);
<<<<<<< HEAD
  const [bookings, setBookings] = useState([]);
  const [venueSelectView, setVenueSelectView] = useState<string>('select');
  const [compData, setCompData] = useState<ProdComp>();
=======
  const [loading, setLoading] = useState<boolean>(false);
  const [bookings, setBookings] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [venueSelectView, setVenueSelectView] = useState<string>('select');
<<<<<<< HEAD
>>>>>>> bdad6b3 (SalesTable component added, Venue History integrates new component, table UI perfected)
=======
  const [compData, setCompData] = useState<ProdComp>();
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)

>>>>>>> b5184e9 (SalesTable component added, Venue History integrates new component, table UI perfected)
  const bookingDict = useRecoilValue(bookingState);
  const venueDict = useRecoilValue(venueState);


  const handleModalCancel = () => onCancel?.();

<<<<<<< HEAD
  const [venueDesc, setVenueDesc] = useState<string>('');


>>>>>>> 8aa7bee (a start at SK-49-VenueHistory with the venue select modal)
=======
  const [open, setOpen] = useState<boolean>(visible);
=======
  // const [showResultsModal, setShowResults] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  // const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [bookings, setBookings] = useState([]);
  
>>>>>>> e349e74 (SK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)
=======
  const [open, setOpen] = useState<boolean>(visible);
>>>>>>> a4bc5b2 (a start at SK-49-VenueHistory with the venue select modal)
  const bookingDict = useRecoilValue(bookingState);
  const venueDict = useRecoilValue(venueState);

  const handleModalCancel = () => onCancel?.();

<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 9af7f99 (a start at SK-49-VenueHistory with the venue select modal)
=======
  const [venueId, setVenueId] = useState<number>(0);
=======
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
  const [venueDesc, setVenueDesc] = useState<string>('');

>>>>>>> e349e74 (SK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)
=======
>>>>>>> a4bc5b2 (a start at SK-49-VenueHistory with the venue select modal)
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

  useEffect(() => {
<<<<<<< HEAD
<<<<<<< HEAD
    setShowVenueSelect(visible);
  }, [visible]);


<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
  const toggleModal = (type: string, data) => {
    switch (type) {
      case 'venue':
        const venue = venueDict[data];
        setVenueDesc(venue.Code + ' ' + venue.Name + ' | ' + venue.Town);
<<<<<<< HEAD

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
=======
  const goToVenueSelection = (venueID: number) => {
    setVenueId(venueID);
    const venue = venueDict[venueID];
    setVenueDesc(venue.Code + ' ' + venue.Name + ' ' + venue.Town);
    prepareBookingSection(venue);
  }
=======
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)

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
<<<<<<< HEAD
  };

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
>>>>>>> bdad6b3 (SalesTable component added, Venue History integrates new component, table UI perfected)
=======
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
    setOpen(visible);
=======
    setShowVenueSelect(visible);
>>>>>>> e349e74 (SK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)
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
=======
=======
>>>>>>> bdad6b3 (SalesTable component added, Venue History integrates new component, table UI perfected)
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
>>>>>>> bdad6b3 (SalesTable component added, Venue History integrates new component, table UI perfected)
=======
                onChange={(value) => toggleModal('venue', parseInt(value as string, 10))}
>>>>>>> 33f7f26 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
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
      >
        <div className="w-[920px] h-auto">
          <div className="text-xl text-primary-navy font-bold mb-4">{venueDesc}</div>

<<<<<<< HEAD
<<<<<<< HEAD
=======
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

          <div className='float-right flex flex-row mt-5'>
            <Button className="w-32" onClick={handleModalCancel} variant="secondary" text={'Cancel'} />
            <Button
              className="ml-4 w-32"
              variant='primary'
              text='Compare'
              onClick={showResults}
            />
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
        <div className="min-w-[1000px] h-auto">
          <div className="text-xl text-primary-navy font-bold mb-4">{venueDesc}</div>

<<<<<<< HEAD
<<<<<<< HEAD
=======
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
>>>>>>> b5184e9 (SalesTable component added, Venue History integrates new component, table UI perfected)
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
