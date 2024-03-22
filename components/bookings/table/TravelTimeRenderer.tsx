import { CustomCellRendererProps } from 'ag-grid-react';
import classNames from 'classnames';
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
    return venue?.Mins === -1 ? 'No Data' : formatMinutes(venue?.Mins);
  }, [dateTime, distance, productionId, venueId]);
  return (
    <div className="pr-[2px]">
      <div
        className={classNames('w-full h-full px-1', {
          'bg-primary-red text-italics text-primary-yellow': time === 'No Data',
        })}
      >
        {time}
      </div>
    </div>
  );
};

export default TravelTimeRenderer;
