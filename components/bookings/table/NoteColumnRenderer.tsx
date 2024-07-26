import { CustomCellRendererProps } from 'ag-grid-react';
import Icon from 'components/core-ui-lib/Icon';
import Tooltip from 'components/core-ui-lib/Tooltip';

interface CellRendererParams extends CustomCellRendererProps {
  tpActive?: boolean;
  testId?: string;
}

export default function NoteColumnRenderer({
  value,
  data,
  api,
  tpActive,
  testId = 'notes-column-renderer',
}: CellRendererParams) {
  const firstRowData = api.getDisplayedRowAtIndex(0).data;
  const isNoteVisible = data.dayType || (data.isRunOfDates && firstRowData.venue && firstRowData.dayType);
  const tpValue = data.venue && data.dayType && (value ? 'View Notes' : 'No Notes');

  return (
    <div className="flex justify-center w-full">
      {isNoteVisible ? (
        <span data-testid={testId} className="w-5.5">
          {tpActive ? (
            <Tooltip body={tpValue} position="left" offset={{ x: 90, y: 25 }} width="w-20">
              {value ? (
                <Icon data-testid={testId + 'icon'} iconName="note-filled" variant="lg" fill="#D41818" stroke="#FFF" />
              ) : (
                <Icon data-testid={testId + 'icon'} iconName="note-filled" variant="lg" fill="#FFF" stroke="#617293" />
              )}
            </Tooltip>
          ) : (
            <div>
              {value ? (
                <Icon data-testid={testId + 'icon'} iconName="note-filled" variant="lg" fill="#D41818" stroke="#FFF" />
              ) : (
                <Icon data-testid={testId + 'icon'} iconName="note-filled" variant="lg" fill="#FFF" stroke="#617293" />
              )}
            </div>
          )}
        </span>
      ) : null}
    </div>
  );
}
