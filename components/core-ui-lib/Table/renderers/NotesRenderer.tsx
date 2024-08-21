import { CustomCellRendererProps } from 'ag-grid-react';
import Icon from 'components/core-ui-lib/Icon';
import Tooltip from 'components/core-ui-lib/Tooltip';

interface CellRendererParams extends CustomCellRendererProps {
  tpActive?: boolean;
  fillColor?: string;
  activeFillColor?: string;
  strokeColor?: string;
  activeStrokeColor?: string;
}

export default function NotesRenderer({
  value,
  tpActive,
  fillColor = '#FFF',
  activeFillColor = '#D41818',
  strokeColor = '#617293',
  activeStrokeColor = '#FFF',
}: CellRendererParams) {
  const tpValue = value ? 'View Notes' : 'No Notes';

  return (
    <div className="flex justify-center w-full">
      <span className="w-5.5">
        {tpActive ? (
          <Tooltip body={tpValue} position="left">
            {value ? (
              <Icon iconName="note-filled" variant="lg" fill={activeFillColor} stroke={activeStrokeColor} />
            ) : (
              <Icon iconName="note-filled" variant="lg" fill={fillColor} stroke={strokeColor} />
            )}
          </Tooltip>
        ) : (
          <div>
            {value ? (
              <Icon iconName="note-filled" variant="lg" fill={activeFillColor} stroke={activeStrokeColor} />
            ) : (
              <Icon iconName="note-filled" variant="lg" fill={fillColor} stroke={strokeColor} />
            )}
          </div>
        )}
      </span>
    </div>
  );
}
