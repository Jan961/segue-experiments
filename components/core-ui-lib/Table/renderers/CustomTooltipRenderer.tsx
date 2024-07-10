import { CustomTooltipProps } from 'ag-grid-react';

const CustomTooltipRenderer = (props: CustomTooltipProps) => {
  return (
    <div className="absolute top-1/2 left-full transform -translate-y-1/2 translate-x-3">
      <div className="z-[10000] relative flex flex-col justify-center p-4 text-white bg-primary-navy rounded-md h-auto w-auto min-w-[200px] max-w-[300px]">
        <div className="absolute top-1/2 left-0 w-[20px] h-[20px] transform rotate-45 -translate-y-2 -translate-x-2 bg-primary-navy" />
        <div className="text-center">
          {props.value && <div className="leading-[1.125] break-words whitespace-normal not-italic">{props.value}</div>}
        </div>
      </div>
    </div>
  );
};

export default CustomTooltipRenderer;
