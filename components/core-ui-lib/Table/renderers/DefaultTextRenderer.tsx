import { CustomCellRendererProps } from 'ag-grid-react';
import classNames from 'classnames';
import Tooltip, { TooltipProps } from 'components/core-ui-lib/Tooltip/Tooltip';

interface CellRendererParams extends CustomCellRendererProps, TooltipProps {
  tpActive?: boolean;
  truncate?: boolean;
}
const DefaultTextRenderer = ({ truncate = true, ...props }: CellRendererParams) => {
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
            <div className={classNames('px-2', truncate ? 'truncate' : 'break-keep w-full my-2 leading-[1.125]')}>
              {props.value}
            </div>
          </Tooltip>
        </div>
      ) : (
        <div className={classNames('px-2', truncate ? 'truncate' : 'break-keep w-full my-2 leading-[1.125]')}>
          {props.value}
        </div>
      )}
    </div>
  );
};

export default DefaultTextRenderer;
