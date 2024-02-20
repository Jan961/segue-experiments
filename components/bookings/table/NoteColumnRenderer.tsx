import { CustomCellRendererProps } from 'ag-grid-react';
import Icon from 'components/core-ui-lib/Icon';

export default function NoteColumnRenderer(props: CustomCellRendererProps) {
  return (
    <div className="px-4 flex items-center h-full">
      {props.data.venue && props.data.dayType && (
        <span className="w-5.5 h-full flex items-center relative">
          {props.value ? (
            <Icon iconName="note-filled" variant="lg" fill="#D41818" stroke="FFF" />
          ) : (
            <Icon iconName="note-filled" variant="lg" fill="#FFF" stroke="#617293" />
          )}
        </span>
      )}
    </div>
  );
}
