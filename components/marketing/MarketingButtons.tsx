import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Button from 'components/core-ui-lib/Button';
import InputDialog from 'components/core-ui-lib/InputDialog/InputDialog';
import { useRecoilState, useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import { bookingJumpState } from 'state/marketing/bookingJumpState';

type MarketingBtnProps = {
  venueName: string;
  venueId: number;
};

export const MarketingButtons: React.FC<MarketingBtnProps> = ({ venueName, venueId }) => {
  const { selected: ProductionId } = useRecoilValue(productionJumpState);
  const [bookingJump, setBookingJump] = useRecoilState(bookingJumpState);
  const [showEditUrlModal, setShowEditUrl] = useState<boolean>(false);
  const [website, setWebsite] = useState('');

  useEffect(() => {
    if (venueId !== 0) {
      const booking = bookingJump.bookings.find((booking) => booking.Venue.Id === venueId);
      setWebsite(booking.Venue.Website);
    }
  }, [venueId, bookingJump]);

  const updateVenueWebsite = (website: string) => {
    // intended using useAxios but it only supports get/post
    axios
      .put('/api/venue/update', { Website: website, VenueId: venueId })
      .then(() => {
        setBookingJump({
          ...bookingJump,
          bookings: bookingJump.bookings.map((booking) => {
            if (booking.Venue.Id === venueId) {
              return { ...booking, Venue: { ...booking.Venue, Website: website } };
            }
            setShowEditUrl(false);
            return booking;
          }),
        });
      })
      .catch((error) => console.log('Error updating venue website', error));
  };

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4">
      <Button
        text={website === '' ? 'Add Landing Page' : 'Edit Landing Page'}
        className="w-[155px]"
        disabled={bookingJump.selected === null || !ProductionId}
        onClick={() => setShowEditUrl(true)}
      />

      <Button
        text="Marketing Reports"
        className="w-[165px]"
        disabled={!ProductionId}
        iconProps={{ className: 'h-4 w-3' }}
        sufixIconName={'excel'}
      />

      <Button
        text="Venue Website"
        className="w-[155px]"
        disabled={!ProductionId || website === ''}
        onClick={() => window.open(website, '_blank')}
      />

      <InputDialog
        show={showEditUrlModal}
        titleText={'Add/Edit Landing Page'}
        subTitleText={venueName}
        onCancelClick={() => setShowEditUrl(false)}
        onSaveClick={(value) => updateVenueWebsite(value)}
        cancelText="Cancel"
        saveText="Save and Close"
        inputPlaceholder="Enter Landing Page"
        inputLabel="Landing Page"
        inputValue={website}
      />
    </div>
  );
};

export default MarketingButtons;
