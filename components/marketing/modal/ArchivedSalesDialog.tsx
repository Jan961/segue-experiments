import { useEffect, useState } from 'react';
import Button from 'components/core-ui-lib/Button';
import PopupModal from 'components/core-ui-lib/PopupModal';
import SalesTable from 'components/global/salesTable';
import { useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import { BookingSelection } from 'types/MarketingTypes';
import useAxios from 'hooks/useAxios';
import { useRouter } from 'next/router';
import { Spinner } from 'components/global/Spinner';
import { DataList, SelectOption, VenueDetail } from '../MarketingHome';
import Select from 'components/core-ui-lib/Select';
import classNames from 'classnames';

export type ArchSalesDialogVariant = 'venue' | 'town' | 'both';

interface ArchSalesDialogProps {
  show: boolean;
  onCancel: () => void;
  variant: ArchSalesDialogVariant;
  data: VenueDetail | DataList;
  onSubmit: (salesComp) => void;
  error: string;
}

const title = {
  venue: 'Archived Sales for this Venue',
  town: 'Archived Sales for this Town',
  both: 'Archived Sales for any Venue / Town',
};

const bothOptions = [
  { text: 'Venue', value: 'Venue' },
  { text: 'Town', value: 'Town' },
];

const ArchSalesDialog = ({ show, onCancel, variant, data, onSubmit, error }: Partial<ArchSalesDialogProps>) => {
  const [visible, setVisible] = useState<boolean>(show);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { productions } = useRecoilValue(productionJumpState);
  const [prodCompData, setProdCompData] = useState<Array<BookingSelection>>([]);
  const [subTitle, setSubTitle] = useState<string>('');
  const [conditionType, setConditionType] = useState('');
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [venueList, setVenueList] = useState<Array<SelectOption>>([]);
  const [townList, setTownList] = useState<Array<SelectOption>>([]);
  const router = useRouter();

  const { fetchData } = useAxios();

  const handleModalCancel = () => onCancel?.();

  const getBookingSelection = async (data) => {
    setProdCompData([]);
    setErrorMessage('');
    if (data === undefined) {
      return;
    }

    let venue = null;

    if (variant === 'both') {
      let selectedVenue = null;
      if (conditionType === 'Venue') {
        selectedVenue = data;
      } else if (conditionType === 'Town') {
        selectedVenue = venueList.find((venue) => venue.value.Town.includes(data) === true).value;
      }

      venue = {
        town: selectedVenue.Town,
        name: selectedVenue.Name,
        code: selectedVenue.Code,
      };
    } else {
      venue = data;
      setSubTitle(variant === 'town' ? venue.town : venue.name);
    }

    setSelectedCondition(venue);

    try {
      const data = await fetchData({
        url: '/api/marketing/archivedSales/bookingSelection',
        method: 'POST',
        data: {
          salesByType: variant === 'venue' ? 'venue' : 'town',
          venueCode: venue.code,
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
      } else {
        setErrorMessage('There are no productions to compare.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitSelection = () => {
    if (selectedBookings.length < 1) {
      setErrorMessage('Please select at least 1 venue for comparison.');
    } else {
      onSubmit(selectedBookings);
    }
  };

  const selectForComparison = (selectedValue) => {
    if ('type' in selectedValue === false) {
      const tempBookings = selectedBookings;
      if (selectedValue.order === null || isNaN(selectedValue.order)) {
        const bookingToDel = tempBookings.findIndex((booking) => booking.bookingId === selectedValue.bookingId);
        if (bookingToDel > -1) {
          tempBookings.splice(bookingToDel, 1);
          setSelectedBookings(tempBookings);
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
        setSelectedBookings(tempBookings);
      }
    }
  };

  useEffect(() => {
    setVisible(show);
    setConditionType('');
    setSelectedCondition(null);
  }, [show]);

  useEffect(() => {
    setErrorMessage(error);
  }, [error]);

  useEffect(() => {
    setErrorMessage('');
    setSelectedBookings([]);
    if (variant === 'both' && data !== undefined) {
      setProdCompData([]);
      setSelectedCondition(null);
      if ('townList' in data && 'venueList' in data) {
        setTownList(data.townList);
        setVenueList(data.venueList);
      }
    } else {
      setProdCompData([]);
      getBookingSelection(data);
    }
  }, [data, variant]);

  return (
    <PopupModal
      show={visible}
      title={title[variant]}
      titleClass={classNames('text-xl text-primary-navy font-bold -mt-2', variant === 'both' ? 'w-48' : '')}
      onClose={handleModalCancel}
    >
      <div className="w-[340px] h-auto">
        {variant !== 'both' && <div className="text-xl text-primary-navy font-bold mb-4">{subTitle}</div>}

        {variant === 'both' ? (
          <div>
            <Select
              className={classNames('my-2 w-full !border-0 text-primary-navy')}
              options={bothOptions}
              value={conditionType}
              onChange={(value) => setConditionType(value?.toString() || null)}
              placeholder="Please select from Venue or Town"
              isClearable={false}
              isSearchable={false}
            />

            <Select
              className={classNames('my-2 w-full !border-0 text-primary-navy')}
              options={conditionType === '' ? [] : conditionType === 'Venue' ? venueList : townList}
              isClearable
              isSearchable
              value={selectedCondition}
              onChange={(value) => getBookingSelection(value)}
              placeholder={conditionType === '' ? '' : 'Please select a ' + conditionType}
              disabled={conditionType === ''}
            />

            {selectedCondition !== null && errorMessage === '' && (
              <div>
                {prodCompData.length === 0 ? (
                  <Spinner size="md" />
                ) : (
                  <SalesTable
                    containerHeight="h-auto"
                    containerWidth="w-auto"
                    module="marketing"
                    variant="prodCompArch"
                    onCellValChange={selectForComparison}
                    data={prodCompData}
                    cellRenderParams={{ selected: selectedBookings }}
                    productions={productions}
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            {prodCompData.length === 0 ? (
              <Spinner size="md" />
            ) : (
              <SalesTable
                containerHeight="h-auto"
                containerWidth="w-[340px]"
                module="marketing"
                variant="prodCompArch"
                onCellValChange={selectForComparison}
                data={prodCompData}
                cellRenderParams={{ selected: selectedBookings }}
                productions={productions}
              />
            )}
          </div>
        )}
        <div className="text text-base text-primary-red mr-12">{errorMessage}</div>

        <div className="float-right flex flex-row mt-5 py-2">
          <Button className="w-32" variant="secondary" text="Cancel" onClick={onCancel} />

          <Button className="ml-4 w-32" variant="primary" text="Accept" onClick={() => submitSelection()} />
        </div>
      </div>
    </PopupModal>
  );
};

export default ArchSalesDialog;
