import { useRecoilValue } from 'recoil';
import { currentTourSelector } from 'state/booking/selectors/currentTourSelector';

export const TourDisplay = () => {
  const tour = useRecoilValue(currentTourSelector);

  return (
    <div className="hidden xl:block col-span-1 ml-1 text-center opacity-50">
      {tour?.ShowCode}/{tour?.Code}
    </div>
  );
};
