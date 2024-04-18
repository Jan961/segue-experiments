import { ICellRendererParams } from 'ag-grid-community';
import classNames from 'classnames';
import Icon from 'components/core-ui-lib/Icon';
import Tooltip from 'components/core-ui-lib/Tooltip';

export type Direction = 'before' | 'after';

interface AddDeleteRowRendererProps extends ICellRendererParams {
  addRow: (index: number, data: any, direction: Direction) => void;
  deleteRow: (data: any) => void;
}

export default function AddDeleteRowRenderer({ value, node, api, addRow, deleteRow, data }: AddDeleteRowRendererProps) {
  const handleAddRow = (direction: Direction) => {
    addRow(node.rowIndex, data, direction);
  };

  return (
    <div className="w-full px-2 flex items-center justify-between">
      {(node.rowIndex === 0 || node.rowIndex === api.getDisplayedRowCount() - 1) && (
        <div className={classNames('flex items-center gap-1', { 'flex-col': api.getDisplayedRowCount() === 1 })}>
          <Tooltip body={node.rowIndex === 0 ? 'Add Previous Day' : ''} position="right">
            <Icon iconName="plus-circle-solid" onClick={() => handleAddRow(node.rowIndex === 0 ? 'before' : 'after')} />
          </Tooltip>

          {api.getDisplayedRowCount() > 1 ? (
            <Icon iconName="minus-circle-solid" onClick={() => deleteRow(data)} />
          ) : (
            <Tooltip body="Add Next Day" position="right">
              <Icon iconName="plus-circle-solid" onClick={() => handleAddRow('after')} />
            </Tooltip>
          )}
        </div>
      )}
      <span className="w-full text-right">{value}</span>
    </div>
  );
}
