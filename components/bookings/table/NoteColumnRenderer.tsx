import { CustomCellRendererProps } from 'ag-grid-react';
import Icon from 'components/core-ui-lib/Icon';

export default function NoteColumnRenderer({ value, data, api }: CustomCellRendererProps) {
  const firstRowData = api.getDisplayedRowAtIndex(0).data;
  const isNoteVisible =
    (data.venue && data.dayType) || (data.isRunOfDates && firstRowData.venue && firstRowData.dayType);
  return (
    <div className="flex justify-center w-full">
      {isNoteVisible ? (
        <span className="w-5.5">
          {value ? (
            <Icon iconName="note-filled" variant="lg" fill="#D41818" stroke="FFF" />
          ) : (
            <Icon iconName="note-filled" variant="lg" fill="#FFF" stroke="#617293" />
          )}
        </span>
      ) : null}
    </div>
  );
}
