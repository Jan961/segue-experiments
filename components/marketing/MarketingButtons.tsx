import React, { useEffect, useState } from 'react';
import Button from 'components/core-ui-lib/Button';
import InputDialog from 'components/marketing/InputDialog/InputDialog';
import { useRecoilState, useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import { formatUrl } from 'utils/formatUrl';
import useAxios from 'hooks/useAxios';
import { MarketingReports } from './modal/MarketingReportsModal';
import { accessMarketingHome } from 'state/account/selectors/permissionSelector';

type MarketingBtnProps = {
  venueName: string;
  venueId: number;
  setModalLandingURL: (url: string) => void;
};

export const MarketingButtons: React.FC<MarketingBtnProps> = ({ venueName, venueId, setModalLandingURL }) => {
  const permissions = useRecoilValue(accessMarketingHome);
  const { selected: productionId } = useRecoilValue(productionJumpState);
  const [bookingJump, setBookingJump] = useRecoilState(bookingJumpState);
  const [showEditUrlModal, setShowEditUrl] = useState<boolean>(false);
  const [showMarketingReportsModal, setShowMarketingReportsModal] = useState<boolean>(false);
  const [website, setWebsite] = useState('');
  const [landingUrl, setLandingURL] = useState('');

  const { fetchData } = useAxios();

  useEffect(() => {
    if (venueId !== 0) {
      const booking = bookingJump.bookings.find((booking) => booking.Venue.Id === venueId);
      if (booking !== undefined) {
        const formattedLandingUrl = formatUrl(booking.LandingPageURL);
        const formattedVenueUrl = formatUrl(booking.Venue.Website);
        setWebsite(formattedVenueUrl);
        setLandingURL(formattedLandingUrl);
      } else {
        setWebsite('');
      }
    }
  }, [venueId, bookingJump]);

  const updateLandingPage = async (website: string) => {
    try {
      await fetchData({
        url: '/api/bookings/update/' + bookingJump.selected.toString(),
        method: 'POST',
        data: { landingPageUrl: website },
      });
      setModalLandingURL(website);
      setBookingJump({
        ...bookingJump,
        bookings: bookingJump.bookings.map((booking) => {
          if (booking.Venue.Id === venueId) {
            return { ...booking, LandingPageURL: website };
          }
          setShowEditUrl(false);
          return booking;
        }),
      });
      setShowEditUrl(false);
    } catch (error) {
      console.log('Error updating booking landing website', error);
    }
  };

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-3.5">
      <Button
        text={landingUrl === '' ? 'Add Landing Page' : 'Edit Landing Page'}
        className="w-[155px] mt-5"
        disabled={bookingJump.selected === null || !productionId || !permissions.includes('EDIT_LANDING_PAGE')}
        onClick={() => setShowEditUrl(true)}
      />

      <Button
        text="Marketing Reports"
        className="w-[165px] mt-5"
        disabled={!productionId}
        iconProps={{ className: 'h-4 w-3' }}
        sufixIconName="excel"
        onClick={() => setShowMarketingReportsModal(true)}
      />

      <Button
        text="Venue Website"
        className="w-[155px] mt-[3px]"
        disabled={!productionId || website === ''}
        onClick={() => window.open(website, '_blank')}
      />

      <InputDialog
        show={showEditUrlModal}
        titleText="Add/Edit Landing Page"
        subTitleText={venueName}
        onCancelClick={() => setShowEditUrl(false)}
        onSaveClick={(value) => updateLandingPage(value)}
        cancelText="Cancel"
        saveText="Save and Close"
        inputPlaceholder="Enter Landing Page"
        inputLabel="Landing Page"
        inputValue={landingUrl}
      />

      <MarketingReports visible={showMarketingReportsModal} onClose={() => setShowMarketingReportsModal(false)} />
    </div>
  );
};

export default MarketingButtons;
