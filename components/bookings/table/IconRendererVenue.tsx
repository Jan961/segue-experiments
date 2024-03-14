import { CustomCellRendererProps } from 'ag-grid-react';
import Icon from 'components/core-ui-lib/Icon';
// import Tooltip from 'components/core-ui-lib/Tooltip';

const IconRendererVenue = (props: CustomCellRendererProps) => {
  // const { value } = props;
  const {
    iconName,

    // tooltipPosition='left'
  } = props?.colDef?.cellRendererParams || {};

  console.log('rowIndex :>> ', props);
  if (!props.value) {
    return null;
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* <Tooltip title={value} position={tooltipPosition}> */}
      <Icon iconName={iconName} />
      {/* </Tooltip> */}
    </div>
  );
};

export default IconRendererVenue;
