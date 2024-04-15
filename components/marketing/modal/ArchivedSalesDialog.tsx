import React, { useEffect, useState } from 'react';
import Button from 'components/core-ui-lib/Button';
import PopupModal from 'components/core-ui-lib/PopupModal';
import SalesTable from 'components/global/salesTable';
import { useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import { BookingSelection } from 'types/MarketingTypes';
import { venueState } from 'state/booking/venueState';
import useAxios from 'hooks/useAxios';
import { useRouter } from 'next/router';

export type ArchSalesDialogVariant = 'venue' | 'town' | 'both'

interface ArchSalesDialogProps {
  show: boolean;
  onCancel: () => void;
  variant: ArchSalesDialogVariant,
  data: any;
}

const title = {
  venue: 'Archived Sales for this Venue',
  town: 'Archived Sales for this Town',
  both: 'Archived Slaes for any Venue / Town'
}

const ArchSalesDialog = ({
  show,
  onCancel,
  variant,
  data
}: Partial<ArchSalesDialogProps>) => {
  const [visible, setVisible] = useState<boolean>(show);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [errorMessage, setErrorMessage] = useState<string>('')
  const { productions } = useRecoilValue(productionJumpState);
  const [prodCompData, setProdCompData] = useState<Array<BookingSelection>>();
  const [subTitle, setSubTitle] = useState<string>('');
  const venueDict = useRecoilValue(venueState);
  const router = useRouter();
  
  const { fetchData } = useAxios();

  const handleModalCancel = () => onCancel?.();

  useEffect(() => {
    setVisible(show);
  }, [show]);

  useEffect(() => {
    getBookingSelection(data);
  }, [data]);

  const getBookingSelection = async (venueID: string | number) => {
    const venue = venueDict[data];
    if (venue === undefined) {
      return;
    }
    setSubTitle(variant === 'venue' ? venue.Name : venue.Town);

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
      } 
    } catch (error) {
      console.log(error);
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

  return (
    <PopupModal
        show={visible}
        title={title[variant]}
        titleClass="text-xl text-primary-navy font-bold -mt-2"
        onClose={handleModalCancel}
      >

      <div className="text-xl text-primary-navy font-bold mb-4">{subTitle}</div>

      {/* <SalesTable
              containerHeight="h-auto"
              containerWidth="w-[920px]"
              module="marketing"
              variant="prodComparision"
              onCellClick={(value) => console.log(value)}
              onCellValChange={selectForComparison}
              data={prodCompData}
              cellRenderParams={{ selected: selectedBookings }}
              productions={productions}
            /> */}

      <div className="w-full mt-4 flex justify-center items-center">
          <Button 
            className="w-32" 
            variant="secondary" 
            text={'Cancel'} 
          />

          <Button
            className="ml-4 w-32"
            variant='primary'
            text='Accept'
          />
        </div>
    </PopupModal>
  );
}

export default ArchSalesDialog;
