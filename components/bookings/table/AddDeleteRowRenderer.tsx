import { CustomCellRendererProps } from 'ag-grid-react';
import Icon from 'components/core-ui-lib/Icon';

export default function AddDeleteRowRenderer({ value, node, api }: CustomCellRendererProps) {
  return (
    <div className="w-full h-full px-2 flex items-center justify-between">
      {(node.rowIndex === 0 || node.rowIndex === api.getDisplayedRowCount() - 1) && (
        <div className="flex items-center gap-1">
          <Icon iconName="plus-circle-solid" variant="xs" />
          <Icon iconName="minus-circle-solid" variant="xs" />
        </div>
      )}
      <span className="w-full text-right">{value}</span>
    </div>
  );
}
