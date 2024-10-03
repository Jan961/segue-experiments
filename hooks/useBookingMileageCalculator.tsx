import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { bookingState } from 'state/booking/bookingState';
import { distanceState } from 'state/booking/distanceState';
import { performanceState } from 'state/booking/performanceState';
import { getStops } from 'utils/getStops';

const useMileageCalculator = () => {
  const [distance, setDistance] = useRecoilState(distanceState);

  const bookingDict = useRecoilValue(bookingState);
  const performanceDict = useRecoilValue(performanceState);
  const [loading, setLoading] = useState(false);
  const shouldRefresh = useMemo(() => !loading && Object.values(distance).some((x) => x.outdated), [distance]);
  const refresh = useCallback(async () => {
    const stops = getStops(bookingDict, performanceDict);

    let updatedDistance = { ...distance };
    setLoading(true);
    const promises = Object.keys(stops).map(async (prodId) => {
      if (distance[prodId]?.outdated) {
        const { data } = await axios.post('/api/distance', stops[prodId]);
        updatedDistance = { ...updatedDistance, [prodId]: { stops: data, outdated: false } };
      }
    });
    await Promise.allSettled(promises);
    setDistance((prev) => ({ ...prev, ...updatedDistance }));
    setLoading(false);
  }, [bookingDict, distance, setDistance]);

  useEffect(() => {
    if (!shouldRefresh) return;
    refresh();
  }, [shouldRefresh]);

  return { loading, distance };
};

export default useMileageCalculator;
