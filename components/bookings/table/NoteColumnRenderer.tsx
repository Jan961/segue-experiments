import { CustomCellRendererProps } from 'ag-grid-react';
import Icon from 'components/core-ui-lib/Icon';
import Tooltip from 'components/core-ui-lib/Tooltip';
import { useState } from 'react';

export default function NoteColumnRenderer(props: CustomCellRendererProps) {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  return (
    <div className="px-4 flex items-center h-full">
      <span
        className="w-5.5 h-full flex items-center relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}>

        {props.value ? (
          <Icon className='tpAnchor' iconName="note-filled" variant="lg" fill="#D41818" stroke="FFF" />
        ) : (
          <Icon className='tpAnchor' iconName="note-filled" variant="lg" fill="#FFF" stroke="#617293" />
        )}

        {showTooltip && (
          <Tooltip
            title={props.value ? 'View Notes' : 'No Notes'}
            body={''}
            anchorID='tpAnchor'
            show={true}
            position="left"
            className="absolute top-full left-6"
          />
        )}
      </span>
    </div>
  );
}