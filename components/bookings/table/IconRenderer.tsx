import { CustomCellRendererProps } from 'ag-grid-react';
import Icon from 'components/core-ui-lib/Icon';
import Tooltip from 'components/core-ui-lib/Tooltip';

const IconRenderer = (props: CustomCellRendererProps) => {
  const { value } = props.data;
  console.log(`IconRenderer`, value, props);
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Tooltip title={value}>
        <Icon iconName={props?.colDef?.cellRendererParams?.iconName} />
      </Tooltip>
    </div>
  );
};

export default IconRenderer;
