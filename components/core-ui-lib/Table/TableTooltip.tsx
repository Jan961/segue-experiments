import { StyledTableTooltip } from './gridStyles';
import { CustomTooltipProps } from 'ag-grid-react';

export default function TableTooltip(props: CustomTooltipProps) {
  return (
    <StyledTableTooltip
      background="#082B4B"
      color={props.colDef.tooltipComponentParams?.color || '#FFF'}
      left={props.colDef.tooltipComponentParams?.left || '-2rem'}
      top={props.colDef.tooltipComponentParams?.top || '-2rem'}
      border="#082B4B"
    >
      <span>{props.value}</span>
    </StyledTableTooltip>
  );
}
