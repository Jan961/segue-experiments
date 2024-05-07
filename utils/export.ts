import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const exportToExcel = (tableRef) => {
  tableRef.current?.getApi?.()?.exportDataAsExcel?.();
};

/**
 * This function iterates over all of the columns to create a row of header cells
 */
const getHeaderToExport = (gridApi) => {
  const columns = gridApi.getAllDisplayedColumns();

  return columns.map((column) => {
    const { field } = column.getColDef();
    const sort = column.getSort();
    // Enables export when row grouping
    const headerName = column.getColDef().headerName ?? field;
    const headerNameUppercase = headerName[0].toUpperCase() + headerName.slice(1);
    const headerCell = {
      text: headerNameUppercase + (sort ? ` (${sort})` : ''),

      // styles
      bold: true,
      margin: [0, 12, 0, 0],
    };
    return headerCell;
  });
};

/**
 * This function iterates over all of the rows and columns to create
 * a matrix of cells when pivoting is enabled
 */

const getRowsToExportPivot = (gridApi) => {
  const columns = gridApi.getAllDisplayedColumns();

  const getCellToExport = (column, node) => ({
    text: gridApi.getValue(column, node) ?? '',

    // styles
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
  // Row colors
  const HEADER_ROW_COLOR = styles.headerRowColor ? styles.headerRowColor : '#EC6255';
  const EVEN_ROW_COLOR = styles.evenRowColor ? styles.evenRowColor : '#fcfcfc';
  const ODD_ROW_COLOR = styles.oddRowColor ? styles.oddRowColor : '#fff';

  const PDF_INNER_BORDER_COLOR = styles.innerLineBorderColor ? styles.innerLineBorder : '#dde2eb';
  const PDF_OUTER_BORDER_COLOR = styles.outerLineBorderColor ? styles.outerLineBorder : '#babfc7';

  return {
    fillColor: (rowIndex) => {
      if (rowIndex < numberOfHeaderRows) {
        return HEADER_ROW_COLOR;
      }
      return rowIndex % 2 === 0 ? EVEN_ROW_COLOR : ODD_ROW_COLOR;
    },
    // vLineHeight not used here.
    vLineWidth: (rowIndex, node) => (rowIndex === 0 || rowIndex === node.table.widths.length ? 1 : 0),
    hLineColor: (rowIndex, node) =>
      rowIndex === 0 || rowIndex === node.table.body.length ? PDF_OUTER_BORDER_COLOR : PDF_INNER_BORDER_COLOR,
    vLineColor: (rowIndex, node) =>
      rowIndex === 0 || rowIndex === node.table.widths.length ? PDF_OUTER_BORDER_COLOR : PDF_INNER_BORDER_COLOR,
  };
};

/**
 * This function iterates over all of the rows and columns to create
 * a matrix of cells
 */
const getRowsToExport = (gridApi) => {
  // Enables export when pivoting
  if (gridApi.isPivotMode()) {
    return getRowsToExportPivot(gridApi);
  }
  const columns = gridApi.getAllDisplayedColumns();

  const getCellToExport = (column, node) => ({
    text: gridApi.getValue(column, node) ?? '',
    // styles
    ...column.getColDef().cellStyle,
  });

  const rowsToExport = [];
  gridApi.forEachNodeAfterFilterAndSort((node) => {
    const rowToExport = columns.map((column) => getCellToExport(column, node));
    rowsToExport.push(rowToExport);
  });

  return rowsToExport;
};

/**
 * Returns a pdfMake shaped config for export, for more information
 * regarding pdfMake configuration, please see the pdfMake documentation.
 */
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
          // the number of header rows
          headerRows: 1,

          // the width of each column, can be an array of widths
          widths,

          // all the rows to display, including the header rows
          body: [headerRow, ...rows],

          // Header row is 40px, other rows are 15px
          heights: (rowIndex) => (rowIndex === 0 ? headerHeight : rowHeight),
        },
        layout: createLayout(1, styles),
      },
    ],
    pageMargins: [10, 10, 10, 10],
  };
};

export const exportToPDF = (tableRef, styles = {}) => {
  const gridApi = tableRef.current?.getApi();

  const doc = getDocument(gridApi, styles);
  pdfMake.createPdf(doc).download();
};
