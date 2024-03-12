import Button from 'components/core-ui-lib/Button';
import GapSuggest from '../../GapSuggest';
import { useWizard } from 'react-use-wizard';
import { useEffect } from 'react';

type GapSuggestProps = {
  startDate: string;
  endDate: string;
  productionId: number;
  updateModalTitle: (title: string) => void;
};

const GapSuggestionView = ({ startDate, endDate, productionId, updateModalTitle }: GapSuggestProps) => {
  const { goToStep } = useWizard();
  const onCancel = () => {
    goToStep(0);
  };

  useEffect(() => {
    updateModalTitle('Venue Gap Suggestions');
  }, []);

  return (
    <>
      <div>
        <GapSuggest productionId={productionId} onOkClick={onCancel} startDate={startDate} endDate={endDate} />
      </div>
      <Button className="w-33 absolute bottom-5 left-5" variant="secondary" onClick={onCancel} text="Back" />
    </>
  );
};

export default GapSuggestionView;
