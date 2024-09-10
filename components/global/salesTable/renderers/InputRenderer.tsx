import { TextInput } from 'components/core-ui-lib';
import { ChangeEvent } from 'react';
import { isNullOrEmpty } from 'utils';
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
  currency?: string;
}

const formatValue = (value: any) => {
  if (isNullOrEmpty(value)) {
    return '';
  } else if (value === '0') {
    return '';
  } else {
    return value;
  }
};

const InputRenderer = (props: SelectRendererProps) => {
  return (
    <div className={`pl-1 pr-2 ${props.colDef.field === 'value' ? 'mt-0' : 'mt-1'} flex `}>
      {props.colDef.field === 'value' && <div className="text-primary-input-text mr-2">{props.currency || ''}</div>}
      <TextInput
        id="venueText"
        type="number"
        className="w-full  font-bold"
        value={
          !isNullOrEmpty(props.holdValue)
            ? formatValue(props.holdValue[props.data.HoldTypeName][props.colDef.field])
            : ''
        }
        onChange={(value) => props.onChange(value, props.holdValue, props.data.HoldTypeName, props.colDef.field)}
      />
    </div>
  );
};

export default InputRenderer;
