import { CustomTooltipProps } from 'ag-grid-react';

const CustomTooltipRenderer = (props: CustomTooltipProps) => {
  return (
    <div className="z-[10000] flex flex-col justify-center p-4 text-white bg-primary-navy rounded-md h-auto w-auto min-w-[200px] max-w-[300px]">
      <div className="text-center">
        {props.value && <div className="leading-[1.125] break-words whitespace-normal not-italic">{props.value}</div>}
      </div>
    </div>
  );
};

export default CustomTooltipRenderer;
