import Button from 'components/core-ui-lib/Button';
import GapSuggest from '../../GapSuggest';
import { useWizard } from 'react-use-wizard';

type GapSuggestProps = {
  startDate: string;
  endDate: string;
};

const GapSuggestionView = ({ startDate, endDate }: GapSuggestProps) => {
  const { goToStep } = useWizard();
  const onCancel = () => {
    goToStep(0);
  };
  return (
    <div className="pb-6">
      <GapSuggest startDate={startDate} endDate={endDate} />
      <div>
        <Button className="px-4" variant="primary" onClick={onCancel} text="back" />
      </div>
    </div>
  );
};

export default GapSuggestionView;
