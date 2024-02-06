import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { bookingState } from 'state/booking/bookingState';
import { distanceState } from 'state/booking/distanceState';
import { productionJumpState } from 'state/booking/productionJumpState';
import { getStops } from 'utils/getStops';

const useMileageCalculator = () => {
  const [distance, setDistance] = useRecoilState(distanceState);
  const { selected } = useRecoilValue(productionJumpState);
  const bookingDict = useRecoilValue(bookingState);
  const [loading, setLoading] = useState(false);
  const shouldRefresh = useMemo(() => !loading && Object.values(distance).some((x) => x.outdated), [distance]);
  const refresh = useCallback(async () => {
    const stops = getStops(bookingDict);
    setLoading(true);
    const promises = Object.keys(stops).map(async (prodId) => {
      if (distance[prodId].outdated) {
        const { data } = await axios.post('/api/distance', stops[prodId]);
        setDistance({ ...distance, [prodId]: { stops: data, outdated: false } });
      }
    });
    await Promise.allSettled(promises);
    setLoading(false);
  }, [bookingDict, distance]);
  useEffect(() => {
    if (!shouldRefresh) return;
    refresh();
  }, [selected]);
  return { loading, distance };
};

export default useMileageCalculator;
