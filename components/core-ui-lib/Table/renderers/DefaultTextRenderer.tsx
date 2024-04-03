import { CustomCellRendererProps } from 'ag-grid-react';
import Tooltip, { TooltipProps } from 'components/core-ui-lib/Tooltip/Tooltip';

interface CellRendererParams extends CustomCellRendererProps, TooltipProps {
  tpActive?: boolean;
}

const DefaultTextRenderer = (props: CellRendererParams) => {
  return (
    <div>
      {props.tpActive ? (
        <div>
          <Tooltip
            title={props.title}
            body={props.body}
            position={props.position}
            height={props.height}
            width={props.width}
            bgColorClass={props.bgColorClass}
          >
            <div className="w-full h-full">
              <div className="px-2 truncate">{props.value}</div>
            </div>
          </Tooltip>
        </div>
      ) : (
        <div className="w-full h-full">
          <div className="px-2 truncate">{props.value}</div>
        </div>
      )}
    </div>
  );
};

export default DefaultTextRenderer;
