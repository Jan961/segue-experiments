import { CustomCellRendererProps } from 'ag-grid-react';
import Icon from 'components/core-ui-lib/Icon';

export default function NoteColumnRenderer(props: CustomCellRendererProps) {
  return (
    <div className="flex justify-center w-full">
      {props.data.venue && props.data.dayType ? (
        <span className="w-5.5">
          {props.value ? (
            <Icon iconName="note-filled" variant="lg" fill="#D41818" stroke="FFF" />
          ) : (
            <Icon iconName="note-filled" variant="lg" fill="#FFF" stroke="#617293" />
          )}
        </span>
      ) : null}
    </div>
  );
}
