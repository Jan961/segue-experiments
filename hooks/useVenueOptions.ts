import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { venueState } from 'state/booking/venueState';

const useVenueOptions = () => {
  const venueDict = useRecoilValue(venueState);
  return useMemo(
    () =>
      Object.values(venueDict).map((venue) => ({
        text: `${venue.Code} ${venue?.Name} ${venue?.Town}`,
        value: venue?.Id,
      })),
    [venueDict],
  );
};

export default useVenueOptions;
