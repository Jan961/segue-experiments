import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { bookingState } from 'state/booking/bookingState';
import { distanceState } from 'state/booking/distanceState';
import { getStops } from 'utils/getStops';

const useMileageCalculator = () => {
  const [distance, setDistance] = useRecoilState(distanceState);
  const bookingDict = useRecoilValue(bookingState);
  const [loading, setLoading] = useState(false);
  const shouldRefresh = useMemo(() => !loading && Object.values(distance).some((x) => x.outdated), [distance]);
  const refresh = useCallback(async () => {
    const stops = getStops(bookingDict);
    let updatedDistance = { ...distance };
    setLoading(true);
    const promises = Object.keys(stops).map(async (prodId) => {
      if (distance[prodId]?.outdated) {
        console.log(`Calculating mileage for ${prodId}`);
        const { data } = await axios.post('/api/distance', stops[prodId]);
        updatedDistance = { ...updatedDistance, [prodId]: { stops: data, outdated: false } };
      }
    });
    await Promise.allSettled(promises);
    setDistance((prev) => ({ ...prev, ...updatedDistance }));
    setLoading(false);
  }, [bookingDict, distance, setDistance]);
  useEffect(() => {
    console.log('shouldRefresh', shouldRefresh);
    if (!shouldRefresh) return;
    refresh();
  }, [shouldRefresh]);
  return { loading, distance };
};

export default useMileageCalculator;
