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
        top: 25%;
        height: 50%;
        border-right: 1px solid #617293;
    }
}

.ag-header-cell {
    padding-left: 8px;
}

.ag-header-cell-label {
    color: #FFF;
    font-family: 'Calibri', sans-serif;
    font-weight: 600;
    font-size: 16px;
}
.ag-header-cell-resize::after {
    background-color: #FFF
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
