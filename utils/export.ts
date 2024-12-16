import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { pdfStandardColors } from 'config/global';
import { ExcelExportParams, ExcelRow } from 'ag-grid-enterprise';
import { formatDate } from 'services/dateService';
import { COLOR_HEXCODE } from 'services/salesSummaryService';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const exportToExcel = (tableRef, extraContent = {}) => {
  tableRef?.current?.getApi?.()?.exportDataAsExcel?.(getParams(extraContent));
};

const getParams: (extraContent) => ExcelExportParams = (extraContent) => ({
  prependContent: extraContent?.prependContent ? getRows(extraContent?.prependContent) : null,
  appendContent: extraContent?.appendContent ? getRows(extraContent?.appendContent) : null,
  fileName: extraContent?.fileName || 'Excel',
  columnKeys: extraContent?.columnKeys,
});

const getRows: (content) => ExcelRow[] = (content = []) => [...content];

const getHeaderToExport = (gridApi) => {
  const columns = gridApi.getAllDisplayedColumns();

  return columns.map((column) => {
    const { field } = column.getColDef();
    const sort = column.getSort();
    const headerName = column.getColDef().headerName ?? field;
    const headerNameUppercase = `${headerName[0]?.toUpperCase() || ''}` + headerName.slice(1);
    const headerCell = {
      text: headerNameUppercase + (sort ? ` (${sort})` : ''),
      bold: true,
      margin: [0, 12, 0, 0],
    };
    return headerCell;
  });
};

const getRowsToExportPivot = (gridApi) => {
  const columns = gridApi.getAllDisplayedColumns();

  const getCellToExport = (column, node) => ({
    text: gridApi.getValue(column, node) ?? '',
    ...column.getColDef().cellStyle,
    color: 'white',
  });

  const rowsToExport = [];
  gridApi.forEachNodeAfterFilterAndSort((node) => {
    if (node.group) {
      const rowToExport = columns.map((column) => getCellToExport(column, node));
      rowsToExport.push(rowToExport);
    }
  });

  return rowsToExport;
};

const createLayout = (numberOfHeaderRows, styles) => {
  const HEADER_ROW_COLOR = styles.headerRowColor ? styles.headerRowColor : pdfStandardColors.HEADER_ROW_COLOR;
  const EVEN_ROW_COLOR = styles.evenRowColor ? styles.evenRowColor : pdfStandardColors.EVEN_ROW_COLOR;
  const ODD_ROW_COLOR = styles.oddRowColor ? styles.oddRowColor : pdfStandardColors.ODD_ROW_COLOR;
  const PDF_INNER_BORDER_COLOR = styles.innerLineBorderColor
    ? styles.innerLineBorder
    : pdfStandardColors.PDF_INNER_BORDER_COLOR;
  const PDF_OUTER_BORDER_COLOR = styles.outerLineBorderColor
    ? styles.outerLineBorder
    : pdfStandardColors.PDF_OUTER_BORDER_COLOR;

  return {
    fillColor: (rowIndex) => {
      if (rowIndex < numberOfHeaderRows) {
        return HEADER_ROW_COLOR;
      }
      return rowIndex % 2 === 0 ? EVEN_ROW_COLOR : ODD_ROW_COLOR;
    },
    vLineWidth: (rowIndex, node) => (rowIndex === 0 || rowIndex === node.table.widths.length ? 1 : 0),
    hLineColor: (rowIndex, node) =>
      rowIndex === 0 || rowIndex === node.table.body.length ? PDF_OUTER_BORDER_COLOR : PDF_INNER_BORDER_COLOR,
    vLineColor: (rowIndex, node) =>
      rowIndex === 0 || rowIndex === node.table.widths.length ? PDF_OUTER_BORDER_COLOR : PDF_INNER_BORDER_COLOR,
  };
};

const getRowsToExport = (gridApi) => {
  if (gridApi.isPivotMode()) {
    return getRowsToExportPivot(gridApi);
  }

  const columns = gridApi.getAllDisplayedColumns();
  const getCellToExport = (column, node) => ({
    text: gridApi.getValue(column, node) ?? '',
    ...column.getColDef().cellStyle,
  });

  const rowsToExport = [];
  gridApi.forEachNodeAfterFilterAndSort((node) => {
    const rowToExport = columns.map((column) => getCellToExport(column, node));
    rowsToExport.push(rowToExport);
  });

  return rowsToExport;
};

const getDocument = (gridApi, styles) => {
  const columns = gridApi.getAllDisplayedColumns();
  const headerRow = getHeaderToExport(gridApi);
  const rows = getRowsToExport(gridApi);
  const widths = styles.widths && styles.widths?.length === columns.length ? styles.widths : `${100 / columns.length}%`;
  const headerHeight = styles.headerHeight ? styles.headerHeight : 40;
  const rowHeight = styles.rowHeight ? styles.rowHeight : 15;

  return {
    pageOrientation: 'landscape', // can also be 'portrait'
    content: [
      {
        table: {
          headerRows: 1,
          widths,
          body: [headerRow, ...rows],
          heights: (rowIndex: number) => (rowIndex === 0 ? headerHeight : rowHeight),
        },
        layout: createLayout(1, styles),
      },
    ],
    pageMargins: [10, 10, 10, 10],
  };
};

export const exportToPDF = (tableRef, styles = {}) => {
  const gridApi = tableRef?.current?.getApi();
  const doc = getDocument(gridApi, styles);
  pdfMake.createPdf(doc).download();
};

export const dateToReadableFormat = (isoDate) => {
  const date = new Date(isoDate);
  const options: any = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-GB', options);

  const day = date.getDate();
  const suffix =
    day === 1 || day === 21 || day === 31
      ? 'st'
      : day === 2 || day === 22
      ? 'nd'
      : day === 3 || day === 23
      ? 'rd'
      : 'th';
  const formattedDay = `${day}${suffix}`;

  const readableDate = formattedDay + ' ' + formattedDate.slice(formattedDate.indexOf(' ') + 1);

  return readableDate;
};

/**
 * Creates exported at title with date and time in the format 'Exported: dd/MM/yy at HH:mm'
 * @param dateStr
 * @returns
 */
export const getExportedAtTitle = (dateStr: string) => {
  return `Exported: ${formatDate(dateStr, 'dd/MM/yy')} at ${formatDate(dateStr, 'HH:mm')}`;
};

const borderStyles = {
  top: { style: 'thin', color: { argb: COLOR_HEXCODE.BORDER_GRAY } },
  left: { style: 'thin', color: { argb: COLOR_HEXCODE.BORDER_GRAY } },
  bottom: { style: 'thin', color: { argb: COLOR_HEXCODE.BORDER_GRAY } },
  right: { style: 'thin', color: { argb: COLOR_HEXCODE.BORDER_GRAY } },
};

export const addBorderToAllCells = ({ worksheet }: { worksheet: any }) => {
  worksheet.eachRow({ includeEmpty: true }, function (row) {
    row.eachCell({ includeEmpty: true }, function (cell) {
      cell.border = borderStyles;
    });
  });
};
