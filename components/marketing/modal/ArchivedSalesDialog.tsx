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
import { bookingJumpState } from 'state/marketing/bookingJumpState';

export type ArchSalesDialogVariant = 'venue' | 'town' | 'both';

interface ArchSalesDialogProps {
  show: boolean;
  onCancel: () => void;
  variant: ArchSalesDialogVariant;
  data: VenueDetail | DataList;
  onSubmit: (salesComp) => void;
  error: string;
  selectedBookingId: number;
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

const ArchSalesDialog = ({
  show,
  onCancel,
  variant,
  data,
  onSubmit,
  error,
  selectedBookingId,
}: Partial<ArchSalesDialogProps>) => {
  const [visible, setVisible] = useState<boolean>(show);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { productions } = useRecoilValue(productionJumpState);
  const { bookings } = useRecoilValue(bookingJumpState);
  const [prodCompData, setProdCompData] = useState<Array<BookingSelection>>([]);
  const [subTitle, setSubTitle] = useState<string>('');
  const [conditionType, setConditionType] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [venueList, setVenueList] = useState<Array<SelectOption>>([]);
  const [townList, setTownList] = useState<Array<SelectOption>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { fetchData } = useAxios();

  const handleModalCancel = () => onCancel?.();

  const getBookingSelection = async (data) => {
    setProdCompData([]);
    setErrorMessage('');
    setLoading(true);

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
        Id: selectedVenue.Id,
      };
    } else {
      venue = data;
      setSubTitle(variant === 'town' ? venue.town : venue.name);
    }

    setSelectedCondition(venue);

    try {
      const data = await fetchData({
        url: '/api/marketing/archived-sales/booking-selection/read',
        method: 'POST',
        data: {
          salesByType: variant === 'venue' ? 'venue' : 'town',
          venueCode: venue.code,
          showCode: router.query.ShowCode.toString(),
        },
      });

      if (Array.isArray(data) && data.length > 0) {
        const bookingData = data as Array<BookingSelection>;
        const { ShowCode, ProductionCode } = router.query;

        const excludeCurrentProduction = bookingData.filter((booking) => {
          return `${ShowCode}${ProductionCode}` !== booking.FullProductionCode;
        });

        const currentProduction = productions.find((prod) => {
          return prod.ShowCode === ShowCode && prod.Code === ProductionCode;
        });

        const currentBooking = bookings.find((booking) => {
          return booking.Id === selectedBookingId;
        });

        setSelectedBookings([
          {
            bookingId: currentBooking?.Id,
            order: 1,
            prodCode: (ShowCode as string) + ProductionCode,
            prodName: currentProduction?.ShowCode + currentProduction?.Code + ' ' + currentProduction?.ShowName,
            numPerfs: currentBooking?.PerformanceCount,
          },
        ]);

        // Sort data by BookingFirstDate in descending order (newest production to oldest)
        const sortedData = excludeCurrentProduction.sort(
          (a, b) => b.BookingFirstDate.getTime() - a.BookingFirstDate.getTime(),
        );

        setProdCompData(sortedData);

        // if sortedData (without current production) has a length of 0 - show error
        if (sortedData.length === 0) {
          setErrorMessage('There are no productions to compare.');
        }
      } else {
        setErrorMessage('There are no productions to compare.');
      }

      setLoading(false);
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
    setConditionType(null);
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
      subtitle={variant === 'both' ? '' : subTitle}
    >
      <div className="w-[340px] h-auto">
        {variant === 'both' ? (
          <div>
            <Select
              className={classNames('my-2 w-full text-primary-navy')}
              options={bothOptions}
              value={conditionType}
              onChange={(value) => setConditionType(value?.toString() || null)}
              placeholder="Please select from Venue or Town"
              isClearable={false}
              isSearchable={false}
            />

            <Select
              className={classNames('my-2 w-full text-primary-navy')}
              options={conditionType === null ? [] : conditionType === 'Venue' ? venueList : townList}
              isClearable
              isSearchable
              value={selectedCondition}
              onChange={(value) => getBookingSelection(value)}
              placeholder={conditionType === null ? '' : 'Please select a ' + conditionType}
              disabled={conditionType === ''}
            />

            {selectedCondition !== null && errorMessage === '' && (
              <div>
                {loading ? (
                  <Spinner size="md" />
                ) : (
                  <div>
                    {prodCompData.length > 0 && (
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
            )}
          </div>
        ) : (
          <div>
            {loading ? (
              <Spinner size="md" />
            ) : (
              <div>
                {prodCompData.length > 0 && (
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
