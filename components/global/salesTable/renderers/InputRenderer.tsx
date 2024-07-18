import { TextInput } from 'components/core-ui-lib';
import { VENUE_CURRENCY_SYMBOLS } from 'types/MarketingTypes';
import { ChangeEvent } from 'react';
interface Standard {
  field: string;
}
interface SelectRendererProps {
  onChange(value: ChangeEvent<HTMLInputElement>, holdValue: any, HoldTypeName: any, field: string): void;
  id?: string;
  eGridCell: HTMLElement;
  hasSalesData: boolean;
  colDef?: Standard;
  holdValue?: any;
  data?: any;
}

const InputRenderer = (props: SelectRendererProps) => {
  return (
    <div className={`pl-1 pr-2 ${props.colDef.field === 'value' ? 'mt-0' : 'mt-1'} flex `}>
      {props.colDef.field === 'value' && (
        <div className="text-primary-input-text mr-2">{VENUE_CURRENCY_SYMBOLS.POUND}</div>
      )}
      <TextInput
        id="venueText"
        type="number"
        className="w-full text-primary-input-text font-bold"
        value={
          Object.keys(props.holdValue).length > 0 ? props.holdValue[props.data.HoldTypeName][props.colDef.field] : 0
        }
        onChange={(value) => props.onChange(value, props.holdValue, props.data.HoldTypeName, props.colDef.field)}
      />
    </div>
  );
};

export default InputRenderer;
