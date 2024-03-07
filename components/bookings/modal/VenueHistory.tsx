import { useEffect, useMemo, useState } from 'react';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Typeahead from 'components/core-ui-lib/Typeahead';
import { bookingState } from 'state/booking/bookingState';
import { useRecoilValue } from 'recoil';
import { venueState } from 'state/booking/venueState';
import classNames from 'classnames';
import Button from 'components/core-ui-lib/Button';
import { Spinner } from 'components/global/Spinner';
import { useRouter } from 'next/router';
import SalesTable from 'components/marketing/sales/table';
import { ProdComp } from 'components/marketing/sales/table/SalesTable';

interface VenueHistoryProps {
  visible: boolean;
  onCancel: () => void;
}

export const VenueHistory = ({ visible = false, onCancel }: VenueHistoryProps) => {
  const router = useRouter();

  const [showVenueSelectModal, setShowVenueSelect] = useState<boolean>(visible);
  const [showCompSelectModal, setShowCompSelect] = useState<boolean>(false);
  const [showResultsModal, setShowResults] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [bookings, setBookings] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [venueSelectView, setVenueSelectView] = useState<string>('select');
  const [compData, setCompData] = useState<ProdComp>();

  const bookingDict = useRecoilValue(bookingState);
  const venueDict = useRecoilValue(venueState);


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
  );
};
