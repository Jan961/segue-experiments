import { CustomCellRendererProps } from 'ag-grid-react';
import Icon from 'components/core-ui-lib/Icon';
import Tooltip from 'components/core-ui-lib/Tooltip';

interface CellRendererParams extends CustomCellRendererProps {
    tpActive?: boolean;
}

export default function NotesRenderer({ value, tpActive }: CellRendererParams) {

    const tpValue = value ? 'View Notes' : 'No Notes';

    return (
        <div className="flex justify-center w-full">
            <span className="w-5.5">
                {tpActive ? (
                    <Tooltip body={tpValue} position="left">
                        {value ? (
                            <Icon iconName="note-filled" variant="lg" fill="#D41818" stroke="FFF" />
                        ) : (
                            <Icon iconName="note-filled" variant="lg" fill="#FFF" stroke="#617293" />
                        )}
                    </Tooltip>
                ) : (
                    <div>
                        {value ? (
                            <Icon iconName="note-filled" variant="lg" fill="#D41818" stroke="FFF" />
                        ) : (
                            <Icon iconName="note-filled" variant="lg" fill="#FFF" stroke="#617293" />
                        )}
                    </div>
                )}
            </span>
        </div>
    );
}
