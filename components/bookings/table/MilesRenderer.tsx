import { CustomCellRendererProps } from 'ag-grid-react';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { distanceState } from 'state/booking/distanceState';

const MilesRenderer = (props: CustomCellRendererProps) => {
  const { productionId, venueId, dateTime } = props.data;
  const distance = useRecoilValue(distanceState);
  const miles = useMemo(() => {
    const productionDistance = distance?.[productionId] || {};
    const { option = [] } = productionDistance?.stops?.find((x) => x.Date === dateTime) || {};
    const venue = option?.find((x) => x.VenueId === venueId);
    return venue?.Miles || '';
  }, [dateTime, distance, productionId, venueId]);
  return (
    <div className="w-full h-full pr-[2px]">
      <div className={`h-full px-4`}>{miles}</div>
    </div>
  );
};

export default MilesRenderer;