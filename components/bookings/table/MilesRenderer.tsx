import { CustomCellRendererProps } from 'ag-grid-react';
import classNames from 'classnames';
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
    return venue?.Miles === -1 ? 'No Data' : venue?.Miles;
  }, [dateTime, distance, productionId, venueId]);
  return (
    <div className="pr-[2px]">
      <div
        className={classNames('w-full h-full px-1', {
          'bg-primary-red text-italics text-primary-yellow': miles === 'No Data',
        })}
      >
        {miles}
      </div>
    </div>
  );
};

export default MilesRenderer;
