import { SelectProps } from 'components/core-ui-lib/Select/Select';
import { TextInput } from 'components/core-ui-lib';
import { VENUE_CURRENCY_SYMBOLS } from 'types/MarketingTypes';

interface Standard {
  field: string;
}

interface SelectRendererProps extends SelectProps {
  id?: string;
  eGridCell: HTMLElement;
  hasSalesData: boolean;
  colDef?: Standard;
}

const InputRenderer = (props: SelectRendererProps) => {
  console.log('props==>', props);
  return (
    <div className={`pl-1 pr-2 ${props.colDef.field === 'value' ? 'mt-0' : 'mt-1'} flex `}>
      {props.colDef.field === 'value' && (
        <div className="text-primary-input-text mr-2">{VENUE_CURRENCY_SYMBOLS.POUND}</div>
      )}
      <TextInput
        id="venueText"
        className="w-full text-primary-input-text font-bold"
        value={props.holdValue}
        onChange={(value) => props.onChange(value)}
      />
    </div>
  );
};

export default InputRenderer;
