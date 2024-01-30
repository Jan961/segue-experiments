import { useRecoilValue } from 'recoil';
import { currentProductionSelector } from 'state/booking/selectors/currentProductionSelector';

export const ProductionDisplay = () => {
  const production = useRecoilValue(currentProductionSelector);

  return (
    <div className="hidden xl:block col-span-1 ml-1 text-center opacity-50">
      {production?.ShowCode}/{production?.Code}
    </div>
  );
};
