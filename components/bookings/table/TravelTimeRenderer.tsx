import { CustomCellRendererProps } from 'ag-grid-react';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { distanceState } from 'state/booking/distanceState';
import { formatMinutes } from 'utils/booking';

const TravelTimeRenderer = (props: CustomCellRendererProps) => {
  const { productionId, venueId, dateTime } = props.data;
  const distance = useRecoilValue(distanceState);
  const time = useMemo(() => {
    const productionDistance = distance?.[productionId] || {};
    const { option = [] } = productionDistance?.stops?.find((x) => x.Date === dateTime) || {};
    const venue = option?.find((x) => x.VenueId === venueId);
    return formatMinutes(venue?.Mins);
  }, [dateTime, distance, productionId, venueId]);
  return (
    <div className="w-full h-full pr-[2px]">
      <div className={`h-full`}>{time}</div>
    </div>
  );
};

export default TravelTimeRenderer;
