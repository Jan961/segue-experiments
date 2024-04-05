import Button from 'components/core-ui-lib/Button';
import { useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';

export const MarketingButtons = () => {
  const { selected: ProductionId } = useRecoilValue(productionJumpState);
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4">
      <Button 
        text="Edit Landing Page" 
        className="w-[155px]" 
        disabled={!ProductionId} 
      />

      <Button
        text="Marketing Reports"
        className="w-[165px]"
        disabled={!ProductionId}
        iconProps={{ className: 'h-4 w-3' }}
        sufixIconName={'excel'}
      />

      <Button 
        text="Venue Website"
        className="w-[155px]"
        disabled={!ProductionId}
      />
    </div>
  );
};

export default MarketingButtons;
