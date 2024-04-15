import { createGlobalStyle, styled } from 'styled-components';
import { StyleProps } from './Table';

const GridStyles = createGlobalStyle<StyleProps>`
.ag-theme-quartz {
    --ag-border-radius: 0px;
    --ag-wrapper-border-radius: 0px;
    --ag-foreground-color: #617293;
    --ag-font-size: 14px;
    --ag-font-family: 'Calibri', sans-serif;
    --ag-header-foreground-color: white;
    --ag-header-background-color: ${(props) => props.headerColor || '#FBFBFB'};
    --ag-header-cell-hover-background-color: ${(props) => props.headerColor || '#FBFBFB'};
    --ag-header-cell-moving-background-color: ${(props) => props.headerColor || '#FBFBFB'};
    --ag-row-border: 1px solid #dadce5;
    --ag-odd-row-background-color: #F8F8F8;
     --ag-checkbox-background-color: transparent ;
    --ag-checkbox-checked-color: #617293;
    --ag-checkbox-unchecked-color: #617293;
    --ag-checkbox-indeterminate-color: #617293;
}




/* used for the parent header when a header group is used */
.group-header-parent {
    text-align: center;
    font-weight: bold;
    font-size: 16px;
    justify-content: center;
    border-bottom: 4px solid white;
}

/* used for other headers in a header group that are not children */
.group-header-normal {
  border-top: 50px solid white !important;
  border-right: 2px solid white !important;
}

/* used with a group header for then children */
.group-header-child {
  border-right: 2px solid white !important;
}

.ag-body-viewport {
    overflow: visible;
}

.ag-root,
.ag-root-wrapper, 
.ag-center-cols-clipper, 
.ag-center-cols-viewport,
.ag-body-viewport-wrapper {
    overflow: visible !important;
}

.ag-checkbox-cell{
    justify-content: center !important;
}
.ag-checkbox-edit{
    justify-content: center !important;
}

.ag-center-cols-container,
.ag-theme-quartz .ag-layout-auto-height .ag-center-cols-viewport {
    min-height: 0px!important;
}
    
.ag-ltr .ag-cell-focus:not(.ag-cell-range-selected):focus-within {
    border: none;
}

.ag-ltr .ag-cell {
    padding: 0;
    &:not(:last-child):after {
        content: '';
        position: absolute;
        right: 0px;
        top: 7px;
        bottom: 7px;
        border-right: 1px solid #617293;
    }
}

.ag-header-cell {
    text-wrap: wrap;
}

.ag-header-cell-label {
    color: #FFF;
    font-family: 'Calibri', sans-serif;
    font-weight: 600;
    font-size: 16px;
    text-align: center;
    justify-content: center;
}
.ag-header-cell-resize::after {
    background-color: #FFF
}

.ag-row {
    z-index: 0;
}

.ag-row:hover {
    z-index: 2;
}

.ag-row.ag-row-focus {
    z-index: 1;
}
.custom-red-row {
  background-color: #fad0cc; /* Set your desired background color */
}

.custom-grey-row {
    background-color: #DADCE5;
}

.custom-sm-pinned-header {
  border-color: white !important;
  border-top: 102px solid; 
  border-right: 3px solid;
}

`;

interface TableTooltipProps {
  background?: string;
  border?: string;
  color?: string;
  left?: string;
  top?: string;
}

export const StyledTableTooltip = styled.div<TableTooltipProps>`
  position: relative;
  padding: 0.5rem;
  left: ${(props) => props.left};
  top: ${(props) => props.top};
  z-index: 500;
  background: ${(props) => props.background};
  boxshadow: 0 2px 5px ${(props) => props.border};
  border: 1px solid ${(props) => props.border};
  border-radius: 0.625rem;
  font-family: 'Calibri', sans-serif;
  font-size: 0.9375rem;
  font-style: normal;
  font-weight: 400;
  color: ${(props) => props.color};
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 100%; /* To the right of the tooltip */
    margin-top: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent transparent black;
  }
`;

export default GridStyles;
