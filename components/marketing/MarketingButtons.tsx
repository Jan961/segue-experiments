import Button from 'components/core-ui-lib/Button';

export const MarketingButtons = () => {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4">
      <Button text="Edit Landing Page" className="w-[155px]"></Button>

      <Button
        text="Marketing Reports"
        className="w-[165px]"
        iconProps={{ className: 'h-4 w-3' }}
        sufixIconName={'excel'}
      ></Button>

      <Button text="Veune Website" className="w-[155px]"></Button>
    </div>
  );
};

export default MarketingButtons;
