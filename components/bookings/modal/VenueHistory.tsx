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

interface VenueHistoryProps {
  visible: boolean;
  onCancel: () => void;
}

export const VenueHistory = ({ visible = false, onCancel }: VenueHistoryProps) => {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  const [open, setOpen] = useState<boolean>(visible);
=======
  const { fetchData } = useAxios();
=======
>>>>>>> 0a75d01 (salesTable component complete and integrated with venueHistory - still to integrate SalesSnapshot with venueHistory)
  const router = useRouter();

  const [showVenueSelectModal, setShowVenueSelect] = useState<boolean>(visible);
  const [showCompSelectModal, setShowCompSelect] = useState<boolean>(false);
  const [showResultsModal, setShowResults] = useState<boolean>(false);
  const [bookings, setBookings] = useState([]);
  const [venueSelectView, setVenueSelectView] = useState<string>('select');
  const [compData, setCompData] = useState<ProdComp>();

>>>>>>> b5184e9 (SalesTable component added, Venue History integrates new component, table UI perfected)
  const bookingDict = useRecoilValue(bookingState);
  const venueDict = useRecoilValue(venueState);


  const handleModalCancel = () => onCancel?.();

  const [venueDesc, setVenueDesc] = useState<string>('');


>>>>>>> 8aa7bee (a start at SK-49-VenueHistory with the venue select modal)
=======
  const [open, setOpen] = useState<boolean>(visible);
  const bookingDict = useRecoilValue(bookingState);
  const venueDict = useRecoilValue(venueState);

  const handleModalCancel = () => onCancel?.();

>>>>>>> 9af7f99 (a start at SK-49-VenueHistory with the venue select modal)
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

  const [venueId, setVenueId] = useState<number>(0);
  // const [stage, setStage] = useState<number>(0);

  useEffect(() => {
<<<<<<< HEAD
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
=======
    setOpen(visible);
  }, [visible]);

  return (
    <PopupModal
      show={open}
      title="Venue History"
      titleClass="text-xl text-primary-navy font-bold -mt-2"
      onClose={handleModalCancel}
    >
      <div className="w-[417px] h-[130px]">
        <div className="text  text-primary-navy">Please select a venue for comparision</div>

        <Typeahead
          className={classNames('my-2 w-full !border-0 text-primary-navy')}
          options={VenueOptions}
          // disabled={stage !== 0}
          onChange={(value) => setVenueId(parseInt(value as string, 10))}
          value={venueId}
          placeholder={'Please select a venue'}
          label="Venue"
        />

>>>>>>> 9af7f99 (a start at SK-49-VenueHistory with the venue select modal)
        <Button
          className="px-8 mt-4 float-right"
          onClick={handleModalCancel}
          variant="secondary"
          text={'Cancel'}
        ></Button>
      </div>
    </PopupModal>
<<<<<<< HEAD
=======
              <Typeahead
                className={classNames('my-2 w-full !border-0 text-primary-navy')}
                options={VenueOptions}
                // disabled={stage !== 0}
                onChange={(value) => toggleModal('venue', parseInt(value as string, 10))}
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
>>>>>>> b5184e9 (SalesTable component added, Venue History integrates new component, table UI perfected)
=======
>>>>>>> 9af7f99 (a start at SK-49-VenueHistory with the venue select modal)
  );
};
