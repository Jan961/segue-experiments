import { CustomCellRendererProps } from 'ag-grid-react';
import Icon from 'components/core-ui-lib/Icon';
import Tooltip from 'components/core-ui-lib/Tooltip';

export default function NoteColumnRenderer({ value, data, api }: CustomCellRendererProps) {
  const firstRowData = api.getDisplayedRowAtIndex(0).data;
  const isNoteVisible = data.dayType || (data.isRunOfDates && firstRowData.venue && firstRowData.dayType);
  const tpValue = data.venue && data.dayType && (value ? 'View Notes' : 'No Notes');

  return (
    <div className="flex justify-center w-full">
      {isNoteVisible ? (
        <span className="w-5.5">
          <Tooltip body={tpValue} position="left">
            {value ? (
              <Icon iconName="note-filled" variant="lg" fill="#D41818" stroke="FFF" />
            ) : (
              <Icon iconName="note-filled" variant="lg" fill="#FFF" stroke="#617293" />
            )}
          </Tooltip>
        </span>
      ) : null}
    </div>
  );
}
