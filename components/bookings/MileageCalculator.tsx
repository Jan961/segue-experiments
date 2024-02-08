import axios from 'axios';
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { bookingState } from 'state/booking/bookingState';
import { distanceState } from 'state/booking/distanceState';
import { getStops } from 'utils/getStops';

/*
  Watches the schedule and monitors changes
*/
export const MileageCalculator = () => {
  const [distance, setDistance] = useRecoilState(distanceState);
  const bookingDict = useRecoilValue(bookingState);

  // Monitor distances and refresh if some are missing
  React.useEffect(() => {
    const shouldRefresh = Object.values(distance).some((x) => x.outdated);
    if (!shouldRefresh) return;

    const refresh = async () => {
      const stops = getStops(bookingDict);
      const promises = Object.keys(stops).map(async (prodId) => {
        const { data } = await axios.post('/api/distance', stops[prodId]);
        setDistance({ ...distance, [prodId]: { stops: data, outdated: false } });
      });
      await Promise.allSettled(promises);
    };

    refresh();
  }, [distance, setDistance, bookingDict]);

  return null;
};
