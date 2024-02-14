import { CustomCellRendererProps } from 'ag-grid-react';
import Icon from 'components/core-ui-lib/Icon';

export default function NoteColumnRenderer(props: CustomCellRendererProps) {
  return (
    <div className="px-4 flex items-center h-full">
      <span className="w-5.5 h-full flex items-center">
        {props.value ? (
          <div className="has-tooltip group">
            <span className="tooltip rounded shadow-lg p-1 bg-gray-100 relative right-16">View Notes</span>
            <Icon iconName="note-filled" variant="lg" fill="#D41818" stroke="FFF" />
          </div>
        ) : (
          <div className="has-tooltip group">
            <span className="tooltip rounded shadow-lg p-1 bg-gray-100 relative right-16">No Notes</span>
            <Icon iconName="note-filled" variant="lg" fill="#FFF" stroke="#617293" />
          </div>
        )}
      </span>
    </div>
  );
}
